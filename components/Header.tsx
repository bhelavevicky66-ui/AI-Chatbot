
import React from 'react';
import { Sparkles, Languages as LanguagesIcon } from 'lucide-react';
import { LANGUAGES, Language } from '../types';

interface HeaderProps {
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <header className="bg-theme border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between bg-theme">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 2px 12px 0 rgba(30, 41, 59, 0.5)' }}>
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Dost AI
            </h1>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-inherit flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Online Assistant
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-theme rounded-full border border-gray-200">
            <LanguagesIcon size={14} className="text-indigo-500" />
            <select 
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent border-none outline-none text-xs font-medium text-gray-700 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
