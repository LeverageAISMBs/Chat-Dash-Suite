
import React, { useState } from 'react';
import { View, KnowledgeBase, Chatbot, VoiceAgent } from './types';
import { SideNav } from './components/SideNav';
import { DashboardView } from './components/DashboardView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { ChatbotsView } from './components/ChatbotsView';
import { VoiceAgentView } from './components/VoiceAgentView';
import { AssistantPanel } from './components/AssistantPanel';

// Mock Data
const MOCK_KNOWLEDGE_BASES: KnowledgeBase[] = [
    { id: 'kb1', name: 'Product FAQs', sources: [], totalSize: 12000, createdAt: new Date().toISOString() },
    { id: 'kb2', name: 'Internal Docs', sources: [], totalSize: 56000, createdAt: new Date().toISOString() },
];

const MOCK_CHATBOTS: Chatbot[] = [
    { id: 'cb1', name: 'Customer Support Bot', systemPrompt: 'You are a helpful customer support agent.', knowledgeBaseId: 'kb1', useThinkingMode: false, createdAt: new Date().toISOString(), usage: 150 },
    { id: 'cb2', name: 'Developer Assistant', systemPrompt: 'You are an expert developer assistant.', knowledgeBaseId: 'kb2', useThinkingMode: true, createdAt: new Date().toISOString(), usage: 88 },
];

const MOCK_VOICE_AGENTS: VoiceAgent[] = [
    { id: 'va1', name: 'Coffee Shop Barista', systemInstruction: 'You are a cheerful barista at a coffee shop.', voice: 'Zephyr', knowledgeBaseId: null, createdAt: new Date().toISOString() }
]

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(MOCK_KNOWLEDGE_BASES);
  const [chatbots, setChatbots] = useState<Chatbot[]>(MOCK_CHATBOTS);
  const [voiceAgents, setVoiceAgents] = useState<VoiceAgent[]>(MOCK_VOICE_AGENTS);
  
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Knowledge Base CRUD
  const addKnowledgeBase = (kb: Omit<KnowledgeBase, 'id' | 'createdAt'>) => {
    const newKb: KnowledgeBase = { ...kb, id: `kb${Date.now()}`, createdAt: new Date().toISOString() };
    setKnowledgeBases(prev => [...prev, newKb]);
  };
  
  const updateKnowledgeBase = (updatedKb: KnowledgeBase) => {
    setKnowledgeBases(prev => prev.map(kb => kb.id === updatedKb.id ? updatedKb : kb));
  }

  const deleteKnowledgeBase = (id: string) => {
    setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
    // When a KB is deleted, update any chatbots using it
    setChatbots(prev => prev.map(bot => bot.knowledgeBaseId === id ? { ...bot, knowledgeBaseId: null } : bot));
    setVoiceAgents(prev => prev.map(agent => agent.knowledgeBaseId === id ? { ...agent, knowledgeBaseId: null } : agent));
  }

  // Chatbot CRUD
  const addChatbot = (bot: Omit<Chatbot, 'id' | 'createdAt' | 'usage'>) => {
    const newBot: Chatbot = { ...bot, id: `cb${Date.now()}`, createdAt: new Date().toISOString(), usage: 0 };
    setChatbots(prev => [...prev, newBot]);
  }
  
  const updateChatbot = (updatedBot: Chatbot) => {
    setChatbots(prev => prev.map(bot => bot.id === updatedBot.id ? updatedBot : bot));
  }
  
  const deleteChatbot = (id: string) => {
    setChatbots(prev => prev.filter(bot => bot.id !== id));
  }

  // Voice Agent CRUD
  const addVoiceAgent = (agent: Omit<VoiceAgent, 'id' | 'createdAt'>) => {
      const newAgent: VoiceAgent = { ...agent, id: `va${Date.now()}`, createdAt: new Date().toISOString() };
      setVoiceAgents(prev => [...prev, newAgent]);
  }

  const updateVoiceAgent = (updatedAgent: VoiceAgent) => {
    setVoiceAgents(prev => prev.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
  }

  const deleteVoiceAgent = (id: string) => {
    setVoiceAgents(prev => prev.filter(agent => agent.id !== id));
  }

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <DashboardView chatbots={chatbots} knowledgeBases={knowledgeBases} voiceAgents={voiceAgents} setCurrentView={setCurrentView} />;
      case View.KnowledgeBases:
        return <KnowledgeBaseView 
                  knowledgeBases={knowledgeBases} 
                  addKnowledgeBase={addKnowledgeBase}
                  updateKnowledgeBase={updateKnowledgeBase}
                  deleteKnowledgeBase={deleteKnowledgeBase}
                />;
      case View.Chatbots:
        return <ChatbotsView 
                  chatbots={chatbots} 
                  knowledgeBases={knowledgeBases} 
                  addChatbot={addChatbot}
                  updateChatbot={updateChatbot}
                  deleteChatbot={deleteChatbot}
                />;
      case View.VoiceAgents:
        return <VoiceAgentView 
                  voiceAgents={voiceAgents} 
                  addVoiceAgent={addVoiceAgent}
                  knowledgeBases={knowledgeBases}
                  updateVoiceAgent={updateVoiceAgent}
                  deleteVoiceAgent={deleteVoiceAgent}
                />;
      default:
        return <DashboardView chatbots={chatbots} knowledgeBases={knowledgeBases} voiceAgents={voiceAgents} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <SideNav currentView={currentView} setCurrentView={setCurrentView} isOpen={isLeftPanelOpen} setIsOpen={setIsLeftPanelOpen} />
      
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-4 left-4 z-20 lg:hidden">
            <button onClick={() => setIsLeftPanelOpen(true)} className="p-2 bg-gray-800 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        </div>
        <div className="absolute top-4 right-4 z-20">
            <button onClick={() => setIsRightPanelOpen(true)} className="p-2 bg-gray-800 rounded-md hover:bg-blue-600 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
        </div>

        {renderView()}
      </main>

      <AssistantPanel isOpen={isRightPanelOpen} onClose={() => setIsRightPanelOpen(false)} />
    </div>
  );
};

export default App;