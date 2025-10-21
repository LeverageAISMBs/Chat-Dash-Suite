
import React, { useState } from 'react';
import { VoiceAgent } from '../types';
import { useLiveAgent } from '../hooks/useLiveAgent';
import { Modal } from './Modal';

interface VoiceAgentViewProps {
  voiceAgents: VoiceAgent[];
  addVoiceAgent: (agent: Omit<VoiceAgent, 'id' | 'createdAt'>) => void;
}

type Voice = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
const VOICES: Voice[] = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];

const NewAgentForm: React.FC<{ onSave: (agent: Omit<VoiceAgent, 'id' | 'createdAt'>) => void; onClose: () => void }> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [voice, setVoice] = useState<Voice>('Zephyr');
  const [error, setError] = useState('');

  const handleSave = () => {
    if(!name.trim() || !systemInstruction.trim()) {
      setError('Name and System Instruction are required.');
      return;
    }
    onSave({ name, systemInstruction, voice });
  };
  
  return (
    <div className="space-y-4 text-white">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Agent Name" className="w-full bg-gray-700 p-2 rounded" />
      <textarea value={systemInstruction} onChange={e => setSystemInstruction(e.target.value)} placeholder="System Instruction (e.g., You are a friendly barista.)" rows={4} className="w-full bg-gray-700 p-2 rounded" />
      <select value={voice} onChange={e => setVoice(e.target.value as Voice)} className="w-full bg-gray-700 p-2 rounded">
        {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      {error && <p className="text-red-400 text-sm">{error}</p>}
       <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white transition-colors">Cancel</button>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition-colors">Save Agent</button>
      </div>
    </div>
  );
};

const AgentInterface: React.FC<{ agent: VoiceAgent }> = ({ agent }) => {
    const { status, startAgent, stopAgent, userTranscript, agentTranscript, fullTranscript } = useLiveAgent();

    const getStatusIndicator = () => {
        switch (status) {
            case 'connecting': return <div className="text-yellow-400">Connecting...</div>;
            case 'listening': return <div className="text-green-400 flex items-center space-x-2"><span>Listening</span> <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div></div>;
            case 'speaking': return <div className="text-blue-400 flex items-center space-x-2"><span>Speaking</span> <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div></div>;
            case 'error': return <div className="text-red-500">Error! Please restart.</div>;
            default: return <div className="text-gray-400">Idle</div>;
        }
    }

    return (
        <div className="space-y-4 text-white">
            <div className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <div className="font-semibold">{getStatusIndicator()}</div>
                {status === 'idle' || status === 'error' ? (
                    <button onClick={() => startAgent(agent.systemInstruction, agent.voice)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition-colors">Start Conversation</button>
                ) : (
                    <button onClick={stopAgent} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors">End Conversation</button>
                )}
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg h-80 overflow-y-auto border border-gray-700">
                {fullTranscript.map((line, index) => <p key={index} className={line.startsWith('You:') ? 'text-gray-300' : 'text-blue-300'}>{line}</p>)}
                {userTranscript && <p className="text-gray-400 italic">You: {userTranscript}...</p>}
                {agentTranscript && <p className="text-blue-400 italic">Agent: {agentTranscript}...</p>}
            </div>
        </div>
    )
}

export const VoiceAgentView: React.FC<VoiceAgentViewProps> = ({ voiceAgents, addVoiceAgent }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState<VoiceAgent | null>(null);
  
  const handleSave = (agent: Omit<VoiceAgent, 'id' | 'createdAt'>) => {
    addVoiceAgent(agent);
    setIsCreateModalOpen(false);
  }

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Voice Agents</h1>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105">
          Create New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voiceAgents.map(agent => (
          <div key={agent.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white truncate">{agent.name}</h2>
              <p className="text-sm text-gray-400 mt-1">Voice: {agent.voice}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button onClick={() => setActiveAgent(agent)} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors">Launch Agent</button>
            </div>
          </div>
        ))}
         {voiceAgents.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No voice agents yet. Click "Create New Agent" to begin.</p>}
      </div>
      
       <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Voice Agent">
        <NewAgentForm onSave={handleSave} onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!activeAgent} onClose={() => setActiveAgent(null)} title={`Voice Agent: ${activeAgent?.name}`}>
        {activeAgent && <AgentInterface agent={activeAgent} />}
      </Modal>

    </div>
  );
};
