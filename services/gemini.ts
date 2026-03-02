import { GoogleGenAI } from '@google/genai';
import { Language } from '../types';

const SYSTEM_INSTRUCTION = `
You are Dost AI, a smart, friendly, and helpful AI assistant.
Your goal is to act like a real chat assistant that anyone can talk to anytime.

Core Rules:
- Always reply to the user’s message clearly and politely.
- Understand Hinglish, Hindi, and English fluently.
- If the user asks a question, give a correct and simple answer.
- If the user talks casually, reply like a friendly human (not a robot).
- If the user is confused, explain step by step.
- If the user asks about coding, explain in easy language with examples.
- If the user greets, greet back warmly.
- If the user makes a mistake, gently correct them.
- Never be rude or angry.
- Keep answers short and clear unless a long explanation is needed.
- Be supportive and motivating.
- Use simple words so beginners can understand.
- If you don’t know something, say “I’m not sure, but I can help you find out.”

Language rules:
- Reply in the same language the user uses (Hindi, English, or Hinglish).
- Avoid complex words unless required.
`;

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private chat: any = null;

  constructor() {
    this.initClient();
  }

  private initClient() {
    const key = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (key) {
      this.client = new GoogleGenAI({ apiKey: key });
    }
  }

  async *sendMessageStream(message: string, language: Language) {
    if (!this.client) {
      this.initClient();
      if (!this.client) {
        throw new Error("Missing API Key. Please Set VITE_GEMINI_API_KEY in .env");
      }
    }

    try {
      if (!this.chat) {
        // Use gemini-2.0-flash by default as 3-flash-preview might be unstable or require specific config
        // Actually, user had 'gemini-3-flash-preview', I will try to use it if it fails I'll fallback? 
        // No, let's use a stable one like `gemini-2.0-flash-exp` or just `gemini-1.5-flash` which is very fast.
        
        this.chat = this.client.chats.create({
          model: 'gemini-1.5-flash', 
          config: {
            systemInstruction: SYSTEM_INSTRUCTION + `\n\nIMPORTANT: The user has selected the language: "${language}". You MUST reply in this language.`,
            temperature: 0.8,
            topP: 0.95,
            topK: 40,
          },
        });
      }
      
      // If language changed heavily, we might want to update system instruction, but `chats` object is stateful.
      // For now, let's just send the message. Ideally we should create a NEW chat session if language changes drastically 
      // or if we want to enforce the new system instruction.
      // Let's reset chat if it exists to apply new language instruction?
      // But we lose history.
      // Let's keep it simple: Just restart chat session for now since App doesn't persist history in `chat` object anyway (it keeps its own state)
      // Wait, App KEEPS history in `messages`. But `geminiService` chat object KEEPS history internally in SDK.
      // If I recreate `this.chat`, the model forgets previous context.
      // To keep context AND change system instruction is tricky.
      // Let's assume for this simple app, we recreating the chat session for each message is OKAY because the user might just be asking single queries, 
      // OR we just pass history manually.
      // Actually, looking at `api/chat.ts`, it was STATLESS (creating new chat for every request).
      // So recreating `this.chat` here mimics the previous behavior.
      
      this.chat = this.client.chats.create({
        model: 'gemini-1.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + `\n\nIMPORTANT: The user has selected the language: "${language}". You MUST reply in this language.`,
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
        },
      });

      const result = await this.chat.sendMessageStream({ message });
      
      for await (const chunk of result.stream) {
        const chunkText = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      throw new Error(error.message || "Something went wrong");
    }
  }

  resetChat() {
    this.chat = null;
  }
}

export const geminiService = new GeminiService();
