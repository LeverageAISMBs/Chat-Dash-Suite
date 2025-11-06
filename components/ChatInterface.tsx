
import React, { useState, useEffect, useRef } from 'react';
import { Chatbot, KnowledgeBase, ChatMessage } from '../types';
import { getResponse } from '../services/geminiService';
import { Spinner } from './Spinner';

interface ChatInterfaceProps {
  bot: Chatbot;
  knowledgeBases: KnowledgeBase[];
  onInteraction?: () => void; // Optional callback for tracking usage
  isPublicPage?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ bot, knowledgeBases, onInteraction, isPublicPage = false }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const knowledgeBase = knowledgeBases.find(kb => kb.id === bot.knowledgeBaseId);
    const knowledgeContext = knowledgeBase ? knowledgeBase.sources.map(s => s.content).join('\n\n') : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        if (onInteraction) {
            onInteraction();
        }
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        const responseText = await getResponse(currentInput, messages, bot.systemPrompt, knowledgeContext, bot.useThinkingMode);
        
        const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    const containerClasses = isPublicPage 
      ? "flex flex-col h-screen bg-gray-800 text-white" 
      : "flex flex-col h-[60vh] bg-gray-700 rounded-lg text-white";

    return (
        <div className={containerClasses}>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><div className="bg-gray-600 p-3 rounded-lg"><Spinner size="sm" /></div></div>}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-gray-600">
                <div className="flex items-center bg-gray-800 rounded-lg">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Chat with your bot..." className="w-full bg-transparent p-3 focus:outline-none" disabled={isLoading}/>
                    <button onClick={handleSend} disabled={isLoading} className="p-3 text-blue-400 hover:text-blue-300 disabled:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
