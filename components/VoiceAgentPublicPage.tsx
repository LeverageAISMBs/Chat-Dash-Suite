
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { VoiceAgent, KnowledgeBase } from '../types';
import { Spinner } from './Spinner';
import { AgentInterface } from './AgentInterface';

export const VoiceAgentPublicPage: React.FC = () => {
    const [voiceAgents] = useLocalStorage<VoiceAgent[]>('gemini-suite-voiceAgents', []);
    const [knowledgeBases] = useLocalStorage<KnowledgeBase[]>('gemini-suite-knowledgeBases', []);
    const [agent, setAgent] = useState<VoiceAgent | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const agentId = params.get('agentId');

        if (!agentId) {
            setError('Error: No agent ID provided in the URL.');
            setIsLoading(false);
            return;
        }
        
        if (voiceAgents.length > 0) {
            const foundAgent = voiceAgents.find(a => a.id === agentId);
            if (foundAgent) {
                setAgent(foundAgent);
            } else {
                setError(`Error: Voice agent with ID "${agentId}" was not found.`);
            }
            setIsLoading(false);
        }

    }, [voiceAgents.length]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-gray-800 flex flex-col justify-center items-center text-white">
                <Spinner />
                <p className="mt-4">Loading Agent...</p>
            </div>
        );
    }

    if (error) {
        return <div className="h-screen w-screen bg-gray-800 flex justify-center items-center text-red-400 p-4">{error}</div>;
    }

    if (!agent) {
        return <div className="h-screen w-screen bg-gray-800 flex justify-center items-center text-gray-400 p-4">Could not load voice agent.</div>;
    }

    return <AgentInterface agent={agent} knowledgeBases={knowledgeBases} isPublicPage={true} />;
};
