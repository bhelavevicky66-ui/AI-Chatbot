export class GeminiService {
  async *sendMessageStream(message: string) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json().catch(() => ({} as any));

      if (!response.ok) {
        const errorMessage =
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : 'Request failed.';
        throw new Error(errorMessage);
      }

      const text = typeof data?.text === 'string' ? data.text : '';
      yield text;
    } catch (error) {
      console.error("Gemini Error:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "I hit a small bump! Can you try saying that again? (Mere side se kuch error aaya hai, please phir se try kijiye)";
      throw new Error(message);
    }
  }

  resetChat() {
    return;
  }
}

export const geminiService = new GeminiService();
