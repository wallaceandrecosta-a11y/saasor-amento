'use client';
import { useState } from 'react';
import { MdBugReport, MdLightbulbOutline, MdHelpOutline, MdClose, MdChatBubbleOutline, MdSend } from 'react-icons/md';
import { useToast } from './Toast';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('bug');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      return toast('Descreva o problema para enviar.', 'error');
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description }),
      });

      if (!res.ok) {
        throw new Error('Falha ao enviar feedback.');
      }

      toast('Obrigado pelo seu feedback!', 'success');
      setIsOpen(false);
      setDescription('');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { id: 'bug', icon: <MdBugReport className="text-red-500" />, label: 'Reportar Bug' },
    { id: 'suggestion', icon: <MdLightbulbOutline className="text-amber-500" />, label: 'Sugestão' },
    { id: 'help', icon: <MdHelpOutline className="text-blue-500" />, label: 'Ajuda' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-[90] w-14 h-14 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-105 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        title="Ajuda e Feedback"
      >
        <MdChatBubbleOutline className="text-2xl" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 left-6 z-[100] w-80 bg-white border border-slate-200 rounded-2xl shadow-premium animate-slide-up overflow-hidden flex flex-col">
          <div className="bg-slate-900 p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <MdChatBubbleOutline /> Central de Feedback
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <MdClose className="text-xl" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            <div className="flex gap-2">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id)}
                  className={`flex-1 py-2 flex flex-col items-center justify-center gap-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    type === opt.id 
                      ? 'bg-slate-50 border-primary-500 text-primary-600 shadow-[inset_0_0_0_1px_rgba(10,77,255,1)]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={type === 'bug' ? 'O que aconteceu? Como reproduzir o erro?' : type === 'suggestion' ? 'Qual a sua ideia genial para a plataforma?' : 'Em que podemos te ajudar hoje?'}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none bg-slate-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors shadow-soft flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Enviando...' : (
                <>Enviar <MdSend /></>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
