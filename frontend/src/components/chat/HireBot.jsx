import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const PRIMARY = '#ea580c';
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #ea580c, #f97316)';

export default function CandidateChatBubble() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, loading, bottomRef, sendMessage, handleKeyDown } =
    useChat('Hi! I am HireBot. Ask me anything about jobs, your applications, or career advice.');

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 16, zIndex: 1000, pointerEvents: 'auto', maxWidth: 'calc(100vw - 32px)' }}>
      {open && (
        <div style={{
          width: 'min(360px, calc(100vw - 32px))', height: 500,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          marginBottom: 16, border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{ background: PRIMARY_GRADIENT, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={18} color="#fff" />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>HireBot</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>Your career assistant</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={18} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} primaryColor={PRIMARY_GRADIENT} />
            ))}
            {loading && <TypingIndicator color={PRIMARY} />}
            <div ref={bottomRef} />
          </div>

          <ChatInput input={input} setInput={setInput} onSend={sendMessage} onKeyDown={handleKeyDown} loading={loading} primaryColor={PRIMARY_GRADIENT} />
        </div>
      )}

      {/* Floating button */}
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: PRIMARY_GRADIENT,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(234,88,12,0.4)',
          marginLeft: 'auto',
        }}>
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
      </button>
    </div>
  );
}
