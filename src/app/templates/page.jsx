'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { 
  MdOutlineWorkspacePremium, MdCheck, MdRemoveRedEye, 
  MdColorLens, MdOutlineInsertDriveFile, MdWork, 
  MdPalette, MdLightbulb, MdStar, MdArrowBack,
  MdSearch, MdFilterList, MdSpa, MdMedicalServices, 
  MdBusinessCenter, MdComputer, MdBuild, MdGavel, MdArrowForward
} from 'react-icons/md';

const TEMPLATES = [
  {
    id: 'beauty',
    name: 'Beleza & Estética',
    category: 'Beleza',
    personality: '“Visual elegante com tons rosé e composição sofisticada.”',
    idealFor: 'Esteticistas, Clínicas de Harmonização, Salões de Beleza, Spa de Luxo.',
    tags: ['Luxo', 'Feminino', 'Estética', 'Elegante'],
    colors: {
      bg: '#FBF9F6',
      primary: '#E5C5B5',
      secondary: '#8B6D5C',
      highlight: '#D4AF37'
    },
    isPremium: false,
    previewColors: ['#FBF9F6', '#E5C5B5', '#8B6D5C', '#D4AF37'],
    icon: <MdSpa />
  },
  {
    id: 'health',
    name: 'Clínicas & Bem-Estar',
    category: 'Saúde',
    personality: '“Confiança e tranquilidade com grids organizados e verde suave.”',
    idealFor: 'Médicos, Fisioterapeutas, Psicólogos, Nutricionistas, Estúdios Pilates.',
    tags: ['Clean', 'Segurança', 'Acolhimento', 'Moderno'],
    colors: {
      bg: '#F5F8F7',
      primary: '#0D9488',
      secondary: '#0284C7',
      highlight: '#E0F2FE'
    },
    isPremium: false,
    previewColors: ['#F5F8F7', '#0D9488', '#0284C7', '#E0F2FE'],
    icon: <MdMedicalServices />
  },
  {
    id: 'corporate',
    name: 'Corporativo & Consultoria',
    category: 'Negócios',
    personality: '“Design corporativo imponente com contrastes de alto padrão.”',
    idealFor: 'Consultores, Agências de TI, Escritórios Contábeis, Construtoras.',
    tags: ['Executivo', 'High Contrast', 'Institucional', 'Sólido'],
    colors: {
      bg: '#0B0D12',
      primary: '#0F172A',
      secondary: '#475569',
      highlight: '#0A4DFF'
    },
    isPremium: true,
    previewColors: ['#0B0D12', '#0F172A', '#475569', '#0A4DFF'],
    icon: <MdBusinessCenter />
  },
  {
    id: 'tech',
    name: 'Tech & Digital',
    category: 'Tecnologia',
    personality: '“Visual tecnológico futurista inspirado nas maiores startups do mundo.”',
    idealFor: 'Social Media, Programadores, Agências Digitais, Freelancers, SaaS.',
    tags: ['Futurista', 'Glow', 'Moderno', 'Stripe Style'],
    colors: {
      bg: '#050816',
      primary: '#0A4DFF',
      secondary: '#7C3AED',
      highlight: '#0B1533'
    },
    isPremium: true,
    previewColors: ['#050816', '#0A4DFF', '#7C3AED', '#0B1533'],
    icon: <MdComputer />
  },
  {
    id: 'engineering',
    name: 'Manutenção & Engenharia',
    category: 'Industrial',
    personality: '“Robustez industrial estruturada para transmitir máxima confiabilidade.”',
    idealFor: 'Engenheiros, Empreiteiros, Eletricistas, Oficinas Premium, Reformas.',
    tags: ['Robustez', 'Industrial', 'Sólido', 'Eficiente'],
    colors: {
      bg: '#F8FAFC',
      primary: '#EA580C',
      secondary: '#334155',
      highlight: '#F1F5F9'
    },
    isPremium: false,
    previewColors: ['#F8FAFC', '#EA580C', '#334155', '#F1F5F9'],
    icon: <MdBuild />
  },
  {
    id: 'legal',
    name: 'Advocacia Premium',
    category: 'Jurídico',
    personality: '“Autoridade jurídica clássica com tipografia serifada e tom vinho luxo.”',
    idealFor: 'Advogados, Peritos Judiciais, Escritórios de Advocacia, Arbitragem.',
    tags: ['Autoridade', 'Clássico', 'Luxo', 'Nobre'],
    colors: {
      bg: '#FCFBF9',
      primary: '#5C1D24',
      secondary: '#1C1C1C',
      highlight: '#C5A880'
    },
    isPremium: true,
    previewColors: ['#FCFBF9', '#5C1D24', '#1C1C1C', '#C5A880'],
    icon: <MdGavel />
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const categories = ['Todos', 'Beleza', 'Saúde', 'Negócios', 'Tecnologia', 'Industrial', 'Jurídico'];

  const filtered = selectedCategory === 'Todos' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (id) => {
    router.push(`/orcamentos/novo?template=${id}`);
  };

  return (
    <AppLayout>
      <div className="pb-16 max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Galeria de Templates Estratégicos</h1>
            <p className="text-sm text-[#8B95A7] font-medium max-w-2xl leading-relaxed">
              Design que gera conexões e aumenta a percepção de valor. Selecione modelos estruturados por especialistas com paletas, tipografia e composições reais de alta conversão.
            </p>
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap gap-2.5 pb-4 border-b border-blue-900/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer
                ${selectedCategory === cat 
                  ? 'bg-primary-500 text-white shadow-glow' 
                  : 'bg-[#071A3D]/25 border border-blue-900/15 text-[#8B95A7] hover:bg-[#071A3D]/50 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tpl) => (
            <div 
              key={tpl.id} 
              className="bg-[#071A3D]/15 backdrop-blur-xl rounded-[24px] border border-blue-900/15 shadow-2xl overflow-hidden flex flex-col group hover:border-primary-500/40 hover:shadow-glow-intense hover:-translate-y-2 transition-all duration-500 ease-out"
            >
              
              {/* REAL MINIATURIZED PREVIEW CONTAINER */}
              <div className="h-56 relative overflow-hidden bg-slate-950/45 border-b border-blue-900/10 p-5 flex flex-col justify-between select-none">
                
                {/* Visual Backdrop Orb */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500 group-hover:scale-125"
                  style={{ backgroundColor: tpl.colors.primary }}
                ></div>

                {/* Top Badge & Nicho Icon */}
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm shadow-md"
                      style={{ backgroundColor: tpl.colors.primary }}
                    >
                      {tpl.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase text-white tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
                      {tpl.category}
                    </span>
                  </div>
                  
                  {tpl.isPremium ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-glow flex items-center gap-1">
                      👑 PRO
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Gratuito
                    </span>
                  )}
                </div>

                {/* DYNAMIC REAL MINI PROPOSAL MOCKUP */}
                <div 
                  className="w-full h-28 rounded-t-xl p-3 border-t border-x shadow-2xl relative z-10 transform translate-y-6 group-hover:translate-y-2 transition-all duration-500 ease-out"
                  style={{ 
                    backgroundColor: tpl.colors.bg,
                    borderColor: `${tpl.colors.primary}25`
                  }}
                >
                  {/* Simulated Proposal Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <h4 className="text-[8px] font-black uppercase tracking-wider" style={{ color: tpl.colors.secondary }}>PROPOSTA</h4>
                      <div className="h-1.5 w-14 rounded" style={{ backgroundColor: `${tpl.colors.secondary}35` }}></div>
                    </div>
                    {/* Simulated visual gold/highlight line */}
                    <div className="w-1.5 h-6 rounded" style={{ backgroundColor: tpl.colors.highlight }}></div>
                  </div>

                  {/* Simulated Proposal Content Area */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center bg-black/5 p-1 rounded">
                      <div className="h-1 w-16 rounded" style={{ backgroundColor: `${tpl.colors.secondary}50` }}></div>
                      <div className="h-1 w-6 rounded" style={{ backgroundColor: tpl.colors.primary }}></div>
                    </div>
                    <div className="flex justify-between items-center bg-black/5 p-1 rounded">
                      <div className="h-1 w-20 rounded" style={{ backgroundColor: `${tpl.colors.secondary}50` }}></div>
                      <div className="h-1 w-6 rounded" style={{ backgroundColor: tpl.colors.primary }}></div>
                    </div>
                  </div>

                  {/* Bottom total signature indicator */}
                  <div className="mt-3 flex justify-between items-center pt-2 border-t border-black/5">
                    <div className="h-1 w-8 rounded" style={{ backgroundColor: `${tpl.colors.secondary}40` }}></div>
                    <div className="h-2 w-12 rounded-sm" style={{ backgroundColor: tpl.colors.primary }}></div>
                  </div>
                </div>

              </div>

              {/* Card Information */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-lg tracking-tight">{tpl.name}</h3>
                  </div>
                  
                  {/* Personality Quote */}
                  <p className="text-xs text-[#8B95A7] italic font-semibold leading-relaxed">
                    {tpl.personality}
                  </p>

                  {/* Ideal For Section (Diferencial Absurdo) */}
                  <div className="text-[11px] leading-relaxed">
                    <span className="text-[#8B95A7] font-bold uppercase tracking-wider block mb-1">Ideal Para:</span>
                    <p className="text-slate-300 font-semibold">{tpl.idealFor}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tpl.tags.map(t => (
                      <span key={t} className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 bg-[#050816]/65 border border-blue-900/15 text-[#8B95A7] rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-blue-900/10">
                  {/* Palette dots */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8B95A7] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <MdPalette className="text-sm text-primary-400" /> Paleta Real:
                    </span>
                    <div className="flex gap-1 bg-[#050816]/80 p-1.5 rounded-lg border border-blue-900/10">
                      <div className="w-4.5 h-4.5 rounded-full border border-white/10" style={{ backgroundColor: tpl.colors.bg }} title="Fundo"></div>
                      <div className="w-4.5 h-4.5 rounded-full border border-white/10" style={{ backgroundColor: tpl.colors.primary }} title="Primária"></div>
                      <div className="w-4.5 h-4.5 rounded-full border border-white/10" style={{ backgroundColor: tpl.colors.secondary }} title="Secundária"></div>
                      <div className="w-4.5 h-4.5 rounded-full border border-white/10" style={{ backgroundColor: tpl.colors.highlight }} title="Destaque"></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setPreviewTemplate(tpl)}
                      className="flex-1 py-3 bg-[#071A3D]/45 border border-blue-900/25 text-[#8B95A7] hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:border-primary-500/25 hover:bg-[#071A3D]/70 transition-all duration-300 cursor-pointer"
                    >
                      <MdRemoveRedEye className="text-base" /> Preview
                    </button>
                    
                    <button 
                      onClick={() => handleUseTemplate(tpl.id)}
                      className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow hover:shadow-glow-intense transition-all duration-300 cursor-pointer"
                    >
                      <MdCheck className="text-base" /> Usar Modelo
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* MODAL: Large Live Preview Mockup */}
        {previewTemplate && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02030A]/85 backdrop-blur-md animate-fade-in" 
            onClick={() => setPreviewTemplate(null)}
          >
            <div 
              className="bg-[#071A3D]/95 border border-blue-900/25 rounded-[32px] shadow-2xl max-w-4xl w-full p-8 md:p-10 animate-slide-up relative overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient edge marker */}
              <div className="absolute top-0 left-0 w-full h-2 shadow-glow" style={{ backgroundColor: previewTemplate.colors.primary }}></div>
              
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-primary-500/10 border border-primary-500/25 text-primary-400 rounded-full mb-3 inline-block">
                    PROPOSTA {previewTemplate.category.toUpperCase()}
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{previewTemplate.name}</h2>
                  <p className="text-xs text-[#8B95A7] font-semibold mt-1 italic">{previewTemplate.personality}</p>
                </div>
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="w-10 h-10 flex items-center justify-center text-[#8B95A7] hover:text-white bg-[#050816]/65 border border-blue-900/20 hover:border-red-500/25 rounded-xl transition-all cursor-pointer font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* COMPLETE INTERACTIVE BUDGET MOCKUP PREVIEW */}
              <div 
                className="rounded-2xl p-6 md:p-8 max-h-[420px] overflow-y-auto border shadow-2xl relative space-y-8 select-none"
                style={{ 
                  backgroundColor: previewTemplate.colors.bg,
                  borderColor: `${previewTemplate.colors.primary}20`
                }}
              >
                {/* 1. CAPA / COVER */}
                <div className="border-b pb-8 flex flex-col justify-between min-h-[220px]" style={{ borderColor: `${previewTemplate.colors.secondary}15` }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base shadow" style={{ backgroundColor: previewTemplate.colors.primary }}>
                        {previewTemplate.icon}
                      </span>
                      <span className="text-sm font-black uppercase tracking-wider" style={{ color: previewTemplate.colors.secondary }}>ORVEN DESIGN</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest opacity-40" style={{ color: previewTemplate.colors.secondary }}>Capa da Proposta</span>
                  </div>

                  <div className="my-6 space-y-3">
                    <div className="h-5 w-48 rounded" style={{ backgroundColor: previewTemplate.colors.primary }}></div>
                    <h3 className="text-2xl font-black tracking-tight" style={{ color: previewTemplate.colors.secondary }}>Proposta Comercial Especializada</h3>
                    <div className="h-2 w-72 rounded" style={{ backgroundColor: `${previewTemplate.colors.secondary}20` }}></div>
                  </div>

                  <div className="flex justify-between items-end pt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold opacity-50" style={{ color: previewTemplate.colors.secondary }}>Preparado para:</p>
                      <p className="text-xs font-bold" style={{ color: previewTemplate.colors.secondary }}>Cliente Exemplo Ltda</p>
                    </div>
                    <span className="text-xs font-black" style={{ color: previewTemplate.colors.highlight }}>ORC-9842</span>
                  </div>
                </div>

                {/* 2. TABELA DE PREÇOS */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: previewTemplate.colors.secondary }}>Detalhamento Financeiro</h4>
                  <div className="overflow-hidden rounded-xl border border-black/5">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr style={{ backgroundColor: `${previewTemplate.colors.primary}10` }}>
                          <th className="p-3 font-bold" style={{ color: previewTemplate.colors.secondary }}>Item / Descrição</th>
                          <th className="p-3 font-bold text-right" style={{ color: previewTemplate.colors.secondary }}>Preço Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5" style={{ color: previewTemplate.colors.secondary }}>
                        <tr>
                          <td className="p-3">
                            <p className="font-bold">Serviço Estratégico Especializado</p>
                            <p className="text-[10px] opacity-60">Consultoria técnica, análise e alinhamento de marca.</p>
                          </td>
                          <td className="p-3 text-right font-black">R$ 6.500,00</td>
                        </tr>
                        <tr>
                          <td className="p-3">
                            <p className="font-bold">Desenvolvimento e Implantação</p>
                            <p className="text-[10px] opacity-60">Implementação operacional completa do escopo.</p>
                          </td>
                          <td className="p-3 text-right font-black">R$ 5.000,00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. ASSINATURAS E CTA FINAL */}
                <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderColor: `${previewTemplate.colors.secondary}15` }}>
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-[10px] font-bold uppercase opacity-55" style={{ color: previewTemplate.colors.secondary }}>Condições</p>
                    <p className="text-xs font-bold" style={{ color: previewTemplate.colors.secondary }}>Faturamento 50% entrada e 50% na entrega.</p>
                  </div>

                  <div className="w-48 text-center border-t-2 border-dashed pt-3" style={{ borderColor: previewTemplate.colors.primary }}>
                    <div className="h-5 w-24 bg-black/5 rounded mx-auto mb-1"></div>
                    <p className="text-[9px] font-bold uppercase opacity-55" style={{ color: previewTemplate.colors.secondary }}>Assinatura do Cliente</p>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-blue-900/10">
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3.5 bg-[#050816]/65 border border-blue-900/20 text-[#8B95A7] hover:text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button 
                  onClick={() => {
                    handleUseTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-8 py-3.5 text-white font-bold rounded-2xl text-xs shadow-glow hover:shadow-glow-intense transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: previewTemplate.colors.primary }}
                >
                  Começar com este modelo
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
