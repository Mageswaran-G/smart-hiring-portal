// text.js — Shared text utility functions

// Strip HTML tags from rich text content
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};