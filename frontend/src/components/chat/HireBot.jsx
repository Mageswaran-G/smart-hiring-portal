import { useState } from 'react';
import { useChat } from '../../hooks/useChat';

import ChatWindow from './ChatWindow';
import FloatingButton from './FloatingButton';
import DraggableWrapper from './DraggableWrapper';

export default function CandidateChatBubble() {
  const [open, setOpen] = useState(false);

  const {
    messages,
    input,
    setInput,
    loading,
    bottomRef,
    sendMessage,
    handleKeyDown,
  } = useChat(
    'Hi! I am HireBot. Ask me anything about jobs, your applications, or career advice.'
  );

  return (
    <DraggableWrapper>
      {open && (
        <ChatWindow
          messages={messages}
          loading={loading}
          bottomRef={bottomRef}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          handleKeyDown={handleKeyDown}
          onClose={() => setOpen(false)}
        />
      )}

      <FloatingButton
        open={open}
        onToggle={() => setOpen((prev) => !prev)}
      />
    </DraggableWrapper>
  );
}