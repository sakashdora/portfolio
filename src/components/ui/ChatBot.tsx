import { useState, useRef, useEffect } from 'react';
import { Bot, Minus, X, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessageToGroq, type ChatMessage } from '../../lib/chatbot/groqService';

const SUGGESTION_CHIPS = [
  "Tell me about your skills",
  "View projects",
  "Download resume",
  "Get in touch"
];

function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hi! 👋 I'm your AI assistant.\nI can help you with:\n• About my skills and projects\n• Resume and experience\n• Career and opportunities\n• Anything else you'd like to know!`,
      timestamp: '10:12 AM'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    setHasInteracted(true);
    setInput('');

    // Specific on-page actions tied to suggestions
    const lower = text.toLowerCase();
    if (lower.includes('view projects')) {
      const projSec = document.getElementById('projects');
      if (projSec) projSec.scrollIntoView({ behavior: 'smooth' });
    } else if (lower.includes('get in touch') || lower.includes('contact')) {
      const contactSec = document.getElementById('contact');
      if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
    } else if (lower.includes('download resume')) {
      // Programmatically trigger download of Akash's resume
      const link = document.createElement('a');
      link.href = '/S_Akash_Dora_Resume.pdf';
      link.download = 'S_Akash_Dora_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: formatTime()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Convert history for API call
      const conversationHistory = newMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const botReply = await sendChatMessageToGroq(conversationHistory);

      const assistantMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: formatTime()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: "I ran into a temporary hiccup, but feel free to ask again or reach Akash directly at sakashdora@gmail.com!",
        timestamp: formatTime()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Hi! 👋 I'm your AI assistant.\nI can help you with:\n• About my skills and projects\n• Resume and experience\n• Career and opportunities\n• Anything else you'd like to know!`,
        timestamp: formatTime()
      }
    ]);
    setHasInteracted(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto font-sans">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[calc(100vw-32px)] max-w-[380px] sm:w-[380px] h-[520px] max-h-[82vh] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_45px_rgba(22,119,255,0.2)] border border-[#1677FF]/15 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1677FF] px-4 py-3 flex items-center justify-between text-white shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Bot size={18} className="text-[#1677FF]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold tracking-tight leading-tight text-white">
                    AI Assistant
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/95 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16B98A] shadow-[0_0_6px_#16B98A]" />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reset Conversation"
                  aria-label="Reset Conversation"
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  title="Minimize"
                  aria-label="Minimize"
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close"
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-[#F9FBFF] to-white scroll-smooth text-xs sm:text-[13px]">
              {messages.map((msg) => {
                const isBot = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 leading-relaxed shadow-2xs ${
                        isBot
                          ? 'bg-[#F0F5FF] text-[#102A56] rounded-tl-xs border border-[#1677FF]/10'
                          : 'bg-[#1677FF] text-white rounded-tr-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line break-words font-medium">
                        {msg.content}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-[#F0F5FF] rounded-2xl rounded-tl-xs p-3 border border-[#1677FF]/10 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#1677FF] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-[#1677FF] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-[#1677FF] rounded-full animate-bounce" />
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                    Thinking...
                  </span>
                </div>
              )}

              {/* Quick Suggestion Chips (display when clean or initial) */}
              {!hasInteracted && messages.length <= 2 && !isLoading && (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="text-[11px] sm:text-[11.5px] text-[#1677FF] bg-white border border-[#1677FF]/30 hover:border-[#1677FF] hover:bg-[#1677FF]/5 px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 text-center font-medium truncate"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-2 bg-[#F8FAFC] border border-gray-200 rounded-full px-3 py-1.5 focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 transition-all">
                <Sparkles size={16} className="text-[#1677FF] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none outline-none text-xs sm:text-[13px] text-[#102A56] placeholder:text-gray-400 font-medium"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-7 h-7 rounded-full bg-[#1677FF] text-white flex items-center justify-center hover:bg-[#102A56] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0 shadow-2xs"
                >
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher trigger (shown when minimized or closed) */}
      <AnimatePresence>
        {(!isOpen || isMinimized) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-2.5 bg-[#1677FF] hover:bg-[#102A56] text-white px-4 py-3 rounded-full shadow-[0_8px_30px_rgba(22,119,255,0.4)] hover:shadow-[0_12px_36px_rgba(22,119,255,0.5)] transition-all duration-300 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            {/* Glowing pulse ring */}
            <span className="absolute -inset-1 rounded-full bg-[#1677FF]/30 blur-xs group-hover:bg-[#1677FF]/50 animate-pulse pointer-events-none" />

            <div className="relative flex items-center justify-center">
              <Bot size={20} className="text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#16B98A] ring-2 ring-white" />
            </div>

            <span className="relative text-xs sm:text-sm font-bold tracking-tight">
              AI Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
