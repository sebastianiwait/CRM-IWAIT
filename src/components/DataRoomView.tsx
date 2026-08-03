import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Folder,
  FolderPlus,
  FileText,
  FileSpreadsheet,
  Download,
  Search,
  Plus,
  UserPlus,
  ChevronRight,
  X,
  Cloud,
  RefreshCw,
  Trash2,
  ExternalLink,
  Lock,
  LogOut,
  Code,
  Link2,
  Upload,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { DataRoomFile, DataRoomKind, dataRoomKind, DATA_ROOM_FOLDERS } from '../data/iwaitData';
import {
  initAuth,
  googleSignIn,
  logoutUser,
  listDriveFiles,
  uploadFileToDrive,
  deleteDriveFile,
  DriveFile,
  formatBytes
} from '../lib/googleDrive';
import { User } from 'firebase/auth';

interface DataRoomViewProps {
  files: DataRoomFile[];
  onUploadFile: (newFile: Omit<DataRoomFile, 'id'>) => void;
  onDeleteFile: (id: string) => void;
  triggerToast: (msg: string) => void;
}

/* ------------------------- Helpers de presentación ------------------------- */

const FOLDER_COLORS = ['#0E457F', '#47B6E6', '#00C9A7', '#F5A623', '#8B63F5', '#E879A0'];

const folderColor = (name: string, allFolders: string[]) =>
  FOLDER_COLORS[Math.max(0, allFolders.indexOf(name)) % FOLDER_COLORS.length];

/** Detecta el servicio de un enlace externo para mostrarlo con nombre propio */
const linkProvider = (url: string): { name: string; color: string } => {
  try {
    const h = new URL(url).hostname;
    if (h.includes('docs.google')) {
      if (url.includes('/spreadsheets')) return { name: 'Google Sheets', color: '#0F9D58' };
      if (url.includes('/presentation')) return { name: 'Google Slides', color: '#F4B400' };
      return { name: 'Google Docs', color: '#4285F4' };
    }
    if (h.includes('drive.google')) return { name: 'Google Drive', color: '#4285F4' };
    if (h.includes('canva.com')) return { name: 'Canva', color: '#8B3DFF' };
    if (h.includes('figma.com')) return { name: 'Figma', color: '#A259FF' };
    if (h.includes('notion.s')) return { name: 'Notion', color: '#0F1A2C' };
    return { name: h.replace('www.', ''), color: '#64748B' };
  } catch {
    return { name: 'Enlace web', color: '#64748B' };
  }
};

const KIND_META: Record<DataRoomKind, { label: string; color: string }> = {
  file: { label: 'Archivo', color: '#F05252' },
  html: { label: 'HTML', color: '#8B63F5' },
  link: { label: 'Enlace', color: '#47B6E6' }
};

const kindIcon = (f: DataRoomFile, cls = 'w-4 h-4') => {
  const k = dataRoomKind(f);
  if (k === 'link') return <Link2 className={cls} />;
  if (k === 'html') return <Code className={cls} />;
  if (/\.xlsx?$|\.csv$/i.test(f.name)) return <FileSpreadsheet className={cls} />;
  return <FileText className={cls} />;
};

const confChip = (c: DataRoomFile['confidentiality']) => {
  if (c === 'Solo Directiva') return 'bg-[#F05252]/12 text-[#F05252]';
  if (c === 'Confidencial') return 'bg-[#F5A623]/14 text-[#b8790f]';
  return 'bg-[#10CC82]/12 text-[#0f9c66]';
};

/** Hasta este tamaño el archivo se guarda en el navegador y se puede previsualizar */
const MAX_INLINE_BYTES = 2.5 * 1024 * 1024;

/* -------------------------------- Vista -------------------------------- */

export default function DataRoomView({ files, onUploadFile, onDeleteFile, triggerToast }: DataRoomViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'carpetas' | 'drive'>('carpetas');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  /* ------------------------- Formulario "Añadir" ------------------------- */
  const [addKind, setAddKind] = useState<DataRoomKind>('file');
  const [newName, setNewName] = useState('');
  const [newFolder, setNewFolder] = useState<string>(DATA_ROOM_FOLDERS[0]);
  const [isNewFolderMode, setIsNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newConf, setNewConf] = useState<DataRoomFile['confidentiality']>('Confidencial');
  const [newDesc, setNewDesc] = useState('');
  const [newHtml, setNewHtml] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [pickedFile, setPickedFile] = useState<{ name: string; size: number; dataUrl?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Share Access Form
  const [shareEmail, setShareEmail] = useState('');
  const [sharePerm, setSharePerm] = useState<'Completo' | 'Parcial' | 'Solo Lectura'>('Completo');

  /* ----------------------- Google Drive (sin cambios) ----------------------- */
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveSearchTerm, setDriveSearchTerm] = useState('');
  const [isExportingToDrive, setIsExportingToDrive] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importFileSelected, setImportFileSelected] = useState<DriveFile | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setDriveUser(user);
        setDriveToken(token);
        fetchDriveFiles(token);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchDriveFiles = async (token: string) => {
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const filesList = await listDriveFiles(token);
      setDriveFiles(filesList);
    } catch (err) {
      console.error(err);
      setDriveError('No se pudieron obtener los archivos de Google Drive. Por favor, re-inicie sesión.');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setDriveUser(res.user);
        setDriveToken(res.accessToken);
        triggerToast('Sesión de Google iniciada. Conectando Google Drive...');
        await fetchDriveFiles(res.accessToken);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error de autenticación con Google.');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logoutUser();
      setDriveUser(null);
      setDriveToken(null);
      setDriveFiles([]);
      triggerToast('Sesión de Google cerrada.');
    } catch (err) {
      console.error(err);
      triggerToast('Error al cerrar sesión de Google.');
    }
  };

  const handleDeleteDriveFile = async (id: string, name: string) => {
    if (!driveToken) return;
    const confirmed = window.confirm(
      `¿Está absolutamente seguro de que desea eliminar el archivo "${name}" de su Google Drive? Esta operación modificará los archivos en su nube.`
    );
    if (!confirmed) return;
    try {
      await deleteDriveFile(driveToken, id);
      triggerToast(`Archivo "${name}" eliminado exitosamente de Google Drive.`);
      fetchDriveFiles(driveToken);
    } catch (err) {
      console.error(err);
      triggerToast('Incapaz de eliminar el archivo de Google Drive.');
    }
  };

  const handleExportToDrive = async (file: DataRoomFile) => {
    if (!driveUser || !driveToken) {
      try {
        const res = await googleSignIn();
        if (res) {
          setDriveUser(res.user);
          setDriveToken(res.accessToken);
          triggerToast('Sesión de Google iniciada. Exportando...');
          await doExport(res.accessToken, file);
        }
      } catch {
        triggerToast('Por favor, inicie sesión en Google para exportar.');
      }
    } else {
      await doExport(driveToken, file);
    }
  };

  const doExport = async (token: string, file: DataRoomFile) => {
    setIsExportingToDrive(true);
    try {
      const contentStr =
        `Documento del Data Room (iwait Platform CRM):\n` +
        `======================================================\n` +
        `Nombre: ${file.name}\nCarpeta: ${file.category}\n` +
        `Confidencialidad: ${file.confidentiality}\nFecha: ${file.date}\n` +
        `Descripción:\n${file.description}\n\n${file.detailedContent}\n`;
      const docName = file.name.endsWith('.txt') ? file.name : `${file.name.replace(/\.[^/.]+$/, '')}.txt`;
      const uploaded = await uploadFileToDrive(token, docName, contentStr);
      triggerToast(`Documento "${file.name}" cargado con éxito en su Google Drive.`);
      if (uploaded.webViewLink) window.open(uploaded.webViewLink, '_blank');
      fetchDriveFiles(token);
    } catch (err) {
      console.error(err);
      triggerToast('Error durante la exportación de archivo.');
    } finally {
      setIsExportingToDrive(false);
    }
  };

  const handleStartImport = (df: DriveFile) => {
    setImportFileSelected(df);
    setNewName(df.name);
    setNewDesc(`Documento importado desde Google Drive.`);
    setIsImportOpen(true);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onUploadFile({
      name: newName,
      category: effectiveFolder(),
      confidentiality: newConf,
      kind: importFileSelected?.webViewLink ? 'link' : 'file',
      url: importFileSelected?.webViewLink,
      size: importFileSelected?.size ? formatBytes(importFileSelected.size) : '—',
      date: todayLabel(),
      description: newDesc || 'Importado desde Google Drive.',
      detailedContent: `Archivo de Google Drive (${importFileSelected?.mimeType ?? 'tipo desconocido'}).`
    });
    triggerToast(`"${newName}" importado de Google Drive al Data Room.`);
    setIsImportOpen(false);
    setImportFileSelected(null);
    resetAddForm();
  };

  /* ----------------------------- Carpetas ----------------------------- */

  // Carpetas = las sugeridas + cualquiera que exista en los archivos
  const folders = useMemo(() => {
    const set = new Set<string>(DATA_ROOM_FOLDERS);
    files.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, [files]);

  const folderFiles = (folder: string) => files.filter((f) => f.category === folder);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const t = searchTerm.toLowerCase();
    return files.filter(
      (f) =>
        f.name.toLowerCase().includes(t) ||
        f.description.toLowerCase().includes(t) ||
        f.category.toLowerCase().includes(t)
    );
  }, [files, searchTerm]);

  const filteredDriveFiles = useMemo(() => {
    if (!driveSearchTerm.trim()) return driveFiles;
    const term = driveSearchTerm.toLowerCase();
    return driveFiles.filter(
      (f) =>
        f.name.toLowerCase().includes(term) || (f.mimeType?.toLowerCase() || '').includes(term)
    );
  }, [driveFiles, driveSearchTerm]);

  const selected = selectedId ? files.find((f) => f.id === selectedId) ?? null : null;

  /* ----------------------------- Añadir contenido ----------------------------- */

  const todayLabel = () =>
    new Date().toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });

  const effectiveFolder = () =>
    isNewFolderMode && newFolderName.trim() ? newFolderName.trim() : newFolder;

  const resetAddForm = () => {
    setNewName('');
    setNewDesc('');
    setNewHtml('');
    setNewUrl('');
    setPickedFile(null);
    setIsNewFolderMode(false);
    setNewFolderName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!newName.trim()) setNewName(f.name);
    if (f.size <= MAX_INLINE_BYTES) {
      const reader = new FileReader();
      reader.onload = () => setPickedFile({ name: f.name, size: f.size, dataUrl: String(reader.result) });
      reader.readAsDataURL(f);
    } else {
      // Demasiado grande para guardarlo en el navegador: solo se registra la ficha
      setPickedFile({ name: f.name, size: f.size });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const folder = effectiveFolder();
    if (!folder) return;

    if (addKind === 'file') {
      if (!pickedFile) {
        triggerToast('Selecciona un archivo primero.');
        return;
      }
      onUploadFile({
        name: newName.trim() || pickedFile.name,
        category: folder,
        confidentiality: newConf,
        kind: 'file',
        dataUrl: pickedFile.dataUrl,
        size: formatBytes(String(pickedFile.size)),
        date: todayLabel(),
        description: newDesc || 'Sin descripción.',
        detailedContent: pickedFile.dataUrl
          ? 'Archivo guardado en el navegador; se puede previsualizar y descargar.'
          : `Archivo de ${formatBytes(String(pickedFile.size))}: supera el límite de almacenamiento local, se registró solo la ficha.`
      });
      triggerToast(`"${newName.trim() || pickedFile.name}" añadido a ${folder}.`);
    } else if (addKind === 'html') {
      if (!newName.trim() || !newHtml.trim()) {
        triggerToast('Ponle nombre y pega el HTML.');
        return;
      }
      onUploadFile({
        name: newName.endsWith('.html') ? newName : `${newName}.html`,
        category: folder,
        confidentiality: newConf,
        kind: 'html',
        contentType: 'html',
        size: `${(new Blob([newHtml]).size / 1024).toFixed(1)} KB`,
        date: todayLabel(),
        description: newDesc || 'Documento HTML.',
        detailedContent: newHtml
      });
      triggerToast(`Documento HTML añadido a ${folder}.`);
    } else {
      if (!newName.trim() || !newUrl.trim()) {
        triggerToast('Ponle nombre y pega el enlace.');
        return;
      }
      const url = /^https?:\/\//i.test(newUrl) ? newUrl.trim() : `https://${newUrl.trim()}`;
      onUploadFile({
        name: newName.trim(),
        category: folder,
        confidentiality: newConf,
        kind: 'link',
        url,
        size: '—',
        date: todayLabel(),
        description: newDesc || `Enlace a ${linkProvider(url).name}.`,
        detailedContent: `Enlace externo: ${url}`
      });
      triggerToast(`Enlace a ${linkProvider(url).name} añadido a ${folder}.`);
    }

    setOpenFolder(folder);
    setIsAddOpen(false);
    resetAddForm();
  };

  const handleDelete = (f: DataRoomFile) => {
    const ok = window.confirm(`¿Eliminar "${f.name}" del Data Room?`);
    if (!ok) return;
    onDeleteFile(f.id);
    setSelectedId(null);
    triggerToast(`"${f.name}" eliminado.`);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    triggerToast(`Invitación de acceso segura enviada a ${shareEmail} (${sharePerm})`);
    setShareEmail('');
    setIsShareOpen(false);
  };

  const openAdd = (kind: DataRoomKind) => {
    setAddKind(kind);
    if (openFolder) setNewFolder(openFolder);
    setIsAddOpen(true);
  };

  /* ---------------------------- Filas de archivo ---------------------------- */

  const FileRow: React.FC<{ f: DataRoomFile }> = ({ f }) => {
    const k = dataRoomKind(f);
    const meta = KIND_META[k];
    const provider = k === 'link' && f.url ? linkProvider(f.url) : null;
    return (
      <button
        onClick={() => setSelectedId(f.id)}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#fafcfe] transition-colors cursor-pointer group"
      >
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${provider?.color ?? meta.color}14`, color: provider?.color ?? meta.color }}
        >
          {kindIcon(f)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[13.5px] font-medium text-[#0F1A2C] group-hover:text-[#0E457F] transition-colors truncate">
              {f.name}
            </span>
            <span
              className="text-[9.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ backgroundColor: `${provider?.color ?? meta.color}14`, color: provider?.color ?? meta.color }}
            >
              {provider?.name ?? meta.label}
            </span>
          </span>
          <span className="block text-[11.5px] text-[#64748B] truncate mt-0.5">{f.description}</span>
        </span>
        <span className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${confChip(f.confidentiality)}`}>
            {f.confidentiality}
          </span>
          <span className="text-[10.5px] text-[#94a3b8] font-mono">{f.size} · {f.date}</span>
        </span>
        <ChevronRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#64748B] flex-shrink-0" />
      </button>
    );
  };

  /* -------------------------------- Render -------------------------------- */

  const input =
    'w-full bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[13.5px]';
  const label = 'block text-[11px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5';

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F1A2C] tracking-tight">Data Room</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Carpetas con archivos, documentos HTML y enlaces (Google Docs, Canva…)
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={activeSubTab === 'carpetas' ? searchTerm : driveSearchTerm}
              onChange={(e) =>
                activeSubTab === 'carpetas' ? setSearchTerm(e.target.value) : setDriveSearchTerm(e.target.value)
              }
              placeholder="Buscar documento..."
              className="bg-white border border-[#dceaf2] rounded-xl pl-9 pr-4 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[13px] w-[190px] md:w-[220px] shadow-sm"
            />
          </div>
          {activeSubTab === 'carpetas' && (
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-[#fafcfe] rounded-xl border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-[13px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <UserPlus className="w-[15px] h-[15px]" /> Compartir acceso
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e6eef4] gap-6">
        {([
          { key: 'carpetas', title: 'Carpetas' },
          { key: 'drive', title: 'Google Drive' }
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveSubTab(t.key);
              if (t.key === 'drive' && driveToken) fetchDriveFiles(driveToken);
            }}
            className={`pb-3 text-[14px] font-semibold tracking-wide transition-all relative cursor-pointer ${
              activeSubTab === t.key ? 'text-[#0E457F]' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            {activeSubTab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E457F]" />}
            {t.title}
          </button>
        ))}
      </div>

      {activeSubTab === 'carpetas' ? (
        searchTerm.trim() && searchResults ? (
          /* --------- Resultados de búsqueda (todas las carpetas) --------- */
          <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#eef2f6] text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchTerm}"
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {searchResults.map((f) => <FileRow key={f.id} f={f} />)}
              {searchResults.length === 0 && (
                <p className="px-4 py-10 text-center text-[13px] text-[#64748B]">Nada coincide con la búsqueda.</p>
              )}
            </div>
          </div>
        ) : openFolder === null ? (
          /* ------------------------- Raíz: carpetas ------------------------- */
          <div data-tour="dataroom-folders" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => {
              const its = folderFiles(folder);
              const color = folderColor(folder, folders);
              const latest = its[0]?.date;
              return (
                <button
                  key={folder}
                  onClick={() => setOpenFolder(folder)}
                  className="text-left bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: color }} />
                  <div className="flex items-center justify-between">
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color}14`, color }}
                    >
                      <Folder className="w-[22px] h-[22px]" />
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#64748B] transition-colors" />
                  </div>
                  <div className="text-[15px] font-bold text-[#0F1A2C] mt-3">{folder}</div>
                  <div className="text-[11.5px] text-[#64748B] mt-0.5">
                    {its.length} elemento{its.length !== 1 ? 's' : ''}{latest ? ` · últ. ${latest}` : ''}
                  </div>
                </button>
              );
            })}

            {/* Nueva carpeta: se crea al añadirle su primer contenido */}
            <button
              onClick={() => {
                setIsNewFolderMode(true);
                openAdd('file');
              }}
              className="text-left rounded-2xl border border-dashed border-[#c6d9e4] p-5 hover:border-[#47B6E6] hover:bg-white/60 transition-all cursor-pointer flex flex-col items-start justify-center min-h-[130px]"
            >
              <span className="w-11 h-11 rounded-xl bg-[#eef2f6] text-[#64748B] flex items-center justify-center">
                <FolderPlus className="w-[22px] h-[22px]" />
              </span>
              <div className="text-[13.5px] font-semibold text-[#64748B] mt-3">Nueva carpeta</div>
              <div className="text-[11.5px] text-[#94a3b8] mt-0.5">Se crea al guardar su primer documento</div>
            </button>
          </div>
        ) : (
          /* --------------------- Dentro de una carpeta --------------------- */
          <div className="space-y-4">
            {/* Breadcrumb + acciones */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[13.5px]">
                <button
                  onClick={() => setOpenFolder(null)}
                  className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0E457F] font-medium cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Data Room
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
                <span className="font-bold text-[#0F1A2C]">{openFolder}</span>
                <span className="text-[11px] text-[#64748B] bg-[#eef2f6] px-2 py-0.5 rounded-full font-semibold">
                  {folderFiles(openFolder).length}
                </span>
              </div>
              <div className="flex gap-2">
                {([
                  { kind: 'file' as DataRoomKind, label: 'Subir archivo', icon: <Upload className="w-[14px] h-[14px]" /> },
                  { kind: 'html' as DataRoomKind, label: 'HTML', icon: <Code className="w-[14px] h-[14px]" /> },
                  { kind: 'link' as DataRoomKind, label: 'Enlace', icon: <Link2 className="w-[14px] h-[14px]" /> }
                ]).map((b, i) => (
                  <button
                    key={b.kind}
                    onClick={() => openAdd(b.kind)}
                    className={`px-3 py-2 rounded-xl text-[12.5px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      i === 0
                        ? 'bg-[#0E457F] hover:bg-[#0A365F] text-white'
                        : 'bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] shadow-sm'
                    }`}
                  >
                    {b.icon} {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de la carpeta */}
            <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden">
              <div className="divide-y divide-[#f1f5f9]">
                {folderFiles(openFolder).map((f) => <FileRow key={f.id} f={f} />)}
                {folderFiles(openFolder).length === 0 && (
                  <div className="py-14 text-center">
                    <Folder className="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
                    <p className="text-[13px] text-[#64748B]">Carpeta vacía.</p>
                    <p className="text-[11.5px] text-[#94a3b8] mt-1">
                      Sube un archivo, pega HTML o guarda un enlace con los botones de arriba.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        /* ----------------------------- Google Drive ----------------------------- */
        <div className="space-y-6">
          {!driveUser ? (
            <div className="p-10 border border-[#e6eef4] bg-white rounded-2xl text-center max-w-2xl mx-auto space-y-5 shadow-sm animate-zoom-in">
              <div className="w-16 h-16 rounded-full bg-[#0E457F]/10 flex items-center justify-center mx-auto">
                <Cloud className="w-8 h-8 text-[#47B6E6]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0F1A2C]">Conecta tu Google Drive</h3>
                <p className="text-[13px] text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Inicia sesión con Google para ver tus archivos de Drive, importarlos al Data Room como enlaces
                  y exportar fichas de documentos a la nube.
                </p>
              </div>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoadingDrive}
                className="px-6 py-2.5 bg-white text-gray-900 border border-[#e6eef4] rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm flex items-center gap-2.5 mx-auto cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoadingDrive ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.0003 4.75c1.67 0 3.13.58 4.31 1.69l3.22-3.22C17.5603 1.33 14.9303.5 12.0003.5c-4.66 0-8.62 2.68-10.51 6.59l3.99 3.1c.95-2.85 3.63-4.94 6.52-4.94z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.84-.07-1.64-.21-2.42h-11.28v4.61h6.45c-.28 1.48-1.12 2.73-2.39 3.58l3.71 2.88c2.17-2 3.43-4.95 3.43-8.65z"/>
                    <path fill="#FBBC05" d="M5.48 14.79a7.1 7.1 0 0 1 0-4.58l-3.99-3.1a11.96 11.96 0 0 0 0 10.78l3.99-3.1z"/>
                    <path fill="#34A853" d="M12.0003 23.5c3.24 0 5.97-1.07 7.96-2.92l-3.71-2.88c-1.03.69-2.35 1.1-4.25 1.1-2.89 0-5.57-2.09-6.52-4.94l-3.99 3.1c1.89 3.91 5.85 6.54 10.51 6.54z"/>
                  </svg>
                )}
                {isLoadingDrive ? 'Iniciando conexión...' : 'Conectar Google Drive'}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#64748B] font-mono leading-none">
                <Lock className="w-3 h-3" /> Autenticación OAuth segura de Google
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e6eef4] rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#fbfdfe] px-5 py-4 border-b border-[#eef2f6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#10CC82]/10 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-[#10CC82]" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#0F1A2C]">Google Drive conectado</h4>
                    <p className="text-[11px] text-[#64748B]">{driveUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchDriveFiles(driveToken!)}
                    disabled={isLoadingDrive}
                    className="px-3 py-1.5 bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0E457F] rounded-lg text-[12px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDrive ? 'animate-spin' : ''}`} /> Sincronizar
                  </button>
                  <button
                    onClick={handleGoogleLogout}
                    className="px-3 py-1.5 bg-[#F05252]/8 hover:bg-[#F05252]/15 border border-[#F05252]/20 text-[#F05252] rounded-lg text-[12px] flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
                  >
                    <LogOut className="w-3 h-3" /> Desconectar
                  </button>
                </div>
              </div>

              <div className="p-4">
                {isLoadingDrive ? (
                  <div className="p-12 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#0E457F] animate-spin mx-auto" />
                    <p className="text-[12.5px] text-[#64748B]">Recuperando archivos de Google Drive...</p>
                  </div>
                ) : driveError ? (
                  <div className="p-8 text-center bg-[#F05252]/5 border border-[#F05252]/20 rounded-xl text-[#F05252] text-[13px] space-y-3 max-w-lg mx-auto">
                    <p>{driveError}</p>
                    <button
                      onClick={handleGoogleLogin}
                      className="px-4 py-1.5 bg-[#F05252]/15 hover:bg-[#F05252]/25 rounded-lg text-xs cursor-pointer font-semibold"
                    >
                      Volver a autenticar
                    </button>
                  </div>
                ) : filteredDriveFiles.length === 0 ? (
                  <div className="p-14 text-center space-y-2">
                    <Cloud className="w-10 h-10 text-[#cbd5e1] mx-auto" />
                    <div className="text-[13px] text-[#64748B]">No se encontraron archivos en Google Drive.</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] text-[#0F1A2C]">
                      <thead>
                        <tr className="border-b border-[#e6eef4] text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                          <th className="px-4 py-3">Archivo</th>
                          <th className="px-4 py-3 text-center">Tamaño</th>
                          <th className="px-4 py-3">Modificado</th>
                          <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {filteredDriveFiles.map((df) => {
                          const isSheet = df.mimeType?.includes('spreadsheet') || false;
                          return (
                            <tr key={df.id} className="hover:bg-[#fafcfe] transition-all group">
                              <td className="px-4 py-3 font-medium">
                                <div className="flex items-center gap-2.5">
                                  {isSheet ? (
                                    <FileSpreadsheet className="w-4 h-4 text-[#0F9D58] flex-shrink-0" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-[#4285F4] flex-shrink-0" />
                                  )}
                                  <span className="truncate max-w-[260px] inline-block" title={df.name}>{df.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-[#64748B] font-mono text-[12px]">
                                {df.size ? formatBytes(df.size) : '—'}
                              </td>
                              <td className="px-4 py-3 text-[#64748B] text-[12.5px]">
                                {df.modifiedTime
                                  ? new Date(df.modifiedTime).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
                                  : 'Reciente'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleStartImport(df)}
                                    className="px-2.5 py-1 bg-[#0E457F]/8 text-[#0E457F] hover:bg-[#0E457F]/15 rounded-lg text-[11.5px] font-medium cursor-pointer transition-all"
                                  >
                                    Importar
                                  </button>
                                  {df.webViewLink && (
                                    <a
                                      href={df.webViewLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2 py-1 bg-white border border-[#e6eef4] rounded-lg text-[#64748B] hover:text-[#0F1A2C] transition-all flex items-center gap-1 text-[11.5px]"
                                    >
                                      Ver <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleDeleteDriveFile(df.id, df.name)}
                                    className="p-1.5 text-[#cbd5e1] hover:text-[#F05252] rounded-lg cursor-pointer transition-all"
                                    title="Eliminar de Google Drive"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------- Panel de detalle (slide-over) --------------------- */}
      {selected && (() => {
        const k = dataRoomKind(selected);
        const provider = k === 'link' && selected.url ? linkProvider(selected.url) : null;
        return (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedId(null)}></div>
            <div className="relative w-full max-w-[620px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
              <div className="bg-gradient-to-br from-[#0E457F] to-[#47B6E6] px-5 py-4 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] text-white/70 font-mono">
                      {selected.category} · {provider?.name ?? KIND_META[k].label} · {selected.date}
                    </div>
                    <h3 className="text-[16px] font-bold text-white mt-1 leading-snug break-words">{selected.name}</h3>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-white/70 hover:text-white p-1 flex-shrink-0 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${confChip(selected.confidentiality)}`}>
                    {selected.confidentiality}
                  </span>
                  <span className="text-[11px] text-[#94a3b8] font-mono">{selected.size}</span>
                </div>

                <p className="text-[13px] text-[#33475b] leading-relaxed">{selected.description}</p>

                {/* Vista previa según el tipo */}
                {k === 'link' && selected.url ? (
                  <div className="border border-[#e6eef4] rounded-xl p-6 text-center space-y-3 bg-[#fbfdfe]">
                    <span
                      className="w-12 h-12 rounded-xl inline-flex items-center justify-center"
                      style={{ backgroundColor: `${provider!.color}14`, color: provider!.color }}
                    >
                      <Link2 className="w-6 h-6" />
                    </span>
                    <div className="text-[13.5px] font-semibold text-[#0F1A2C]">Documento en {provider!.name}</div>
                    <p className="text-[11.5px] text-[#64748B] font-mono break-all px-4">{selected.url}</p>
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-[13px] font-medium transition-all"
                      style={{ backgroundColor: provider!.color }}
                    >
                      Abrir en {provider!.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : k === 'html' ? (
                  <div className="border border-[#e6eef4] rounded-xl overflow-hidden bg-white">
                    <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#e6eef4] bg-[#fbfdfe]">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                        <Code className="w-3.5 h-3.5" /> Vista previa HTML
                      </div>
                      <span className="text-[10px] text-[#94a3b8]">scripts bloqueados</span>
                    </div>
                    <iframe
                      title={selected.name}
                      // sandbox sin allow-scripts: renderiza estilos pero aísla el JS del CRM
                      sandbox=""
                      srcDoc={`<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,-apple-system,sans-serif;color:#0F1A2C;padding:14px;margin:0;font-size:13px;line-height:1.6}img{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #e6eef4;padding:6px}</style>${selected.detailedContent}`}
                      className="w-full h-[340px] bg-white"
                    />
                  </div>
                ) : selected.dataUrl ? (
                  <div className="border border-[#e6eef4] rounded-xl overflow-hidden bg-white">
                    <div className="flex items-center gap-1.5 px-3.5 py-2 border-b border-[#e6eef4] bg-[#fbfdfe] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      <Eye className="w-3.5 h-3.5" /> Vista previa
                    </div>
                    <iframe title={selected.name} src={selected.dataUrl} className="w-full h-[420px] bg-white" />
                  </div>
                ) : (
                  <div className="bg-[#fbfdfe] border border-[#eef2f6] rounded-xl p-4">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Resumen</div>
                    <p className="text-[12.5px] text-[#33475b] whitespace-pre-wrap leading-relaxed">{selected.detailedContent}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#eef2f6] p-4 flex flex-wrap gap-2 justify-end flex-shrink-0 bg-[#fbfdfe]">
                <button
                  onClick={() => handleDelete(selected)}
                  className="px-3 py-2 rounded-xl text-[12.5px] text-[#F05252] hover:bg-[#F05252]/8 flex items-center gap-1.5 cursor-pointer transition-colors mr-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
                {selected.dataUrl && (
                  <a
                    href={selected.dataUrl}
                    download={selected.name}
                    className="px-3.5 py-2 bg-white border border-[#e6eef4] text-[#33475b] hover:text-[#0F1A2C] rounded-xl text-[12.5px] font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar
                  </a>
                )}
                <button
                  onClick={() => handleExportToDrive(selected)}
                  disabled={isExportingToDrive}
                  className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Cloud className="w-3.5 h-3.5" /> {isExportingToDrive ? 'Exportando…' : 'Exportar a Drive'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* -------------------------- Modal "Añadir" -------------------------- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[55] bg-[#0F1A2C]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6eef4] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
            <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-[15px] font-bold text-[#0F1A2C]">Añadir al Data Room</h3>
              <button
                onClick={() => { setIsAddOpen(false); resetAddForm(); }}
                className="text-[#94a3b8] hover:text-[#0F1A2C] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 overflow-y-auto">
              {/* Tipo de contenido */}
              <div className="grid grid-cols-3 gap-2">
                {([
                  { kind: 'file' as DataRoomKind, label: 'Archivo', icon: <Upload className="w-4 h-4" /> },
                  { kind: 'html' as DataRoomKind, label: 'HTML', icon: <Code className="w-4 h-4" /> },
                  { kind: 'link' as DataRoomKind, label: 'Enlace', icon: <Link2 className="w-4 h-4" /> }
                ]).map((t) => (
                  <button
                    key={t.kind}
                    type="button"
                    onClick={() => setAddKind(t.kind)}
                    className={`py-2.5 rounded-xl text-[12.5px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                      addKind === t.kind
                        ? 'bg-[#0E457F] text-white border-transparent'
                        : 'bg-[#f4fafc] text-[#64748B] border-[#dceaf2] hover:text-[#0F1A2C]'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Campo principal según el tipo */}
              {addKind === 'file' && (
                <div>
                  <input ref={fileInputRef} type="file" onChange={handlePickFile} className="hidden" id="dr-file-input" />
                  <label
                    htmlFor="dr-file-input"
                    className="block border-2 border-dashed border-[#c6d9e4] hover:border-[#47B6E6] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#fbfdfe]"
                  >
                    {pickedFile ? (
                      <>
                        <FileText className="w-7 h-7 text-[#0E457F] mx-auto mb-1.5" />
                        <div className="text-[13px] font-semibold text-[#0F1A2C] break-all px-2">{pickedFile.name}</div>
                        <div className="text-[11.5px] text-[#64748B] mt-0.5">
                          {formatBytes(String(pickedFile.size))}
                          {!pickedFile.dataUrl && ' · muy grande para vista previa, se guarda solo la ficha'}
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-[#94a3b8] mx-auto mb-1.5" />
                        <div className="text-[13px] font-medium text-[#33475b]">Haz clic para elegir un archivo</div>
                        <div className="text-[11.5px] text-[#94a3b8] mt-0.5">PDF, Excel, imágenes… (vista previa hasta 2.5 MB)</div>
                      </>
                    )}
                  </label>
                </div>
              )}

              {addKind === 'link' && (
                <div>
                  <label className={label}>URL del documento</label>
                  <input
                    className={input}
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://docs.google.com/… o https://canva.com/…"
                    required
                  />
                  {newUrl.trim() && (
                    <p className="text-[11.5px] mt-1.5 font-medium" style={{ color: linkProvider(newUrl).color }}>
                      Detectado: {linkProvider(/^https?:\/\//i.test(newUrl) ? newUrl : `https://${newUrl}`).name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className={label}>Nombre</label>
                <input
                  className={input}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={addKind === 'link' ? 'Ej. One-pager comercial' : 'Ej. Financial Model v5.xlsx'}
                  required={addKind !== 'file'}
                />
              </div>

              {addKind === 'html' && (
                <div>
                  <label className={label}>Código HTML</label>
                  <textarea
                    value={newHtml}
                    onChange={(e) => setNewHtml(e.target.value)}
                    placeholder={'<h2>Resumen ejecutivo</h2>\n<p>Pega aquí tu HTML…</p>'}
                    rows={6}
                    className="w-full bg-[#0F1A2C] border border-[#e6eef4] rounded-xl px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#47B6E6] text-[12.5px] font-mono resize-y"
                  />
                  <p className="text-[11px] text-[#94a3b8] mt-1.5">Los estilos funcionan; los scripts quedan bloqueados.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Carpeta</label>
                  {isNewFolderMode ? (
                    <div className="flex gap-1.5">
                      <input
                        className={input}
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Nombre de la carpeta"
                        autoFocus
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsNewFolderMode(false)}
                        className="px-2 text-[#94a3b8] hover:text-[#0F1A2C] cursor-pointer"
                        title="Usar carpeta existente"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <select
                      className={`${input} cursor-pointer`}
                      value={newFolder}
                      onChange={(e) => {
                        if (e.target.value === '__new__') setIsNewFolderMode(true);
                        else setNewFolder(e.target.value);
                      }}
                    >
                      {folders.map((f) => <option key={f} value={f}>{f}</option>)}
                      <option value="__new__">+ Nueva carpeta…</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className={label}>Confidencialidad</label>
                  <select
                    className={`${input} cursor-pointer`}
                    value={newConf}
                    onChange={(e) => setNewConf(e.target.value as DataRoomFile['confidentiality'])}
                  >
                    <option value="Público">Público</option>
                    <option value="Confidencial">Confidencial</option>
                    <option value="Solo Directiva">Solo Directiva</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={label}>Descripción breve</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Qué contiene y para qué sirve"
                  rows={2}
                  className={`${input} resize-none`}
                />
              </div>

              <div className="border-t border-[#eef2f6] pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); resetAddForm(); }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl font-medium text-sm cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------- Modal "Compartir acceso" ---------------------- */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[55] bg-[#0F1A2C]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6eef4] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0F1A2C]">Compartir acceso seguro</h3>
              <button onClick={() => setIsShareOpen(false)} className="text-[#94a3b8] hover:text-[#0F1A2C] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleShare} className="p-5 space-y-4">
              <div>
                <label className={label}>Correo del inversor o socio</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="socio@fondo.com"
                  className={input}
                  required
                />
              </div>
              <div>
                <label className={label}>Permisos</label>
                <select
                  value={sharePerm}
                  onChange={(e) => setSharePerm(e.target.value as typeof sharePerm)}
                  className={`${input} cursor-pointer`}
                >
                  <option value="Completo">Acceso completo (Finanzas + Legal)</option>
                  <option value="Parcial">Acceso parcial (Legal + Pitch)</option>
                  <option value="Solo Lectura">Solo lectura financiero</option>
                </select>
              </div>
              <div className="border-t border-[#eef2f6] pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsShareOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl font-medium text-sm cursor-pointer">
                  Enviar invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------- Modal "Importar desde Drive" ------------------- */}
      {isImportOpen && importFileSelected && (
        <div className="fixed inset-0 z-[55] bg-[#0F1A2C]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6eef4] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0F1A2C] flex items-center gap-2">
                <Cloud className="w-5 h-5 text-[#0E457F]" /> Importar al Data Room
              </h3>
              <button
                onClick={() => { setIsImportOpen(false); setImportFileSelected(null); resetAddForm(); }}
                className="text-[#94a3b8] hover:text-[#0F1A2C] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleImportSubmit} className="p-5 space-y-4">
              <p className="text-[12px] text-[#64748B] bg-[#fbfdfe] border border-[#eef2f6] rounded-xl px-3 py-2.5">
                Se guarda como <strong className="text-[#0F1A2C]">enlace al archivo en tu Drive</strong>: siempre
                abre la versión actual, sin duplicar contenido.
              </p>
              <div>
                <label className={label}>Nombre en el Data Room</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={input} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Carpeta destino</label>
                  <select className={`${input} cursor-pointer`} value={newFolder} onChange={(e) => setNewFolder(e.target.value)}>
                    {folders.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label}>Confidencialidad</label>
                  <select
                    className={`${input} cursor-pointer`}
                    value={newConf}
                    onChange={(e) => setNewConf(e.target.value as DataRoomFile['confidentiality'])}
                  >
                    <option value="Público">Público</option>
                    <option value="Confidencial">Confidencial</option>
                    <option value="Solo Directiva">Solo Directiva</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={label}>Descripción</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} className={`${input} resize-none`} />
              </div>
              <div className="border-t border-[#eef2f6] pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setIsImportOpen(false); setImportFileSelected(null); resetAddForm(); }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl font-medium text-sm cursor-pointer">
                  Importar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
