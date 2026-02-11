
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Role } from './types';
import { geminiService } from './services/gemini';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import { Trash2, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm Dost AI, your friendly assistant. I speak English, Hindi, and Hinglish. How can I help you today? \n\n(Namaste! Main Dost AI hoon. Main English, Hindi aur Hinglish samajhta hoon. Aaj main aapki kya madad kar sakta hoon?)",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      let fullContent = '';
      const stream = geminiService.sendMessageStream(text);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
          )
        );
      }
    } catch (error: any) {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === assistantMessageId 
            ? { ...msg, content: error.message || "Sorry, something went wrong." } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetConversation = () => {
    if (confirm("Are you sure you want to clear our chat? (Kya aap hamari chat delete karna chahte hain?)")) {
      geminiService.resetChat();
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Chat cleared! I'm ready for something new. How can I help? \n\n(Chat clear ho gayi! Kuch naya shuru karein?)",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 overflow-hidden relative max-w-4xl w-full mx-auto px-4 py-4 md:py-6">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto custom-scrollbar space-y-6 pb-20 px-1"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <MessageSquare size={48} className="opacity-20" />
              <p className="text-sm font-medium">Start a conversation with Dost AI</p>
            </div>
          )}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && messages[messages.length - 1].content === '' && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 max-w-[80%]">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Actions */}
        <div className="absolute top-4 right-8 flex gap-2">
          <button 
            onClick={resetConversation}
            className="p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </main>

      <div className="max-w-4xl w-full mx-auto px-4 pb-4 md:pb-8">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        <p className="text-[10px] text-center mt-3 text-gray-400">
          Dost AI can make mistakes. Please check important info.
        </p>
      </div>
    </div>
  );
};

export default App;
