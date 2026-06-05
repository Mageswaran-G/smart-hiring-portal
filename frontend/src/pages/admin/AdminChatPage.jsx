import { MessageSquare, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useChat } from '../../hooks/useChat';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';

const PRIMARY = 'linear-gradient(135deg, #7c3aed, #9333ea)';
const PRIMARY_COLOR = '#7c3aed';

export default function AdminChatPage() {
  const { messages, input, setInput, loading, bottomRef, sendMessage, clearChat, handleKeyDown } =
    useChat('Hello! I am HireBot. Ask me anything about the platform — users, companies, jobs, or moderation guidance.');

  return (
    <DashboardLayout>
      <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: 'system-ui,-apple-system,sans-serif', padding: '32px' }}>

        {/* Header */}
        <div style={{ maxWidth: 800, margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px #7c3aed40' }}>
                <MessageSquare size={20} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.4px' }}>HireBot</h1>
                <p style={{ fontSize: 12, color: '#7c3aed', margin: 0, fontWeight: 600 }}>Admin Assistant</p>
              </div>
            </div>
            <button type="button" onClick={clearChat} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
              <Trash2 size={13} /> Clear chat
            </button>
          </div>
        </div>

        {/* Chat box */}
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '65vh' }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} primaryColor={`linear-gradient(135deg, ${PRIMARY_COLOR}, #9333ea)`} />
            ))}
            {loading && <TypingIndicator color={PRIMARY_COLOR} />}
            <div ref={bottomRef} />
          </div>

          <ChatInput input={input} setInput={setInput} onSend={sendMessage} onKeyDown={handleKeyDown} loading={loading} primaryColor={`linear-gradient(135deg, ${PRIMARY_COLOR}, #9333ea)`} />
        </div>
      </div>
    </DashboardLayout>
  );
}
