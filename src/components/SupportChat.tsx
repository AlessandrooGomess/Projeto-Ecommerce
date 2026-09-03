import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, ShieldCheck, HelpCircle, Loader2, RotateCcw } from 'lucide-react';
import { ChatMessage } from '../types';

interface SupportChatProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  onSelectRegionFilter?: (region: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Olá! Sou o Guia do Artesanato Regional. Posso te ajudar a encontrar peças únicas de mestres de todo o Brasil, tirar dúvidas sobre frete para produtos frágeis, prazos de produção e explicar nossa Garantia de Pagamento Seguro. Como posso te ajudar hoje?',
    timestamp: 'Agora'
  }
];

const SUGGESTED_QUESTIONS = [
  'Como funciona o Pagamento Seguro com Garantia?',
  'Como as cerâmicas frágeis são embaladas para envio?',
  'Quais peças são do Vale do Jequitinhonha ou Canastra?',
  'Qual o prazo de produção de peças sob medida?'
];

export const SupportChat: React.FC<SupportChatProps> = ({
  isOpen,
  onOpen,
  onClose,
  onSelectRegionFilter
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [questionInput, setQuestionInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Captures the text input using JavaScript event (onSubmit or onClick) and sends to Node.js backend
  const handleSendMessage = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();

    const query = (customQuestion || questionInput).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    // Update state dynamically without page reload
    setMessages((prev) => [...prev, userMessage]);
    setQuestionInput('');
    setIsLoading(true);

    try {
      // Secure server request to backend Node.js route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do assistente');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'Obrigado pelo contato! Nossa equipe de curadores e mestres artesãos está à disposição.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      // Append assistant answer dynamically
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMessage: ChatMessage = {
        id: `assist-fallback-${Date.now()}`,
        sender: 'assistant',
        text: 'Nossa plataforma oferece pagamento protegido via PIX e Cartão de Crédito com garantia de entrega para todas as regiões do Brasil. Embalamos cerâmicas e itens artesanais com reforço especial.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  if (!isOpen) {
    // Floating Quick Button when closed
    return (
      <button
        id="floating-support-chat-button"
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group border border-amber-400/40"
        title="Dúvidas e Suporte ao Cliente"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-semibold whitespace-nowrap">
          Suporte do Artesanato
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-1 right-1 border-2 border-amber-600"></span>
      </button>
    );
  }

  return (
    <div 
      id="support-chat-floating-panel"
      className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[94vw] sm:w-96 md:w-[420px] h-[540px] max-h-[85vh] bg-stone-900 border border-amber-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100 animate-in slide-in-from-bottom duration-300"
    >
      {/* Chat Header */}
      <div className="p-3.5 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-600/90 text-white flex items-center justify-center shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-sm text-white">Guia do Artesanato</h3>
              <span className="bg-emerald-950 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.2 rounded border border-emerald-800">
                Online
              </span>
            </div>
            <p className="text-[11px] text-stone-400">Atendimento & Suporte Regional Inteligente</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800"
            title="Reiniciar conversa"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            id="close-support-chat-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
            title="Fechar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-3 py-2 bg-stone-950/70 border-b border-stone-800/80 overflow-x-auto flex gap-1.5 text-[11px] no-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(undefined, q)}
            className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-950 hover:text-amber-200 border border-stone-700 text-stone-300 whitespace-nowrap transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Dynamic Responses Container (Espaço em branco para exibir as respostas dinamicamente sem recarregar a página) */}
      <div
        id="chat-respostas"
        className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-stone-900/95 text-xs"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`mensagem-${msg.id}`}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-amber-700/80 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[84%] p-3 rounded-2xl space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-none shadow-md'
                  : 'bg-stone-800/90 text-stone-200 rounded-tl-none border border-stone-700/80 shadow-sm'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              <span className={`text-[9px] block text-right ${msg.sender === 'user' ? 'text-amber-200' : 'text-stone-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-stone-700 flex items-center justify-center text-stone-200 flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Dynamic Typing / Loading indicator */}
        {isLoading && (
          <div id="chat-indicador-carregamento" className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-lg bg-amber-700/80 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-stone-800 p-3 rounded-2xl rounded-tl-none border border-stone-700 text-stone-300 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span className="text-xs">Consultando catálogo regional e mestres artesãos...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* User Input Form (Campo de texto + Botão de Envio com captura via JavaScript) */}
      <form
        id="formulario-suporte-cliente"
        onSubmit={(e) => handleSendMessage(e)}
        className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2"
      >
        <input
          id="campo-pergunta-cliente"
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder="Digite sua dúvida sobre produtos, mestres ou frete..."
          disabled={isLoading}
          className="flex-1 bg-stone-800 text-stone-100 placeholder-stone-400 text-xs rounded-xl px-3.5 py-2.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
        />

        <button
          id="botao-enviar-pergunta"
          type="submit"
          disabled={!questionInput.trim() || isLoading}
          className="p-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-white disabled:text-stone-500 rounded-xl transition-all shadow active:scale-95 flex items-center justify-center"
          title="Enviar pergunta ao assistente"
          aria-label="Enviar pergunta"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Secure footer */}
      <div className="bg-stone-950 px-3 py-1 text-[10px] text-stone-400 text-center border-t border-stone-900 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3 h-3 text-amber-500" />
        <span>Atendimento com inteligência artificial conectada ao servidor</span>
      </div>
    </div>
  );
};
