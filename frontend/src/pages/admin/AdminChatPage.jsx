import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { sendChatMessage } from '../../services/chatService';
import toast from 'react-hot-toast';

const PRIMARY = '#7c3aed';

export default function AdminChatPage() {
  const [messages, setMessages] = useState([
    { id: crypto.randomUUID(), role: 'bot', text: 'Hello! I am HireBot. Ask me anything about the platform — users, companies, jobs, or moderation guidance.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleClear = () => {
    setMessages([{ id: crypto.randomUUID(), role: 'bot', text: 'Hello! I am HireBot. Ask me anything about the platform — users, companies, jobs, or moderation guidance.' }]);
  };

  return (
    <DashboardLayout>
      <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: 'system-ui,-apple-system,sans-serif', padding: '32px' }}>

        {/* Header */}
        <div style={{ maxWidth: 800, margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg, ${PRIMARY}, #9333ea)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${PRIMARY}40` }}>
                <MessageSquare size={20} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.4px' }}>HireBot</h1>
                <p style={{ fontSize: 12, color: '#7c3aed', margin: 0, fontWeight: 600 }}>Admin Assistant</p>
              </div>
            </div>
            <button onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
              <Trash2 size={13} /> Clear chat
            </button>
          </div>
        </div>

        {/* Chat box */}
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '65vh' }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%',
                  padding: '11px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? `linear-gradient(135deg, ${PRIMARY}, #9333ea)` : '#f5f3ff',
                  color: msg.role === 'user' ? '#fff' : '#1e1b4b',
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontWeight: 500,
                  boxShadow: msg.role === 'user' ? `0 2px 8px ${PRIMARY}30` : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f5f3ff', borderRadius: '18px 18px 18px 4px', padding: '11px 16px' }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: PRIMARY, opacity: 0.5, animation: `bounce 1s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #ede9fe', padding: '16px 20px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask HireBot anything..."
              rows={1}
              style={{ flex: 1, border: '1px solid #ede9fe', borderRadius: 12, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none', background: '#faf9ff', color: '#1e1b4b', lineHeight: 1.5 }}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading} style={{ width: 42, height: 42, borderRadius: 12, background: input.trim() && !loading ? `linear-gradient(135deg, ${PRIMARY}, #9333ea)` : '#e5e7eb', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0, boxShadow: input.trim() && !loading ? `0 2px 8px ${PRIMARY}40` : 'none', transition: 'all 0.2s' }}>
              <Send size={16} color={input.trim() && !loading ? '#fff' : '#9ca3af'} />
            </button>
          </div>
        </div>

        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
      </div>
    </DashboardLayout>
  );
}
