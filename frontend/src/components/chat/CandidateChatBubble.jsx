import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { sendChatMessage } from '../../services/chatService';

export default function CandidateChatBubble() {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am HireBot. Ask me anything about jobs, your applications, or career advice.' }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const res = await sendChatMessage(userMsg, history);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 16, zIndex: 1000, pointerEvents: 'auto', maxWidth: 'calc(100vw - 32px)' }}> 
      {open && (
        <div style={{
          width: 'min(360px, calc(100vw - 32px))', height: 500,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          marginBottom: 16,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1001,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ea580c, #f97316)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageCircle size={18} color="#fff" />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>HireBot</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>Your career assistant</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={18} color="#fff" />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #ea580c, #f97316)' : '#f3f4f6',
                  color: msg.role === 'user' ? '#fff' : '#1f2937',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '18px 18px 18px 4px',
                  background: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Loader size={13} color="#9ca3af" />
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex', gap: 8, alignItems: 'flex-end',
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              rows={1}
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: 12, border: '1px solid #e5e7eb',
                fontSize: 13, resize: 'none', outline: 'none',
                fontFamily: 'inherit', lineHeight: 1.5,
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 1001,
                color: '#1f2937',
                background: '#fff',
              }}
            />
            <button type="button" onClick={handleSend} disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: input.trim() && !loading ? 'linear-gradient(135deg, #ea580c, #f97316)' : '#e5e7eb',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
              <Send size={15} color={input.trim() && !loading ? '#fff' : '#9ca3af'} />
            </button>
          </div>
        </div>
      )}

      <button type="button" onClick={() => setOpen(o => !o)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ea580c, #f97316)',
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
