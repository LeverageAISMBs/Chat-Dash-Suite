
import React, { useState } from 'react';
import { Chatbot, KnowledgeBase, ChatMessage } from '../types';
import { Modal } from './Modal';
import { getResponse } from '../services/geminiService';
import { Spinner } from './Spinner';

interface ChatbotsViewProps {
  chatbots: Chatbot[];
  knowledgeBases: KnowledgeBase[];
  addChatbot: (bot: Omit<Chatbot, 'id' | 'createdAt' | 'usage'>) => void;
}

const NewChatbotForm: React.FC<{ onSave: (bot: Omit<Chatbot, 'id' | 'createdAt' | 'usage'>) => void; onClose: () => void; knowledgeBases: KnowledgeBase[] }> = ({ onSave, onClose, knowledgeBases }) => {
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [error, setError] = useState('');

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
      <select onChange={e => setKnowledgeBaseId(e.target.value === 'none' ? null : e.target.value)} defaultValue="none" className="w-full bg-gray-700 p-2 rounded">
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

const ChatInterface: React.FC<{ bot: Chatbot, knowledgeBases: KnowledgeBase[] }> = ({ bot, knowledgeBases }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const knowledgeBase = knowledgeBases.find(kb => kb.id === bot.knowledgeBaseId);
    const knowledgeContext = knowledgeBase ? knowledgeBase.sources.map(s => s.content).join('\n\n') : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await getResponse(input, messages, bot.systemPrompt, knowledgeContext, bot.useThinkingMode);
        
        const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-[60vh] bg-gray-700 rounded-lg">
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

const EmbedCodeModal: React.FC<{ bot: Chatbot, onClose: () => void }> = ({ bot, onClose }) => {
    const embedCode = `<script>
    window.geminiChatbotConfig = {
        botId: "${bot.id}"
    };
</script>
<script src="https://your-domain.com/chatbot-loader.js" async defer></script>`;

    return (
        <div className="space-y-4">
            <p className="text-gray-300">Copy this snippet and paste it into the `<body>` of your website to embed this chatbot.</p>
            <pre className="bg-gray-900 p-4 rounded-lg text-green-300 text-sm overflow-x-auto">
                <code>{embedCode}</code>
            </pre>
            <div className="flex justify-end">
                <button onClick={() => { navigator.clipboard.writeText(embedCode); onClose(); }} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors">Copy & Close</button>
            </div>
        </div>
    )
}

export const ChatbotsView: React.FC<ChatbotsViewProps> = ({ chatbots, knowledgeBases, addChatbot }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChatbot, setActiveChatbot] = useState<Chatbot | null>(null);
  const [embedBot, setEmbedBot] = useState<Chatbot | null>(null);

  const handleSave = (bot: Omit<Chatbot, 'id' | 'createdAt' | 'usage'>) => {
    addChatbot(bot);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Chatbots</h1>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105">
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
            </div>
          </div>
        ))}
        {chatbots.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No chatbots yet. Click "Create New Chatbot" to begin.</p>}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Chatbot">
        <NewChatbotForm onSave={handleSave} onClose={() => setIsCreateModalOpen(false)} knowledgeBases={knowledgeBases} />
      </Modal>

      <Modal isOpen={!!activeChatbot} onClose={() => setActiveChatbot(null)} title={`Test: ${activeChatbot?.name}`}>
        {activeChatbot && <ChatInterface bot={activeChatbot} knowledgeBases={knowledgeBases} />}
      </Modal>
      
      <Modal isOpen={!!embedBot} onClose={() => setEmbedBot(null)} title={`Embed Code for ${embedBot?.name}`}>
        {embedBot && <EmbedCodeModal bot={embedBot} onClose={() => setEmbedBot(null)} />}
      </Modal>
    </div>
  );
};
