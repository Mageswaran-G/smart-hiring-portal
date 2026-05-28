// Shared AI service utilities

export const normalizeAIError = (err) => ({
  message: err.response?.data?.message || err.message || 'AI service unavailable',
  status: err.response?.status || 500,
  retryable: !err.response || err.response.status >= 500,
});