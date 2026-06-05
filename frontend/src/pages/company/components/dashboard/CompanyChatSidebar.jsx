import { MessageSquare, ChevronDown } from 'lucide-react';
import { useChat } from '../../../../hooks/useChat';
import ChatMessage from '../../../../components/chat/ChatMessage';
import ChatInput from '../../../../components/chat/ChatInput';
import TypingIndicator from '../../../../components/chat/TypingIndicator';
import { useState } from 'react';

const PRIMARY = '#1e3a5f';
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #1e3a5f, #2d5a9e)';

export default function CompanyChatSidebar() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, loading, bottomRef, sendMessage, handleKeyDown } =
    useChat('Hello! I am HireBot. Ask me anything about hiring, job descriptions, or candidate evaluation.');

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 100,
            width: 54, height: 54, borderRadius: '50%',
            background: PRIMARY_GRADIENT,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 18px ${PRIMARY}50`,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={22} color="#fff" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          width: 360, height: 520,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(30,58,95,0.18)',
          border: '1px solid #e5e7eb',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'system-ui,-apple-system,sans-serif',
        }}>

          {/* Header */}
          <div style={{ background: PRIMARY_GRADIENT, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={17} color="#fff" />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, margin: 0 }}>HireBot</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: 0 }}>Recruiter Assistant</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronDown size={16} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} primaryColor={PRIMARY_GRADIENT} />
            ))}
            {loading && <TypingIndicator color={PRIMARY} />}
            <div ref={bottomRef} />
          </div>

          <ChatInput input={input} setInput={setInput} onSend={sendMessage} onKeyDown={handleKeyDown} loading={loading} primaryColor={PRIMARY_GRADIENT} />
        </div>
      )}
    </>
  );
}
