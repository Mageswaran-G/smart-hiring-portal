import { useEffect, useState } from 'react';

// useAutoSave — saves form data to localStorage automatically
// Prevents data loss when user closes tab or navigates away
// Clears draft when user saves or cancels

// Usage:
// const { hasDraft, getDraft, clearDraft } = useAutoSave('about', formData, isEditing);

export default function useAutoSave(sectionKey, data, isEditing) {
  const storageKey = `hireportal_draft_${sectionKey}`;
  const [hasDraft, setHasDraft] = useState(false);
  const [savedAt,  setSavedAt]  = useState(null);

  // Check if a draft exists when component mounts
  useEffect(() => {
    const draft = localStorage.getItem(storageKey);
    setHasDraft(!!draft);
  }, [storageKey]);

  // Auto-save data to localStorage when user types
  // Debounced — waits 1 second after user stops typing before saving
  // This prevents saving on every single keystroke
  useEffect(() => {
    if (!isEditing) return;

    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setSavedAt(new Date());
      setHasDraft(true);
    }, 1000);

    // Cleanup — cancel timer if user types again before 1 second
    return () => clearTimeout(timer);
  }, [data, isEditing, storageKey]);

  // Returns the saved draft data
  const getDraft = () => {
    try {
      const draft = localStorage.getItem(storageKey);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  };

  // Clears draft from localStorage — called on save or cancel
  const clearDraft = () => {
    localStorage.removeItem(storageKey);
    setHasDraft(false);
    setSavedAt(null);
  };

  return { hasDraft, getDraft, clearDraft, savedAt };
}
