export default function TypingIndicator({ color }) {
  return (
    <div className="flex justify-start">
      <div style={{ background: '#f3f4f6', borderRadius: '18px 18px 18px 4px', padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: color, opacity: 0.5, animation: `chat-bounce 1s ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}
