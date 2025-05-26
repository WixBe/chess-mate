// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

interface GeminiResponse {
  move?: string;
  explanation?: string;
  error?: string;
}

export const GeminiHandler = {
  async getAIMove(fen: string): Promise<string | null> {
    try {
      const prompt = `You are a chess grandmaster. Respond ONLY with the best next move in Standard Algebraic Notation (SAN) for this position: ${fen}. 
        Current turn: ${fen.split(" ")[1] === 'w' ? 'white' : 'black'}. 
        Format your response like this: "Move: e5" or "Best move: Nf3".`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      // Extract SAN move from response
      const moveMatch = response.match(/(?:Move|Best move):?\s*(\S+)/i);
      return moveMatch ? moveMatch[1].replace(/[.!+?#]/g, '') : null;
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return null;
    }
  },

  async getChessExplanation(fen: string, context: string): Promise<string> {
    try {
      const prompt = `Explain the current chess position (FEN: ${fen}) in simple terms. 
        Focus on: ${context}. 
        Give strategic advice for the next move. 
        Keep it under 3 sentences. 
        Format: "Explanation: [your analysis]"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      // Clean up the response
      return response.replace(/Explanation:\s*/i, '').trim();
    } catch (error) {
      console.error("Gemini Explanation Error:", error);
      return "Unable to get analysis at this time. Please try again later.";
    }
  },

  async getTeachingTip(fen: string, move: string): Promise<string> {
    try {
      const prompt = `Explain this chess move (${move}) in the context of this position: ${fen}.
        Include: 
        - Basic mechanics of the move
        - Strategic purpose
        - Potential follow-up moves
        - Common mistakes to avoid
        Keep it under 4 sentences.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      return response.trim();
    } catch (error) {
      console.error("Gemini Teaching Error:", error);
      return "Unable to generate teaching tip for this move.";
    }
  }
};