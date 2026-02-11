
import React from 'react';
import { Message } from '../types';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isAssistant ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
        }`}>
          {isAssistant ? <Sparkles size={16} /> : <User size={16} />}
        </div>
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div className={`rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
            isAssistant 
              ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
              : 'bg-indigo-600 text-white rounded-tr-none'
          }`}>
            {message.content || (isAssistant && '...')}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
