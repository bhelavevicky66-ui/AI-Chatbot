
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

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
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });
  }

  async *sendMessageStream(message: string) {
    try {
      const responseStream = await this.chat.sendMessageStream({ message });
      for await (const chunk of responseStream) {
        const response = chunk as GenerateContentResponse;
        yield response.text || '';
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("I hit a small bump! Can you try saying that again? (Mere side se kuch error aaya hai, please phir se try kijiye)");
    }
  }

  resetChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
}

export const geminiService = new GeminiService();
