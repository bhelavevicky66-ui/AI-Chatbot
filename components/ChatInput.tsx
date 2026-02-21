
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 bg-theme rounded-2xl border border-gray-100 p-2 md:p-3 transition-all focus-within:ring-2 focus-within:ring-indigo-100"
      style={{ boxShadow: '0 4px 24px 0 rgba(30, 41, 59, 0.5)' }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message (English, Hindi, Hinglish)..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-3 text-sm text-inherit placeholder:text-gray-400 max-h-[150px] custom-scrollbar"
      />
      
      <div className="flex items-center gap-1 pr-1">
        <button
          type="button"
          className="p-2 text-inherit hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors hidden sm:flex"
          title="Voice input (Coming soon)"
        >
          <Mic size={20} />
        </button>
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className={`p-2.5 rounded-xl transition-all ${
            text.trim() && !disabled
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
              : 'bg-theme text-inherit'
          }`}
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
