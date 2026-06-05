export const generateId = () =>
  crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
