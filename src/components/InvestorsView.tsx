import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Trash2,
  TrendingUp, 
  Users, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { Investor } from '../data/iwaitData';

interface InvestorsViewProps {
  investors: Investor[];
  onAddInvestor: (investor: Omit<Investor, 'id'>) => void;
  onDeleteInvestor: (id: string) => void;
  triggerToast: (msg: string) => void;
}

export default function InvestorsView({ 
  investors, 
  onAddInvestor, 
  onDeleteInvestor, 
  triggerToast 
}: InvestorsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [firm, setFirm] = useState('');
  const [amount, setAmount] = useState('');
  const [round, setRound] = useState<'Seed' | 'Pre-seed' | 'Grant'>('Seed');
  const [sharesPercent, setSharesPercent] = useState('');
  const [status, setStatus] = useState<'Firmado' | 'Pendiente' | 'Negociando'>('Firmado');

  // Compute stats
  const totalRaised = investors.reduce((acc, curr) => acc + curr.committedAmount, 0);
  const investorCount = investors.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerToast('Por favor, indica el nombre del inversor');
      return;
    }
    const numAmount = parseFloat(amount) || 0;
    const numPct = parseFloat(sharesPercent) || 0;

    onAddInvestor({
      name,
      firm,
      committedAmount: numAmount,
      round,
      sharesPercent: numPct,
      status,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@iwait.io`
    });

    // Reset Form
    setName('');
    setFirm('');
    setAmount('');
    setSharesPercent('');
    setStatus('Firmado');
    setIsModalOpen(false);
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'Firmado':
      case 'Confirmado':
        return <span className="bg-[#10CC82]/15 text-[#10CC82] text-[11px] font-semibold px-2 py-0.5 rounded">Confirmado</span>;
      case 'Negociando':
        return <span className="bg-[#F5A623]/15 text-[#F5A623] text-[11px] font-semibold px-2 py-0.5 rounded">Negociando</span>;
      case 'Pendiente':
      case 'En proceso':
      default:
        return <span className="bg-[#8DA2B5]/15 text-[#8DA2B5] text-[11px] font-semibold px-2 py-0.5 rounded text-xs">En proceso</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#c3dae4] pb-5">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0F1A2C] tracking-tight">Inversionstas</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Cap table, rondas y relaciones con inversores</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            type="button"
            onClick={() => triggerToast('Cap Table exportada con éxito como CSV')}
            className="btn btn-ghost px-3.5 py-1.8 bg-transparent hover:bg-[#14243A] rounded-lg border border-[#2A415A] text-[#8DA2B5] hover:text-white text-[13px] flex items-center gap-1.5 transition-all text-sm cursor-pointer"
          >
            <Download className="w-[15px] h-[15px]" /> Exportar cap table
          </button>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary px-3.5 py-1.8 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Añadir inversor
          </button>
        </div>
      </div>

      {/* Rondas grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#0E457F]">
          <div className="text-[12px] text-[#64748B] font-semibold uppercase tracking-wider">Total levantado</div>
          <div className="text-[28px] font-bold text-[#EAF3F9] mt-2 tracking-tight leading-none">${(totalRaised / 1000000).toFixed(1)}M</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <TrendingUp className="w-[13px] h-[13px]" /> Pre-seed + Seed
          </div>
        </div>

        <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#47B6E6]">
          <div className="text-[12px] text-[#64748B] font-semibold uppercase tracking-wider">Dilución actual</div>
          <div className="text-[28px] font-bold text-[#EAF3F9] mt-2 tracking-tight leading-none">24.5%</div>
          <div className="text-[12px] text-[#8DA2B5] flex items-center gap-1 mt-2.5">
            <Users className="w-[13px] h-[13px]" /> {investorCount} inversores activos
          </div>
        </div>

        <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#00C9A7]">
          <div className="text-[12px] text-[#64748B] font-semibold uppercase tracking-wider">Valoración actual</div>
          <div className="text-[28px] font-bold text-[#EAF3F9] mt-2 tracking-tight leading-none">$9.8M</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <TrendingUp className="w-[13px] h-[13px]" /> Post-money seed
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Tabla inversores */}
        <div className="bg-[#14243A] border border-[#22384F] rounded-lg lg:col-span-7">
          <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Inversores</h3>
            <span className="bg-[#0E457F]/15 text-[#47B6E6] text-[11px] font-bold px-2 py-0.5 rounded-full">{investorCount} activos</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Inversor</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Ronda</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Monto</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">% equity</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Estado</th>
                  <th className="px-5 py-3 text-center border-b border-[#22384F]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22384F]">
                {investors.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-[#EAF3F9] text-[13.5px]">{inv.name}</div>
                      <div className="text-[11px] text-[#64748B] font-mono mt-0.5">{inv.firm}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        inv.round === 'Seed' || inv.round === 'Semilla' 
                          ? 'bg-[#0E457F]/15 text-[#47B6E6]' 
                          : inv.round === 'Pre-Seed' || inv.round === 'Pre-seed'
                          ? 'bg-[#47B6E6]/15 text-[#47B6E6]'
                          : 'bg-[#00C9A7]/15 text-[#00C9A7]'
                      }`}>
                        {inv.round}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#EAF3F9] text-[13.5px]">
                      ${inv.committedAmount >= 1000 ? `${inv.committedAmount / 1000}K` : inv.committedAmount}
                    </td>
                    <td className="px-5 py-3 text-[#8DA2B5] text-[13.5px] font-mono">
                      {inv.sharesPercent}%
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button 
                        onClick={() => onDeleteInvestor(inv.id)}
                        className="text-[#64748B] hover:text-[#F05252] focus:outline-none p-1 transition-colors rounded cursor-pointer"
                        title="Eliminar inversor"
                      >
                        <Trash2 className="w-[14px] h-[14px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cap Table visualizer column */}
        <div className="bg-[#14243A] border border-[#22384F] rounded-lg lg:col-span-5 p-5 space-y-6">
          <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Cap Table de Distribución</h3>
          
          <div className="space-y-4">
            {/* Custom visual progress bars for each major shareholder */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#EAF3F9]">Founders &amp; CEO (S. Mazorra)</span>
                <span className="font-semibold text-[#8DA2B5]">52.4%</span>
              </div>
              <div className="w-full bg-[#2A415A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0E457F] h-full rounded-full transition-all duration-300" style={{ width: '52.4%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#EAF3F9]">Andes Ventures LLC</span>
                <span className="font-semibold text-[#8DA2B5]">5.0%</span>
              </div>
              <div className="w-full bg-[#2A415A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#47B6E6] h-full rounded-full transition-all duration-300" style={{ width: '5.0%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#EAF3F9]">Santiago de Alvear</span>
                <span className="font-semibold text-[#8DA2B5]">3.5%</span>
              </div>
              <div className="w-full bg-[#2A415A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00C9A7] h-full rounded-full transition-all duration-300" style={{ width: '3.5%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#EAF3F9]">Clara Ortiz (SaaS Global)</span>
                <span className="font-semibold text-[#8DA2B5]">3.6%</span>
              </div>
              <div className="w-full bg-[#2A415A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00C9A7] h-full rounded-full transition-all duration-300" style={{ width: '3.6%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#EAF3F9]">AeroCapital SL</span>
                <span className="font-semibold text-[#8DA2B5]">2.4%</span>
              </div>
              <div className="w-full bg-[#2A415A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#F5A623] h-full rounded-full transition-all duration-300" style={{ width: '2.4%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#EAF3F9]">Option pool</span>
                <span className="font-semibold text-[#8DA2B5]">33.1%</span>
              </div>
              <div className="w-full bg-[#2A415A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#F5A623] h-full rounded-full transition-all duration-300" style={{ width: '33.1%' }}></div>
              </div>
            </div>
          </div>

          {/* Próxima ronda objetivo box */}
          <div className="border-t border-[#22384F] pt-5">
            <h4 className="text-[14px] font-semibold text-[#EAF3F9] mb-3">Próxima ronda objetivo</h4>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#0E457F]/8 border border-[#0E457F]/20 rounded-lg p-3 text-center">
                <div className="text-[20px] font-bold text-[#47B6E6]">$5M</div>
                <div className="text-[11px] text-[#64748B] mt-1 line-clamp-1">Serie A</div>
              </div>
              <div className="bg-[#47B6E6]/8 border border-[#47B6E6]/20 rounded-lg p-3 text-center">
                <div className="text-[16px] font-bold text-[#47B6E6] mt-1">Q3 2026</div>
                <div className="text-[11px] text-[#64748B] mt-1.5 line-clamp-1">Fecha obj.</div>
              </div>
              <div className="bg-[#00C9A7]/8 border border-[#00C9A7]/20 rounded-lg p-3 text-center">
                <div className="text-[20px] font-bold text-[#00C9A7]">$25M</div>
                <div className="text-[11px] text-[#64748B] mt-1 line-clamp-1">Val. target</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9]">Añadir Nuevo Inversor</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Punto Capital"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Firma / Tipo</label>
                <input 
                  type="text" 
                  value={firm}
                  onChange={(e) => setFirm(e.target.value)}
                  placeholder="Ej. VC Madrid / Angel Investor"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Monto (USD)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ej. 150000"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">% Equity Asignado</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={sharesPercent}
                    onChange={(e) => setSharesPercent(e.target.value)}
                    placeholder="Ej. 4.6"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Ronda</label>
                  <select 
                    value={round}
                    onChange={(e: any) => setRound(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                  >
                    <option value="Seed">Seed (Semilla)</option>
                    <option value="Pre-seed">Pre-Seed</option>
                    <option value="Grant">Grant / Subvención</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Estado</label>
                  <select 
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                  >
                    <option value="Firmado">Confirmado</option>
                    <option value="Negociando">Negociando</option>
                    <option value="Pendiente">En proceso</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#22384F] pt-4 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent border border-[#2A415A] text-[#64748B] hover:text-[#EAF3F9] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer"
                >
                  Confirmar Inversor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
