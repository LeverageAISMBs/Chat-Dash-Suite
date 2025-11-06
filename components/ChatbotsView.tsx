
import React, { useState } from 'react';
import { Chatbot, KnowledgeBase } from '../types';
import { Modal } from './Modal';
import { ChatInterface } from './ChatInterface';

interface ChatbotsViewProps {
  chatbots: Chatbot[];
  knowledgeBases: KnowledgeBase[];
  addChatbot: (bot: Omit<Chatbot, 'id' | 'createdAt' | 'usage'>) => void;
  updateChatbot: (bot: Chatbot) => void;
  deleteChatbot: (id: string) => void;
  incrementChatbotUsage: (id: string) => void;
}

const ChatbotForm: React.FC<{ 
  onSave: (data: Omit<Chatbot, 'id' | 'createdAt' | 'usage'>) => void; 
  onClose: () => void; 
  knowledgeBases: KnowledgeBase[];
  initialData?: Chatbot | null;
}> = ({ onSave, onClose, knowledgeBases, initialData }) => {
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSystemPrompt(initialData.systemPrompt);
      setKnowledgeBaseId(initialData.knowledgeBaseId);
      setUseThinkingMode(initialData.useThinkingMode);
    } else {
      setName('');
      setSystemPrompt('');
      setKnowledgeBaseId(null);
      setUseThinkingMode(false);
    }
    setError('');
  }, [initialData]);


  const handleSave = () => {
    if (!name.trim() || !systemPrompt.trim()) {
      setError('Name and System Prompt are required.');
      return;
    }
    onSave({ name, systemPrompt, knowledgeBaseId, useThinkingMode });
  };
  
  return (
    <div className="space-y-4 text-white">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Chatbot Name" className="w-full bg-gray-700 p-2 rounded" />
      <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} placeholder="System Prompt (e.g., You are a helpful assistant.)" rows={4} className="w-full bg-gray-700 p-2 rounded"/>
      <select value={knowledgeBaseId || 'none'} onChange={e => setKnowledgeBaseId(e.target.value === 'none' ? null : e.target.value)} className="w-full bg-gray-700 p-2 rounded">
        <option value="none">No Knowledge Base</option>
        {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.name}</option>)}
      </select>
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="thinking-mode" checked={useThinkingMode} onChange={e => setUseThinkingMode(e.target.checked)} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"/>
        <label htmlFor="thinking-mode" className="font-medium text-gray-300">Enable Thinking Mode (for complex queries)</label>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white transition-colors">Cancel</button>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition-colors">Save Chatbot</button>
      </div>
    </div>
  );
};

const EmbedCodeModal: React.FC<{ bot: Chatbot, onClose: () => void }> = ({ bot, onClose }) => {
    const embedCode = `<script>
    window.geminiChatbotConfig = {
        botId: "${bot.id}",
        // Optional: If hosting the suite on a different domain, specify it here.
        // domain: "https://your-suite-domain.com" 
    };
</script>
<script src="/chatbot-loader.js" async defer></script>`;

    return (
        <div className="space-y-4">
            <p className="text-gray-300">Copy this snippet and paste it just before the closing `&lt;/body&gt;` tag of your website.</p>
            <p className="text-sm text-gray-400">Note: The script `src` path is relative. For production, you must replace `/chatbot-loader.js` with the full URL to the loader script hosted on your Gemini Suite domain.</p>
            <pre className="bg-gray-900 p-4 rounded-lg text-green-300 text-sm overflow-x-auto">
                <code>{embedCode}</code>
            </pre>
            <div className="flex justify-end">
                <button onClick={() => { navigator.clipboard.writeText(embedCode); onClose(); }} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors">Copy & Close</button>
            </div>
        </div>
    )
}

export const ChatbotsView: React.FC<ChatbotsViewProps> = ({ chatbots, knowledgeBases, addChatbot, updateChatbot, deleteChatbot, incrementChatbotUsage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<Chatbot | null>(null);
  const [activeChatbot, setActiveChatbot] = useState<Chatbot | null>(null);
  const [embedBot, setEmbedBot] = useState<Chatbot | null>(null);

  const handleSave = (data: Omit<Chatbot, 'id' | 'createdAt' | 'usage'>) => {
    if (editingBot) {
      updateChatbot({ ...editingBot, ...data });
    } else {
      addChatbot(data);
    }
    closeModal();
  };
  
  const openCreateModal = () => {
    setEditingBot(null);
    setIsModalOpen(true);
  }

  const openEditModal = (bot: Chatbot) => {
    setEditingBot(bot);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBot(null);
  }
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this chatbot?")) {
      deleteChatbot(id);
    }
  }

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Chatbots</h1>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105">
          Create New Chatbot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {chatbots.map(bot => (
          <div key={bot.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white truncate">{bot.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{bot.useThinkingMode ? 'Thinking Mode Enabled' : 'Standard Mode'}</p>
              <p className="text-sm text-gray-400">Knowledge Base: {knowledgeBases.find(kb => kb.id === bot.knowledgeBaseId)?.name || 'None'}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex space-x-2">
              <button onClick={() => setActiveChatbot(bot)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">Test</button>
              <button onClick={() => setEmbedBot(bot)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm transition-colors">Embed</button>
              <button onClick={() => openEditModal(bot)} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors">Edit</button>
              <button onClick={() => handleDelete(bot.id)} className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {chatbots.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No chatbots yet. Click "Create New Chatbot" to begin.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBot ? 'Edit Chatbot' : 'Create New Chatbot'}>
        <ChatbotForm onSave={handleSave} onClose={closeModal} knowledgeBases={knowledgeBases} initialData={editingBot}/>
      </Modal>

      <Modal isOpen={!!activeChatbot} onClose={() => setActiveChatbot(null)} title={`Test: ${activeChatbot?.name}`}>
        {activeChatbot && <ChatInterface bot={activeChatbot} knowledgeBases={knowledgeBases} onInteraction={() => incrementChatbotUsage(activeChatbot.id)} />}
      </Modal>
      
      <Modal isOpen={!!embedBot} onClose={() => setEmbedBot(null)} title={`Embed Code for ${embedBot?.name}`}>
        {embedBot && <EmbedCodeModal bot={embedBot} onClose={() => setEmbedBot(null)} />}
      </Modal>
    </div>
  );
};
