'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { 
  MdPerson, MdEmail, MdDateRange, MdPalette, 
  MdBusiness, MdOutlineInsertPhoto, MdOutlineWorkspacePremium, 
  MdCheck, MdLock, MdSave
} from 'react-icons/md';
import Link from 'next/link';

export default function ProfileBrandingPage() {
  const toast = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  
  // Dados do Perfil e Marca
  const [profileData, setProfileData] = useState({
    fullName: '',
    companyName: '',
    companyCnpj: '',
    companyEmail: '',
    brandColor: '#0A4DFF',
    brandLogoUrl: '',
    removeWatermark: false,
  });

  // Estado da assinatura/plano
  const [plan, setPlan] = useState({ name: 'Free', isPro: false });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      setUser(session.user);

      // 1. Busca perfil do banco (incluindo campos de branding)
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setProfileData({
          fullName: profile.full_name || '',
          companyName: profile.company_name || '',
          companyCnpj: profile.company_cnpj || '',
          companyEmail: profile.company_email || '',
          brandColor: profile.brand_color || '#0A4DFF',
          brandLogoUrl: profile.brand_logo_url || '',
          removeWatermark: profile.remove_watermark || false,
        });
      }

      // 2. Busca assinatura
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*, plan:plans(*)')
        .eq('user_id', session.user.id)
        .in('status', ['active', 'trial'])
        .single();

      if (sub && sub.plan) {
        const planName = sub.plan.name;
        setPlan({
          name: planName,
          isPro: planName === 'Pro' || planName === 'Premium'
        });
      }

    } catch (err) {
      console.error(err);
      toast('Erro ao carregar dados do perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      // 1. Prepara dados para atualizar
      const updatePayload = {
        full_name: profileData.fullName,
        company_name: profileData.companyName,
        company_cnpj: profileData.companyCnpj,
        company_email: profileData.companyEmail,
      };

      // Só permite salvar customizações de branding se for PRO/Premium
      if (plan.isPro) {
        updatePayload.brand_color = profileData.brandColor;
        updatePayload.brand_logo_url = profileData.brandLogoUrl;
        updatePayload.remove_watermark = profileData.removeWatermark;
      }

      const { error } = await supabase
        .from('users')
        .update(updatePayload)
        .eq('id', user.id);

      if (error) throw error;
      
      toast('Perfil e preferências salvos com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      toast(`Erro ao salvar: ${err.message || 'Falha desconhecida'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/png', 'image/svg+xml', 'image/jpeg'].includes(file.type)) {
      toast('Apenas arquivos PNG, SVG ou JPEG são permitidos.', 'error');
      return;
    }

    if (file.size > 1024 * 1024) {
      toast('O logotipo deve ter menos de 1MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileData(prev => ({ ...prev, brandLogoUrl: event.target.result }));
      toast('Logotipo carregado com sucesso! Salve para aplicar.', 'success');
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[50vh] flex items-center justify-center flex-col gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-[#8B95A7]">Carregando painel de configuração...</p>
        </div>
      </AppLayout>
    );
  }

  const presetColors = ['#0A4DFF', '#0d9488', '#1e293b', '#9333ea', '#db2777', '#ea580c'];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Configurações</h1>
          <p className="mt-2 text-sm text-[#8B95A7] font-medium">Configure seu perfil pessoal e a identidade visual das suas propostas.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Card 1: Perfil Pessoal & Empresa */}
          <div className="card overflow-hidden">
            <div className="px-6 py-5 border-b border-blue-900/15 bg-[#071A3D]/25 flex items-center gap-2">
              <MdPerson className="text-xl text-primary-400" />
              <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">Dados do Emitente</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-modern">Seu Nome Completo</label>
                <input 
                  type="text" 
                  value={profileData.fullName}
                  onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                  placeholder="Nome do profissional..." 
                  className="input-modern"
                  required 
                />
              </div>

              <div>
                <label className="label-modern">E-mail de Acesso (Não alterável)</label>
                <input 
                  type="email" 
                  disabled 
                  value={user?.email || ''} 
                  className="input-modern bg-[#050816] border-blue-900/20 text-[#8B95A7] cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="label-modern">Nome da Empresa</label>
                <input 
                  type="text" 
                  value={profileData.companyName}
                  onChange={e => setProfileData({ ...profileData, companyName: e.target.value })}
                  placeholder="Ex: Minha Empresa..." 
                  className="input-modern" 
                />
              </div>

              <div>
                <label className="label-modern">E-mail da Empresa (Público)</label>
                <input 
                  type="email" 
                  value={profileData.companyEmail}
                  onChange={e => setProfileData({ ...profileData, companyEmail: e.target.value })}
                  placeholder="contato@minhaempresa.com" 
                  className="input-modern" 
                />
              </div>

              <div>
                <label className="label-modern">CNPJ / CPF da Empresa</label>
                <input 
                  type="text" 
                  value={profileData.companyCnpj}
                  onChange={e => setProfileData({ ...profileData, companyCnpj: e.target.value })}
                  placeholder="Ex: 00.000.000/0001-00..." 
                  className="input-modern" 
                />
              </div>
            </div>
          </div>

          {/* Card 2: Customização Visual PRO */}
          <div className="card overflow-hidden relative">
            
            {/* Overlay de Bloqueio se não for PRO */}
            {!plan.isPro && (
              <div className="absolute inset-0 bg-[#050816]/75 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#071A3D]/90 border border-blue-900/25 p-8 rounded-[24px] shadow-2xl max-w-sm">
                  <MdOutlineWorkspacePremium className="text-amber-400 text-4xl mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Personalização Exclusiva PRO</h3>
                  <p className="text-xs text-[#8B95A7] mb-6 leading-relaxed">Altere cores, adicione o logotipo da sua empresa e remova a marca do sistema para fechar mais negócios corporativos.</p>
                  <Link href="/settings/billing" className="btn-primary block w-full text-xs py-3.5 shadow-glow">
                    Fazer Upgrade de Plano
                  </Link>
                </div>
              </div>
            )}

            <div className="px-6 py-5 border-b border-blue-900/15 bg-[#071A3D]/25 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdPalette className="text-xl text-primary-400" />
                <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">Identidade Visual das Propostas</h2>
              </div>
              <span className="text-[9px] font-extrabold px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 uppercase rounded-full tracking-widest shadow-glow">
                Recurso PRO
              </span>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Cores */}
              <div>
                <label className="label-modern mb-3">Cor Principal das Propostas (Botões, Bordas, Destaques)</label>
                <div className="flex flex-wrap items-center gap-3">
                  {presetColors.map((color) => (
                    <button 
                      key={color}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, brandColor: color })}
                      className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer`}
                      style={{ 
                        backgroundColor: color, 
                        borderColor: profileData.brandColor === color ? '#FFFFFF' : 'transparent' 
                      }}
                    >
                      {profileData.brandColor === color && <MdCheck className="text-white text-lg font-bold" />}
                    </button>
                  ))}
                  
                  {/* Seletor Customizado */}
                  <div className="flex items-center gap-2.5 ml-4">
                    <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">Hex</span>
                    <input 
                      type="color" 
                      value={profileData.brandColor}
                      onChange={e => setProfileData({ ...profileData, brandColor: e.target.value })}
                      className="w-10 h-8 rounded-lg cursor-pointer border border-blue-900/20 bg-transparent"
                    />
                    <input 
                      type="text" 
                      value={profileData.brandColor}
                      onChange={e => setProfileData({ ...profileData, brandColor: e.target.value })}
                      className="w-24 text-xs px-2.5 py-1.5 bg-[#050816] border border-blue-900/20 rounded-lg font-mono text-center text-slate-200 outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Logotipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-modern flex items-center gap-1 mb-2">
                    <MdOutlineInsertPhoto className="text-slate-400" />
                    Upload de Logotipo da Empresa (PNG ou SVG)
                  </label>
                  
                  <div className="relative border-2 border-dashed border-blue-900/30 hover:border-primary-500/50 rounded-2xl p-5 flex flex-col items-center justify-center bg-[#050816]/40 cursor-pointer transition-all">
                    <input 
                      type="file" 
                      accept="image/png, image/svg+xml, image/jpeg" 
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <MdOutlineInsertPhoto className="text-3xl text-slate-500 mb-2" />
                    <span className="text-xs font-bold text-slate-350">Selecione o arquivo da logo</span>
                    <span className="text-[10px] text-slate-500 mt-1">PNG, SVG ou JPG (máx. 1MB)</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-[#050816]/80 rounded-2xl border border-blue-900/10 min-h-[110px] relative">
                  {profileData.brandLogoUrl ? (
                    <>
                      <img src={profileData.brandLogoUrl} alt="Visualização Logo" className="max-h-16 object-contain" />
                      <button
                        type="button"
                        onClick={() => setProfileData({ ...profileData, brandLogoUrl: '' })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/35 text-red-400 rounded-lg text-[10px] font-bold transition-all"
                      >
                        Remover
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Logotipo Padrão (Sem Imagem)</span>
                  )}
                </div>
              </div>

              {/* Marca d'água */}
              <div className="pt-5 border-t border-blue-900/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Remover Marca d'água do Sistema</h4>
                  <p className="text-xs text-[#8B95A7] mt-1 leading-relaxed">Oculta o rodapé "Gerado com ORVEN" das propostas públicas enviadas aos seus clientes.</p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={profileData.removeWatermark}
                    onChange={e => setProfileData({ ...profileData, removeWatermark: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end gap-3">
            <button 
              type="submit" 
              disabled={saving} 
              className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-glow hover:shadow-glow-intense hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-xs flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <MdSave className="text-base" />
              {saving ? 'Gravando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
