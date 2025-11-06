
import React from 'react';
import { VoiceAgent, KnowledgeBase } from '../types';
import { useLiveAgent } from '../hooks/useLiveAgent';

interface AgentInterfaceProps {
    agent: VoiceAgent;
    knowledgeBases: KnowledgeBase[];
    isPublicPage?: boolean;
}

export const AgentInterface: React.FC<AgentInterfaceProps> = ({ agent, knowledgeBases, isPublicPage = false }) => {
    const { status, startAgent, stopAgent, userTranscript, agentTranscript, fullTranscript } = useLiveAgent();

    const knowledgeBase = knowledgeBases.find(kb => kb.id === agent.knowledgeBaseId);
    const knowledgeContext = knowledgeBase ? knowledgeBase.sources.map(s => s.content).join('\n\n') : null;

    const getStatusIndicator = () => {
        switch (status) {
            case 'connecting': return <div className="text-yellow-400">Connecting...</div>;
            case 'listening': return <div className="text-green-400 flex items-center space-x-2"><span>Listening</span> <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div></div>;
            case 'speaking': return <div className="text-blue-400 flex items-center space-x-2"><span>Speaking</span> <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div></div>;
            case 'error': return <div className="text-red-500">Error! Please restart.</div>;
            default: return <div className="text-gray-400">Idle</div>;
        }
    }

    const containerClasses = isPublicPage 
        ? "space-y-4 text-white p-4 bg-gray-800 h-screen flex flex-col"
        : "space-y-4 text-white";

    const transcriptClasses = isPublicPage
        ? "bg-gray-900/50 p-4 rounded-lg overflow-y-auto border border-gray-700 flex-grow"
        : "bg-gray-900/50 p-4 rounded-lg h-80 overflow-y-auto border border-gray-700";

    return (
        <div className={containerClasses}>
            <div className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <div className="font-semibold">{getStatusIndicator()}</div>
                {status === 'idle' || status === 'error' ? (
                    <button onClick={() => startAgent(agent.systemInstruction, agent.voice, knowledgeContext)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition-colors">Start Conversation</button>
                ) : (
                    <button onClick={stopAgent} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors">End Conversation</button>
                )}
            </div>
            <div className={transcriptClasses}>
                {fullTranscript.map((line, index) => <p key={index} className={line.startsWith('You:') ? 'text-gray-300' : 'text-blue-300'}>{line}</p>)}
                {userTranscript && <p className="text-gray-400 italic">You: {userTranscript}...</p>}
                {agentTranscript && <p className="text-blue-400 italic">Agent: {agentTranscript}...</p>}
            </div>
        </div>
    )
}
