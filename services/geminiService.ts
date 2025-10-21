
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const formatHistory = (history: ChatMessage[]) => {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
};

export const getResponse = async (
    prompt: string,
    history: ChatMessage[],
    systemInstruction: string,
    knowledgeContext: string | null,
    useThinkingMode: boolean
): Promise<string> => {
    try {
        const fullPrompt = knowledgeContext
            ? `CONTEXT:\n${knowledgeContext}\n\nQUESTION:\n${prompt}`
            : prompt;
        
        const model = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
        const config = useThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

        const response: GenerateContentResponse = await getAI().models.generateContent({
            model: model,
            contents: [...formatHistory(history), { role: 'user', parts: [{ text: fullPrompt }] }],
            config: {
                ...config,
                systemInstruction: systemInstruction,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error getting response from Gemini:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

export const getAssistantResponse = async (prompt: string, history: ChatMessage[]): Promise<string> => {
    try {
        const response: GenerateContentResponse = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [...formatHistory(history), { role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: "You are a helpful assistant for a user building chatbots. Be concise and helpful.",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting assistant response from Gemini:", error);
        return "Apologies, I'm having trouble connecting. Please check your setup.";
    }
};
