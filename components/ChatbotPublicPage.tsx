
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Chatbot, KnowledgeBase } from '../types';
import { Spinner } from './Spinner';
import { ChatInterface } from './ChatInterface';

export const ChatbotPublicPage: React.FC = () => {
    const [chatbots, setChatbots] = useLocalStorage<Chatbot[]>('gemini-suite-chatbots', []);
    const [knowledgeBases] = useLocalStorage<KnowledgeBase[]>('gemini-suite-knowledgeBases', []);
    const [bot, setBot] = useState<Chatbot | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect runs only once to find the bot.
        // It depends on the initial load of chatbots from localStorage.
        const params = new URLSearchParams(window.location.search);
        const botId = params.get('botId');

        if (!botId) {
            setError('Error: No bot ID provided in the URL.');
            setIsLoading(false);
            return;
        }

        if (chatbots.length > 0) {
            const foundBot = chatbots.find(b => b.id === botId);
            if (foundBot) {
                setBot(foundBot);
            } else {
                setError(`Error: Chatbot with ID "${botId}" was not found.`);
            }
            setIsLoading(false);
        }
    }, [chatbots.length]); // Depend on chatbots.length to run once they are loaded

    const handleInteraction = () => {
        if (!bot) return;
        setChatbots(prev => prev.map(b => b.id === bot.id ? { ...b, usage: b.usage + 1 } : b));
    };

    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-gray-800 flex flex-col justify-center items-center text-white">
                <Spinner />
                <p className="mt-4">Loading Chatbot...</p>
            </div>
        );
    }

    if (error) {
        return <div className="h-screen w-screen bg-gray-800 flex justify-center items-center text-red-400 p-4">{error}</div>;
    }

    if (!bot) {
        // This case handles when loading is done but no bot was found, and no error was set.
        return <div className="h-screen w-screen bg-gray-800 flex justify-center items-center text-gray-400 p-4">Could not load chatbot.</div>;
    }

    return <ChatInterface bot={bot} knowledgeBases={knowledgeBases} onInteraction={handleInteraction} isPublicPage={true} />;
};
