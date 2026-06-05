export default function ChatMessage({ msg, primaryColor }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '80%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? primaryColor : '#f3f4f6',
        color: isUser ? '#fff' : '#1f2937',
        fontSize: 13,
        lineHeight: 1.55,
        fontWeight: 500,
      }}>
        {msg.text}
      </div>
    </div>
  );
}
