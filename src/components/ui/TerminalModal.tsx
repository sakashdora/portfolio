import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const lines = [
  { text: "C:\\Users\\Akash> node --version", delay: 300, type: "cmd" },
  { text: "v20.11.1", delay: 100, type: "output" },
  { text: "C:\\Users\\Akash> npm start profile.js", delay: 600, type: "cmd" },
  { text: "Compiling profile...", delay: 200, type: "system" },
  { text: "const developer = {", delay: 400, type: "code" },
  { text: '  name: "Akash",', delay: 150, type: "code" },
  { text: '  role: "Full-Stack Engineer",', delay: 150, type: "code" },
  { text: '  passion: "Building Scalable Solutions",', delay: 150, type: "code" },
  { text: '  status: "Online and ready to build."', delay: 150, type: "code" },
  { text: "};", delay: 150, type: "code" },
  { text: "", delay: 100, type: "output" },
  { text: "> Profile loaded successfully.", delay: 300, type: "success" },
  { text: "C:\\Users\\Akash> _", delay: 500, type: "cmd", blink: true }
];

export const TerminalModal = ({ isOpen, onClose }: TerminalModalProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setVisibleLines(0);
      setTypedChars(0);
      return;
    }

    if (visibleLines >= lines.length) return;

    const currentLine = lines[visibleLines];
    
    // If it's a command, we type it out character by character
    if (currentLine.type === 'cmd' && !currentLine.blink) {
      if (typedChars < currentLine.text.length) {
        const timeout = setTimeout(() => {
          setTypedChars(prev => prev + 1);
        }, 30); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setVisibleLines(prev => prev + 1);
          setTypedChars(0);
        }, currentLine.delay);
        return () => clearTimeout(timeout);
      }
    } else {
      // For output/code, we show the whole line after a delay
      const timeout = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, currentLine.delay);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, visibleLines, typedChars]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Terminal Window */}
      <div className="relative w-full max-w-2xl bg-[#0C0C0C] rounded-lg shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
             <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
             <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
             <span className="ml-2 text-xs text-gray-400 font-medium font-sans">Command Prompt - profile.js</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-[13px] md:text-sm leading-relaxed text-gray-300 min-h-[350px]">
          {lines.slice(0, visibleLines + 1).map((line, index) => {
            const isCurrentLine = index === visibleLines;
            
            // Render typing effect for current cmd line
            if (isCurrentLine && line.type === 'cmd' && !line.blink) {
              return (
                <div key={index} className="text-white">
                  {line.text.substring(0, typedChars)}<span className="animate-pulse bg-white/70 w-2 h-4 inline-block ml-0.5 align-middle" />
                </div>
              );
            }
            
            // Skip rendering if it's the current line but not ready yet (handled by delay)
            if (isCurrentLine && (line.type !== 'cmd' || line.blink)) {
              return null;
            }

            // Render fully visible lines
            return (
              <div 
                key={index} 
                className={cn(
                  "mb-1",
                  line.type === 'cmd' ? "text-white" : "",
                  line.type === 'system' ? "text-yellow-300" : "",
                  line.type === 'success' ? "text-green-400" : "",
                  line.type === 'code' ? "text-[#569CD6]" : "",
                  line.type === 'output' ? "text-gray-400" : ""
                )}
              >
                {line.type === 'code' ? (
                  // Simple syntax highlighting for the final output
                  <span dangerouslySetInnerHTML={{ 
                    __html: line.text
                      .replace(/const/g, '<span class="text-[#C586C0]">const</span>')
                      .replace(/developer/g, '<span class="text-[#4FC1FF]">developer</span>')
                      .replace(/"([^"]+)"/g, '<span class="text-[#CE9178]">"$1"</span>')
                  }} />
                ) : (
                  line.text
                )}
                {line.blink && <span className="animate-pulse bg-white w-2 h-4 inline-block ml-1 align-middle" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
