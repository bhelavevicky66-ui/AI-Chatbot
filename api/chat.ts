import { GoogleGenAI } from '@google/genai';

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

type Req = { method?: string; body?: any };
type Res = { status: (code: number) => Res; json: (body: any) => void };

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim();
  if (!apiKey) {
    res.status(500).json({ error: 'Missing API key. Please set GEMINI_API_KEY in your environment variables.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const message = (body?.message ?? '').toString();

    if (!message.trim()) {
      res.status(400).json({ error: 'Missing message' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });

    const response = await chat.sendMessage({ message });
    const text = response.text || '';

    res.status(200).json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
