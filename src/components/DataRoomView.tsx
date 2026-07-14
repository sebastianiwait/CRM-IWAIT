import React, { useState, useMemo, useEffect } from 'react';
import { 
  Folder, 
  FolderLock, 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Plus, 
  UserPlus, 
  ChevronRight, 
  X,
  Eye,
  Cloud,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Lock,
  LogOut,
  UploadIcon,
  Sparkles
} from 'lucide-react';
import { DataRoomFile } from '../data/iwaitData';
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
  triggerToast: (msg: string) => void;
}

export default function DataRoomView({ files, onUploadFile, triggerToast }: DataRoomViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'local' | 'drive'>('local');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolder, setExpandedFolder] = useState<string | null>('Financiero');
  const [selectedFile, setSelectedFile] = useState<DataRoomFile | null>(files[0]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // New File Form
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<'Legal' | 'Finanzas' | 'Producto' | 'Marketing'>('Finanzas');
  const [newFileConf, setNewFileConf] = useState<'Público' | 'Confidencial' | 'Solo Directiva'>('Confidencial');
  const [newFileDesc, setNewFileDesc] = useState('');

  // Share Access Form
  const [shareEmail, setShareEmail] = useState('');
  const [sharePerm, setSharePerm] = useState<'Completo' | 'Parcial' | 'Solo Lectura'>('Completo');

  // Google Drive Integration States
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveSearchTerm, setDriveSearchTerm] = useState('');
  const [isExportingToDrive, setIsExportingToDrive] = useState(false);
  
  // Import from Drive Form states
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importFileSelected, setImportFileSelected] = useState<DriveFile | null>(null);

  // Subscribe to Firebase Auth and token cache on load
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

  // Fetch file list from Google Drive
  const fetchDriveFiles = async (token: string) => {
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const filesList = await listDriveFiles(token);
      setDriveFiles(filesList);
    } catch (err: any) {
      console.error(err);
      setDriveError('No se pudieron obtener los archivos de Google Drive. Por favor, re-inicie sesión.');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  // Google Sign In Popup click handler
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
    } catch (err: any) {
      console.error(err);
      triggerToast('Error de autenticación con Google.');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  // Logout Google connection
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

  // Delete a file in Google Drive after safety user check
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

  // Export current Data Room document metadata + content to Google Drive
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
      } catch (err) {
        triggerToast('Por favor, inicie sesión en Google para exportar.');
      }
    } else {
      await doExport(driveToken, file);
    }
  };

  const doExport = async (token: string, file: DataRoomFile) => {
    setIsExportingToDrive(true);
    try {
      const contentStr = `Sumario de Documento Corp (iwait Platform CRM):\n` +
        `======================================================\n` +
        `Nombre: ${file.name}\n` +
        `Categoría: ${file.category}\n` +
        `Confidencialidad: ${file.confidentiality}\n` +
        `Fecha de Registro: ${file.date}\n` +
        `Descripción básica:\n${file.description}\n\n` +
        `Resumen Detallado / Datos Encriptados:\n` +
        `------------------------------------------------------\n` +
        `${file.detailedContent}\n`;

      const docName = file.name.endsWith('.txt') ? file.name : `${file.name.replace(/\.[^/.]+$/, '')}.txt`;
      const uploaded = await uploadFileToDrive(token, docName, contentStr);
      triggerToast(`Documento "${file.name}" cargado con éxito en su Google Drive.`);
      if (uploaded.webViewLink) {
        window.open(uploaded.webViewLink, '_blank');
      }
      fetchDriveFiles(token);
    } catch (err) {
      console.error(err);
      triggerToast('Error durante la exportación de archivo.');
    } finally {
      setIsExportingToDrive(false);
    }
  };

  // Start direct Drive File Import flow
  const handleStartImport = (df: DriveFile) => {
    setImportFileSelected(df);
    setNewFileName(df.name);
    setNewFileDesc(`Documento importado directamente desde Google Drive. ID original de nube: ${df.id}.`);
    setNewFileCategory('Finanzas');
    setNewFileConf('Confidencial');
    setIsImportOpen(true);
  };

  // Process the final import creation in the local state list
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      triggerToast('Proporcione un nombre válido.');
      return;
    }
    
    onUploadFile({
      name: newFileName,
      category: newFileCategory,
      confidentiality: newFileConf,
      size: importFileSelected?.size ? formatBytes(importFileSelected.size) : '2.4 MB',
      date: 'Hoy (Google Drive)',
      description: newFileDesc || 'Sin descripción.',
      detailedContent: `Detalle del documento importado de la nube:\n` +
        `• Archivo: ${newFileName}\n` +
        `• ID Drive: ${importFileSelected?.id || 'Desconocido'}\n` +
        `• Tipo MIME: ${importFileSelected?.mimeType || 'Desconocido'}\n` +
        `• Enlace cloud original:\n${importFileSelected?.webViewLink || 'No provisto'}\n\n` +
        `Para abrir el archivo en la nube, utilice el enlace original provisto arriba.`
    });

    triggerToast(`Archivo "${newFileName}" importado exitosamente de Google Drive a su Data Room.`);
    setIsImportOpen(false);
    setImportFileSelected(null);
    setNewFileName('');
    setNewFileDesc('');
  };

  // Filtered Files based on Search Term
  const filteredFiles = useMemo(() => {
    if (!searchTerm.trim()) return files;
    const term = searchTerm.toLowerCase();
    return files.filter(f => {
      const extension = f.name.split('.').pop()?.toLowerCase() || '';
      return (
        f.name.toLowerCase().includes(term) ||
        f.description.toLowerCase().includes(term) ||
        f.category.toLowerCase().includes(term) ||
        extension.includes(term)
      );
    });
  }, [files, searchTerm]);

  // Filtered Google Drive Files
  const filteredDriveFiles = useMemo(() => {
    if (!driveSearchTerm.trim()) return driveFiles;
    const term = driveSearchTerm.toLowerCase();
    return driveFiles.filter(f => {
      const extension = f.name.split('.').pop()?.toLowerCase() || '';
      const mimeType = f.mimeType?.toLowerCase() || '';
      return (
        f.name.toLowerCase().includes(term) ||
        extension.includes(term) ||
        mimeType.includes(term)
      );
    });
  }, [driveFiles, driveSearchTerm]);

  // Handle file submission
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      triggerToast('Proporcione un nombre válido para el archivo');
      return;
    }
    const safeName = newFileName.endsWith('.pdf') || newFileName.endsWith('.xlsx') ? newFileName : `${newFileName}.pdf`;
    
    onUploadFile({
      name: safeName,
      category: newFileCategory,
      confidentiality: newFileConf,
      size: `${(Math.random() * (12.5 - 1.2) + 1.2).toFixed(1)} MB`,
      date: 'Hoy',
      description: newFileDesc || 'Sin descripción detallada.',
      detailedContent: `Detalle del documento subido: "${safeName}"\n• Tipo: ${newFileCategory}\n• Clasificación: ${newFileConf}\n• Subido el: ${new Date().toLocaleDateString()}\n• Comentarios: Documento adjunto por Sebastian M.`
    });

    triggerToast(`Archivo "${safeName}" subido exitosamente al Data Room.`);
    setNewFileName('');
    setNewFileDesc('');
    setIsUploadOpen(false);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    triggerToast(`Invitación de acceso segura enviada a ${shareEmail} (${sharePerm})`);
    setShareEmail('');
    setIsShareOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#c3dae4] pb-5 gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0F1A2C] tracking-tight">Data Room</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Documentación confidencial para inversores</p>
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input 
              type="text"
              value={activeSubTab === 'local' ? searchTerm : driveSearchTerm}
              onChange={(e) => {
                if (activeSubTab === 'local') {
                  setSearchTerm(e.target.value);
                } else {
                  setDriveSearchTerm(e.target.value);
                }
              }}
              placeholder={activeSubTab === 'local' ? "Buscar por nombre, tipo, categoría..." : "Buscar por nombre o tipo..."}
              className="bg-[#14243A] border border-[#2A415A] rounded-lg pl-9 pr-4 py-1.8 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-[13px] w-[200px] md:w-[220px]"
            />
          </div>
          
          {activeSubTab === 'local' && (
            <>
              <button 
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="btn btn-ghost px-3.5 py-1.8 bg-transparent hover:bg-[#14243A] rounded-lg border border-[#2A415A] text-[#8DA2B5] hover:text-white text-[13px] flex items-center gap-1.5 transition-all text-sm cursor-pointer"
              >
                <UserPlus className="w-[15px] h-[15px]" /> Compartir acceso
              </button>
              <button 
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="btn btn-primary px-3.5 py-1.8 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
              >
                <Plus className="w-[15px] h-[15px]" /> Subir archivo
              </button>
            </>
          )}

          {activeSubTab === 'drive' && driveUser && (
            <button 
              type="button"
              onClick={() => fetchDriveFiles(driveToken!)}
              className="px-3.5 py-1.8 bg-[#1B2F49] hover:bg-[#22384F] text-[#47B6E6] rounded-lg border border-[#2A415A] text-[13px] flex items-center gap-1.5 transition-all cursor-pointer"
              disabled={isLoadingDrive}
            >
              <RefreshCw className={`w-[14px] h-[14px] ${isLoadingDrive ? 'animate-spin' : ''}`} /> Sincronizar
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-[#22384F] gap-6">
        <button 
          onClick={() => setActiveSubTab('local')}
          className={`pb-3 text-[14px] font-semibold tracking-wide transition-all relative cursor-pointer ${
            activeSubTab === 'local' 
              ? 'text-[#0E457F]' 
              : 'text-[#64748B] hover:text-[#EAF3F9]'
          }`}
        >
          {activeSubTab === 'local' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E457F]" />
          )}
          Expediente Data Room Local
        </button>
        <button 
          onClick={() => {
            setActiveSubTab('drive');
            if (driveToken) {
              fetchDriveFiles(driveToken);
            }
          }}
          className={`pb-3 text-[14px] font-semibold tracking-wide transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'drive' 
              ? 'text-[#0E457F]' 
              : 'text-[#64748B] hover:text-[#EAF3F9]'
          }`}
        >
          {activeSubTab === 'drive' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E457F]" />
          )}
          Google Drive Sincronizado <span className="bg-[#0E457F]/10 text-[#47B6E6] px-1.5 py-0.2 rounded-full text-[10px] font-bold">NUEVO</span>
        </button>
      </div>

      {activeSubTab === 'local' ? (
        /* Main split layout folder vs file details */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left column Folder explorer */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Carpetas principales</div>
            <div className="bg-[#14243A] border border-[#22384F] rounded-lg divide-y divide-[#22384F]">
              
              {/* Folder 1: Financiero */}
              <div>
                <div 
                  onClick={() => setExpandedFolder(expandedFolder === 'Financiero' ? null : 'Financiero')}
                  className="flex items-center gap-3 p-4 hover:bg-[#0E457F]/4 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0E457F]/15 flex items-center justify-center flex-shrink-0">
                    <Folder className="w-[18px] h-[18px] text-[#47B6E6]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-medium text-[#EAF3F9]">Financiero</div>
                    <div className="text-[11px] text-[#64748B]">14 archivos · Actualizado hace 2 días</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#64748B] transition-transform ${expandedFolder === 'Financiero' ? 'rotate-90' : ''}`} />
                </div>
                
                {expandedFolder === 'Financiero' && (
                  <div className="bg-[#1B2F49]/30 divide-y divide-[#22384F]/40 border-t border-[#22384F]/40">
                    {/* Hardcoded visual representation of the subfiles for maximum alignment */}
                    <div 
                      onClick={() => {
                        const f = files.find(x => x.category === 'Finanzas') || files[0];
                        setSelectedFile(f);
                      }}
                      className="flex items-center gap-3 py-2.5 px-10 hover:bg-[#0E457F]/6 cursor-pointer transition-colors"
                    >
                      <FileSpreadsheet className="w-[14px] h-[14px] text-[#0E457F]" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-[#EAF3F9] truncate">Financial Model v4.xlsx</div>
                        <div className="text-[11px] text-[#64748B]">Actualizado hoy · 8.4 MB</div>
                      </div>
                      <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] font-bold px-1.5 py-0.5 rounded">Actual</span>
                    </div>
                    
                    <div 
                      onClick={() => {
                        triggerToast('Descargando P&L Proyectado 2024-2027.pdf...');
                      }}
                      className="flex items-center gap-3 py-2.5 px-10 hover:bg-[#0E457F]/6 cursor-pointer transition-colors"
                    >
                      <FileText className="w-[14px] h-[14px] text-[#0E457F]" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-[#EAF3F9] truncate">P&L Proyectado 2024-2027.pdf</div>
                        <div className="text-[11px] text-[#64748B]">Hace 3 días · 4.8 MB</div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#64748B] hover:text-white" />
                    </div>

                    <div 
                      onClick={() => {
                        triggerToast('Descargando Cap Table 2026.pdf...');
                      }}
                      className="flex items-center gap-3 py-2.5 px-10 hover:bg-[#0E457F]/6 cursor-pointer transition-colors"
                    >
                      <FileText className="w-[14px] h-[14px] text-[#0E457F]" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-[#EAF3F9] truncate">Cap Table 2026.pdf</div>
                        <div className="text-[11px] text-[#64748B]">Hace 6 days • 2.1 MB</div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#64748B] hover:text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Folder 2: Legal */}
              <div 
                onClick={() => {
                  setExpandedFolder(expandedFolder === 'Legal' ? null : 'Legal');
                  const fl = files.find(x => x.category === 'Legal');
                  if (fl) setSelectedFile(fl);
                }}
                className="flex items-center gap-3 p-4 hover:bg-[#0E457F]/4 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#47B6E6]/15 flex items-center justify-center flex-shrink-0">
                  <FolderLock className="w-[18px] h-[18px] text-[#47B6E6]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-[#EAF3F9]">Legal</div>
                  <div className="text-[11px] text-[#64748B]">8 archivos · Actualizado hace 1 semana</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </div>

              {/* Folder 3: Producto & Tecnología */}
              <div 
                onClick={() => {
                  setExpandedFolder(expandedFolder === 'Producto' ? null : 'Producto');
                  const fl = files.find(x => x.category === 'Producto');
                  if (fl) setSelectedFile(fl);
                }}
                className="flex items-center gap-3 p-4 hover:bg-[#0E457F]/4 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00C9A7]/15 flex items-center justify-center flex-shrink-0">
                  <Folder className="w-[18px] h-[18px] text-[#00C9A7]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-[#EAF3F9]">Producto &amp; Tecnología</div>
                  <div className="text-[11px] text-[#64748B]">22 archivos · Actualizado ayer</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </div>

              {/* Folder 4: Due Diligence */}
              <div 
                onClick={() => triggerToast('Cargando sección de Due Diligence, 31 archivos indexados.')}
                className="flex items-center gap-3 p-4 hover:bg-[#0E457F]/4 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5A623]/15 flex items-center justify-center flex-shrink-0">
                  <Folder className="w-[18px] h-[18px] text-[#F5A623]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-[#EAF3F9]">Due Diligence</div>
                  <div className="text-[11px] text-[#64748B]">31 archivos de soporte comercial</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </div>

              {/* Folder 5: Pitch Deck & Demos */}
              <div 
                onClick={() => {
                  const fl = files.find(x => x.category === 'Marketing');
                  if (fl) setSelectedFile(fl);
                }}
                className="flex items-center gap-3 p-4 hover:bg-[#0E457F]/4 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E879A0]/15 flex items-center justify-center flex-shrink-0">
                  <Folder className="w-[18px] h-[18px] text-[#E879A0]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-[#EAF3F9]">Pitch Deck &amp; Demos</div>
                  <div className="text-[11px] text-[#64748B]">6 archivos de cara al público</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </div>

            </div>
          </div>

          {/* Right column File Viewer/Recent documents list */}
          <div className="lg:col-span-6 space-y-6">
            {/* Recent documents list */}
            <div>
              <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                {searchTerm.trim() ? `Resultados de la búsqueda (${filteredFiles.length})` : 'Documentos recientes'}
              </div>
              <div className="bg-[#14243A] border border-[#22384F] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Documento</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Carpeta</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Subido</th>
                      <th className="px-4 py-2.5 border-b border-[#22384F]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22384F]">
                    {(searchTerm.trim() ? filteredFiles : filteredFiles.slice(0, 4)).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#64748B] text-[13px]">
                          No se encontraron documentos que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      (searchTerm.trim() ? filteredFiles : filteredFiles.slice(0, 4)).map(file => (
                        <tr 
                          key={file.id} 
                          onClick={() => setSelectedFile(file)}
                          className={`hover:bg-[#0E457F]/4 cursor-pointer transition-colors ${selectedFile?.id === file.id ? 'bg-[#0E457F]/6' : ''}`}
                        >
                          <td className="px-4 py-2.5">
                            <div className="font-medium text-[#EAF3F9] text-[13px] max-w-[200px] truncate">{file.name}</div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              file.category === 'Finanzas' 
                                ? 'bg-[#0E457F]/15 text-[#47B6E6]' 
                                : file.category === 'Legal' 
                                ? 'bg-[#47B6E6]/15 text-[#47B6E6]'
                                : file.category === 'Producto' 
                                ? 'bg-[#00C9A7]/15 text-[#00C9A7]' 
                                : 'bg-[#E879A0]/15 text-[#E879A0]'
                            }`}>
                              {file.category}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-[#64748B] text-[11px]">{file.date}</td>
                          <td className="px-4 py-2.5 text-center" onClick={(e) => {
                            e.stopPropagation();
                            triggerToast(`Descargando ${file.name}...`);
                          }}>
                            <Download className="w-3.5 h-3.5 text-[#64748B] hover:text-white" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Document custom card inspector */}
            {selectedFile && (
              <div className="bg-[#1B2F49]/40 border border-[#2A415A] p-5 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#47B6E6]" />
                    <span className="text-[13px] text-[#64748B] font-semibold">{selectedFile.category.toUpperCase()} DOCUMENT</span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">{selectedFile.size}</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#EAF3F9]">{selectedFile.name}</h4>
                  <p className="text-[12px] text-[#8DA2B5]/85 mt-2 leading-relaxed bg-[#14243A]/50 p-3 rounded-md border border-[#22384F]">
                    {selectedFile.description}
                  </p>
                </div>
                <div className="bg-[#0F1A2C]/80 border border-[#22384F] p-3.5 rounded-lg">
                  <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider mb-2">Contenido Encriptado / Sumario</div>
                  <p className="text-[11.5px] font-mono text-[#47B6E6] whitespace-pre-wrap leading-relaxed">
                    {selectedFile.detailedContent}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-[12px] pt-1">
                  <div className="text-[#64748B]">Clasificación: <span className="font-semibold text-[#E879A0]">{selectedFile.confidentiality}</span></div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleExportToDrive(selectedFile)}
                      disabled={isExportingToDrive}
                      className="px-3 py-1.5 bg-[#0E457F]/10 hover:bg-[#0E457F]/20 border border-[#0E457F]/40 text-[#47B6E6] rounded transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-[11.5px] font-medium"
                    >
                      <Cloud className="w-3.5 h-3.5" /> {isExportingToDrive ? 'Exportando...' : 'Exportar a GDrive 🌐'}
                    </button>
                    <button 
                      onClick={() => triggerToast(`Descargando copia autorizada para Sebastian M.`)}
                      className="px-3 py-1.5 bg-[#0E457F]/15 text-[#47B6E6] hover:bg-[#0E457F]/30 rounded transition-colors flex items-center gap-1 cursor-pointer text-[11.5px] font-medium"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar Copia
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Access Logs from Investors Table */}
            <div className="bg-[#14243A] border border-[#22384F] rounded-lg">
              <div className="border-b border-[#22384F] px-4 py-3 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#EAF3F9]">Accesos de inversores</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-white/[0.01] text-left">
                    <th className="px-4 py-2 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Inversor</th>
                    <th className="px-4 py-2 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Acceso</th>
                    <th className="px-4 py-2 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Última visita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22384F]/60 text-[12.5px]">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[#EAF3F9]">Athos Capital</td>
                    <td className="px-4 py-2.5"><span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] font-bold px-1.5 py-0.5 rounded">Completo</span></td>
                    <td className="px-4 py-2.5 text-[#64748B]">Hoy, 14:32</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[#EAF3F9]">Kibo Ventures</td>
                    <td className="px-4 py-2.5"><span className="bg-[#0E457F]/15 text-[#47B6E6] text-[10px] font-bold px-1.5 py-0.5 rounded">Parcial</span></td>
                    <td className="px-4 py-2.5 text-[#64748B]">Ayer</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-[#EAF3F9]">Punto Capital</td>
                    <td className="px-4 py-2.5"><span className="bg-[#F5A623]/15 text-[#F5A623] text-[10px] font-bold px-1.5 py-0.5 rounded">Solo Financiero</span></td>
                    <td className="px-4 py-2.5 text-[#64748B]">Hace 3 días</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Google Drive synchronized browser */
        <div className="space-y-6">
          {!driveUser ? (
            /* Locked and promotional GDrive onboarding state */
            <div className="p-10 border border-[#22384F] bg-[#14243A] rounded-xl text-center max-w-2xl mx-auto space-y-5 shadow-xl animate-zoom-in">
              <div className="w-16 h-16 rounded-full bg-[#0E457F]/15 flex items-center justify-center mx-auto">
                <Cloud className="w-8 h-8 text-[#47B6E6]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#EAF3F9]">Sincronización Directa de Documentos en la Nube</h3>
                <p className="text-[13px] text-[#8DA2B5]/85 max-w-md mx-auto leading-relaxed">
                  Conecte su cuenta de Google Drive de forma segura mediante OAuth para ver carpetas de trabajo, respaldar actas en la nube, e importar archivos directamente a su Data Room CRM de <strong className="text-[#47B6E6]">sebastian@iwait.io</strong>.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoadingDrive}
                  className="px-6 py-2.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm flex items-center gap-2.5 mx-auto cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isLoadingDrive ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-gray-900" />
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
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#64748B] font-mono leading-none">
                <Lock className="w-3 h-3" /> Transmisión cifrada en entornos seguros de Google
              </div>
            </div>
          ) : (
            /* Connected visual container with full browser functionality */
            <div className="bg-[#14243A] border border-[#22384F] rounded-xl overflow-hidden shadow-xl">
              {/* Connected Account metadata bar */}
              <div className="bg-[#1B2F49] px-5 py-4 border-b border-[#22384F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#10CC82]/10 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-[#10CC82]" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#EAF3F9]">Tu Google Drive está conectado</h4>
                    <p className="text-[11px] text-[#64748B]">Expediente sincronizado corporativamente</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] bg-[#22384F] text-[#8DA2B5] px-2.5 py-1 rounded-lg border border-[#2A415A] font-mono">
                    {driveUser.email}
                  </span>
                  <button 
                    onClick={handleGoogleLogout}
                    className="p-1 px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 rounded-lg text-[12px] flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
                  >
                    <LogOut className="w-3 h-3" /> Desconectar
                  </button>
                </div>
              </div>

              {/* Main Directory Table list */}
              <div className="p-4">
                {isLoadingDrive ? (
                  <div className="p-12 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#0E457F] animate-spin mx-auto" />
                    <p className="text-[12.5px] text-[#64748B]">Recuperando árbol de archivos de Google Drive...</p>
                  </div>
                ) : driveError ? (
                  <div className="p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-lg text-rose-400 text-[13px] space-y-3 max-w-lg mx-auto">
                    <p>{driveError}</p>
                    <button 
                      onClick={handleGoogleLogin} 
                      className="px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-xs cursor-pointer font-semibold"
                    >
                      Volver a autenticar
                    </button>
                  </div>
                ) : filteredDriveFiles.length === 0 ? (
                  <div className="p-16 text-center space-y-3">
                    <svg className="w-12 h-12 text-[#64748B] mx-auto opacity-30" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div className="text-[13px] text-[#64748B]">No se encontraron archivos en Google Drive.</div>
                    <p className="text-[11.5px] text-[#64748B]/70 max-w-xs mx-auto">Pruebe subiendo un archivo o sumario nuevo desde un documento del CRM local.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] text-[#EAF3F9]">
                      <thead>
                        <tr className="border-b border-[#22384F] text-[#64748B] font-semibold text-[11px] uppercase tracking-wider text-left">
                          <th className="px-4 py-3">Nombre del Archivo en Drive</th>
                          <th className="px-4 py-3 text-center">Tamaño</th>
                          <th className="px-4 py-3">Última Modificación</th>
                          <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#22384F]/55">
                        {filteredDriveFiles.map((df) => {
                          const isDoc = df.mimeType?.includes('document') || false;
                          const isSheet = df.mimeType?.includes('spreadsheet') || false;
                          const isPdf = df.mimeType?.includes('pdf') || false;
                          
                          return (
                            <tr key={df.id} className="hover:bg-[#0E457F]/4 transition-all group">
                              <td className="px-4 py-3 font-medium">
                                <div className="flex items-center gap-2.5">
                                  {isDoc ? (
                                    <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                  ) : isSheet ? (
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  ) : isPdf ? (
                                    <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                  )}
                                  <span className="truncate max-w-[260px] inline-block" title={df.name}>
                                    {df.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-[#8DA2B5]/85 font-mono text-[12px]">
                                {df.size ? formatBytes(df.size) : 'Desconocido'}
                              </td>
                              <td className="px-4 py-3 text-[#64748B] text-[12.5px]">
                                {df.modifiedTime ? new Date(df.modifiedTime).toLocaleDateString(undefined, {
                                  day: '2-digit', month: 'short', year: 'numeric'
                                }) : 'Reciente'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleStartImport(df)}
                                    className="px-2.5 py-1 bg-[#0E457F]/15 text-[#47B6E6] hover:bg-[#0E457F]/25 border border-[#0E457F]/25 rounded text-[11.5px] font-medium cursor-pointer transition-all"
                                    title="Importar como archivo de Data Room"
                                  >
                                    Importar a CRM
                                  </button>
                                  {df.webViewLink && (
                                    <a 
                                      href={df.webViewLink} 
                                      target="_blank" 
                                      rel="noreferrer cursor-pointer"
                                      className="p-1 px-1.5 bg-[#1B2F49] hover:bg-[#22384F] border border-[#2A415A] rounded text-[#8DA2B5] hover:text-[#EAF3F9] transition-all flex items-center gap-1 text-[11.5px]"
                                    >
                                      Ver <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                  <button 
                                    onClick={() => handleDeleteDriveFile(df.id, df.name)}
                                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg cursor-pointer hover:text-rose-300 transition-all border border-rose-500/15"
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

      {/* Upload document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9]">Subir Archivo al Data Room</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFileUpload} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Nombre del Documento</label>
                <input 
                  type="text" 
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Ej. Financial Model v5.xlsx"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Carpeta / Categoría</label>
                <select 
                  value={newFileCategory}
                  onChange={(e: any) => setNewFileCategory(e.target.value)}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                >
                  <option value="Finanzas">Financiero</option>
                  <option value="Legal">Legal</option>
                  <option value="Producto">Producto &amp; Tecnología</option>
                  <option value="Marketing">Pitch Deck &amp; Demos</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Nivel de Confidencialidad</label>
                <select 
                  value={newFileConf}
                  onChange={(e: any) => setNewFileConf(e.target.value)}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                >
                  <option value="Público">Público (Cualquiera con acceso)</option>
                  <option value="Confidencial">Confidencial (Solo inversores verificados)</option>
                  <option value="Solo Directiva">Solo Directiva (C-Suite)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Descripción Breve</label>
                <textarea 
                  value={newFileDesc}
                  onChange={(e) => setNewFileDesc(e.target.value)}
                  placeholder="Explique resumidamente el contenido del documento"
                  rows={3}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm resize-none"
                />
              </div>

              {/* Drag and Drop area representation */}
              <div className="border border-dashed border-[#2A415A] p-4 text-center rounded-lg bg-[#1B2F49]/20">
                <Eye className="w-6 h-6 text-[#64748B] mx-auto mb-1 opacity-70" />
                <span className="text-[12px] text-[#64748B]">Añada firmas o suba PDF de forma segura</span>
              </div>

              <div className="border-t border-[#22384F] pt-4 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent border border-[#2A415A] text-[#64748B] hover:text-[#EAF3F9] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer"
                >
                  Cargar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share access Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9]">Compartir Acceso Seguro</h3>
              <button onClick={() => setIsShareOpen(false)} className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleShare} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Correo del Inversor o Socio</label>
                <input 
                  type="email" 
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="socio@pundopartners.com"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Permisos</label>
                <select 
                  value={sharePerm}
                  onChange={(e: any) => setSharePerm(e.target.value)}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                >
                  <option value="Completo">Acceso Completo (Finanzas + Legal)</option>
                  <option value="Parcial">Acceso Parcial (Legal + Pitch)</option>
                  <option value="Solo Lectura">Solo Lectura Financiero</option>
                </select>
              </div>

              <div className="border-t border-[#22384F] pt-4 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setIsShareOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent border border-[#2A415A] text-[#64748B] hover:text-[#EAF3F9] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import from Google Drive Modal */}
      {isImportOpen && importFileSelected && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9] flex items-center gap-2">
                <Cloud className="w-5 h-5 text-[#0E457F]" /> Importar a CRM
              </h3>
              <button 
                onClick={() => { setIsImportOpen(false); setImportFileSelected(null); }} 
                className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleImportSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Nombre en el CRM</label>
                <input 
                  type="text" 
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Carpeta Destino</label>
                <select 
                  value={newFileCategory}
                  onChange={(e: any) => setNewFileCategory(e.target.value)}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                >
                  <option value="Finanzas">Financiero</option>
                  <option value="Legal">Legal</option>
                  <option value="Producto">Producto &amp; Tecnología</option>
                  <option value="Marketing">Pitch Deck &amp; Demos</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Nivel de Confidencialidad</label>
                <select 
                  value={newFileConf}
                  onChange={(e: any) => setNewFileConf(e.target.value)}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                >
                  <option value="Público">Público (Cualquiera con acceso)</option>
                  <option value="Confidencial">Confidencial (Solo inversores verificados)</option>
                  <option value="Solo Directiva">Solo Directiva (C-Suite)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Descripción Detallada</label>
                <textarea 
                  value={newFileDesc}
                  onChange={(e) => setNewFileDesc(e.target.value)}
                  placeholder="Escriba comentarios o detalles para este archivo importado"
                  rows={3}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm resize-none"
                />
              </div>

              <div className="bg-[#22384F]/30 border border-[#2A415A] p-3 rounded-lg space-y-1 text-xs">
                <div className="text-[#64748B]">Tamaño original: <span className="text-[#EAF3F9] font-mono">{importFileSelected.size ? formatBytes(importFileSelected.size) : 'Desconocido'}</span></div>
                <div className="text-[#64748B]">Tipo MIME original: <span className="text-[#EAF3F9] font-mono">{importFileSelected.mimeType}</span></div>
              </div>

              <div className="border-t border-[#22384F] pt-4 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => { setIsImportOpen(false); setImportFileSelected(null); }}
                  className="px-4 py-2 rounded-lg bg-transparent border border-[#2A415A] text-[#64748B] hover:text-[#EAF3F9] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer flex items-center gap-1"
                >
                  Confirmar Importación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
