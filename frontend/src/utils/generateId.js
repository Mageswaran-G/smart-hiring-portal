export const generateId = () =>
  crypto?.randomUUID?.() || Date.now().toString();
