
import React from 'react';
import { Chatbot, KnowledgeBase, VoiceAgent, View } from '../types';

interface DashboardViewProps {
  chatbots: Chatbot[];
  knowledgeBases: KnowledgeBase[];
  voiceAgents: VoiceAgent[];
  setCurrentView: (view: View) => void;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-700/50 transition-colors duration-200">
    <div className="bg-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ chatbots, knowledgeBases, voiceAgents, setCurrentView }) => {
  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Chatbots" value={chatbots.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} />
        <StatCard title="Knowledge Bases" value={knowledgeBases.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s-4 4 0 4s4-4 4-4M12 7s-4 4 0 4s4-4 4-4" /></svg>} />
        <StatCard title="Voice Agents" value={voiceAgents.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>} />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">Chatbot Usage</h2>
        <div className="space-y-4">
          {chatbots.length > 0 ? (
            chatbots.sort((a,b) => b.usage - a.usage).map((bot) => (
              <div key={bot.id} className="flex items-center justify-between">
                <p className="text-gray-300">{bot.name}</p>
                <div className="flex items-center space-x-2">
                  <div className="w-48 bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, bot.usage / 10)}%` }}></div>
                  </div>
                  <p className="text-sm font-medium text-gray-400">{bot.usage} interactions</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No chatbots created yet. <button onClick={() => setCurrentView(View.Chatbots)} className="text-blue-400 hover:underline">Create one now</button></p>
          )}
        </div>
      </div>
    </div>
  );
};
