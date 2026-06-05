import { Send } from 'lucide-react';

export default function ChatInput({ input, setInput, onSend, onKeyDown, loading, primaryColor }) {
  return (
    <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px 16px', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask HireBot anything..."
        rows={1}
        style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', background: '#f9fafb', color: '#1f2937', lineHeight: 1.5 }}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={!input.trim() || loading}
        style={{
          width: 40, height: 40, borderRadius: 12, border: 'none', flexShrink: 0,
          background: input.trim() && !loading ? primaryColor : '#e5e7eb',
          cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        <Send size={15} color={input.trim() && !loading ? '#fff' : '#9ca3af'} />
      </button>
    </div>
  );
}
