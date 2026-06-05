import { useState, useRef, useEffect, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/chatService';
import toast from 'react-hot-toast';

export function useChat(welcomeMessage) {
  const createWelcome = useCallback(() => ({
    id: generateId(), role: 'bot', text: welcomeMessage
  }), [welcomeMessage]);

  const [messages, setMessages] = useState(() => [createWelcome()]);
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

  const sendMessage = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    if (msg.length > 1000) {
      toast.error('Message too long. Max 1000 characters.');
      return;
    }

    setMessages(prev => [...prev, { id: generateId(), role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(msg);
      setMessages(prev => [...prev, { id: generateId(), role: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { id: generateId(), role: 'bot', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const clearChat = useCallback(async () => {
    try {
      await clearChatHistory();
    } catch {
      // Continue even if backend clear fails
    }
    setMessages([createWelcome()]);
  }, [createWelcome]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

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
