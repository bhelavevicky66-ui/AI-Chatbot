
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hinglish', name: 'Hinglish' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ko', name: 'Korean' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ar', name: 'Arabic' },
] as const;

export type Language = typeof LANGUAGES[number]['code'];

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
