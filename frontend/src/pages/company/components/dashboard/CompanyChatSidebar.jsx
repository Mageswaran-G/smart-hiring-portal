import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ChevronDown } from 'lucide-react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../../../../services/chatService';
import toast from 'react-hot-toast';

const PRIMARY = '#1e3a5f';

export default function CompanyChatSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: crypto.randomUUID(), role: 'bot', text: 'Hello! I am HireBot. Ask me anything about hiring, job descriptions, or candidate evaluation.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const saved = await getChatHistory();
        if (saved && saved.length > 0) {
          setMessages(saved);
        }
      } catch {
        // No history yet — keep default welcome message
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    if (msg.length > 1000) {
      toast.error('Message too long. Max 1000 characters.');
      return;
    }

    const userMsg = { id: crypto.randomUUID(), role: 'user', text: msg };
    const history = messages.filter(m => m.role !== 'system').slice(-10);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(msg, history);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'bot', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 100,
            width: 54, height: 54, borderRadius: '50%',
            background: `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)`,
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
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 8px 40px rgba(30,58,95,0.18)',
          border: '1px solid #e5e7eb',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'system-ui,-apple-system,sans-serif',
        }}>

          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)`,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={17} color="#fff" />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, margin: 0 }}>HireBot</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: 0 }}>Recruiter Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronDown size={16} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '9px 13px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)` : '#f1f5f9',
                  color: msg.role === 'user' ? '#fff' : '#1e293b',
                  fontSize: 13,
                  lineHeight: 1.55,
                  fontWeight: 500,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f1f5f9', borderRadius: '16px 16px 16px 4px', padding: '9px 13px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: PRIMARY, opacity: 0.5, animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 14px', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask HireBot..."
              rows={1}
              style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', background: '#f8fafc', color: '#1e293b', lineHeight: 1.5 }}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading} style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() && !loading ? `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)` : '#e2e8f0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0, transition: 'all 0.2s' }}>
              <Send size={15} color={input.trim() && !loading ? '#fff' : '#94a3b8'} />
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </>
  );
}
