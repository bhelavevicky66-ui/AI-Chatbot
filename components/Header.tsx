
import React from 'react';
import { Sparkles, Languages } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-100 shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Dost AI
            </h1>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Online Assistant
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full">
            <Languages size={14} className="text-indigo-500" />
            <span>EN / HI / Hinglish</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
