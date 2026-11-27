/** Opens the AI assistant and sends it a question. Safe to call before the chatbot has loaded. */
export function askAssistant(question: string) {
  const text = question.trim();
  if (!text) return;
  (window as Window & { __chatbotPending?: string }).__chatbotPending = text;
  window.dispatchEvent(new CustomEvent('chatbot:ask', { detail: text }));
}
