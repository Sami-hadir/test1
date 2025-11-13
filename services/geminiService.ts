import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { SYSTEM_PROMPT, ANALYSIS_SCHEMA } from '../constants';
import { ChatMessage, AnalysisResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
}

export const analyzeImageWithGemini = async (base64Image: string, mimeType: string): Promise<AnalysisResponse> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [imagePart] },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      }
    });
    
    const text = response.text.trim();
    // Sometimes the response can be wrapped in ```json ... ```
    const sanitizedText = text.replace(/^```json\s*/, '').replace(/```$/, '');
    return JSON.parse(sanitizedText) as AnalysisResponse;

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("שגיאה בניתוח התמונה. אנא נסה שוב.");
  }
};

export const editImageWithGemini = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(base64Image, mimeType);
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePartResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePartResponse && imagePartResponse.inlineData) {
            return imagePartResponse.inlineData.data;
        }

        throw new Error("לא הוחזרה תמונה ערוכה מה-API.");

    } catch (error) {
        console.error("Error editing image with Gemini:", error);
        throw new Error("שגיאה בעריכת התמונה. אנא נסה שוב.");
    }
};

let chat: Chat | null = null;

export const startChat = (analysisContext: string): void => {
    chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
          systemInstruction: `אתה עוזר וירטואלי שמתמחה במוצרי מזון וטיפוח. ענה על שאלות המשתמש בהתבסס על ניתוח המוצר הבא: ${analysisContext}. היה ידידותי, מועיל, וספק תשובות ברורות בעברית.`,
        },
    });
}

export const sendMessageToChat = async (message: string, history: ChatMessage[]): Promise<string> => {
  if (!chat) {
    throw new Error("Chat not initialized. Call startChat first.");
  }
  
  // The @google/genai chat object maintains its own history,
  // so we just need to send the new message.
  const response = await chat.sendMessage({ message });
  return response.text;
};