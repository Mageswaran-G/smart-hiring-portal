import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/chatService';
import toast from 'react-hot-toast';

export function useChat(welcomeMessage) {
  const [messages, setMessages] = useState([
    { id: crypto.randomUUID(), role: 'bot', text: welcomeMessage }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  // Load history from DB on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const saved = await getChatHistory();
        if (saved && saved.length > 0) {
          setMessages(saved);
        }
      } catch {
        // No history yet — keep welcome message
      }
    };
    fetchHistory();
  }, []);

  // Auto scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    if (msg.length > 1000) {
      toast.error('Message too long. Max 1000 characters.');
      return;
    }

    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(msg);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'bot', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await clearChatHistory();
    } catch {
      // Continue even if backend clear fails
    }
    setMessages([{ id: crypto.randomUUID(), role: 'bot', text: welcomeMessage }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    messages,
    input,
    setInput,
    loading,
    bottomRef,
    sendMessage,
    clearChat,
    handleKeyDown,
  };
}
