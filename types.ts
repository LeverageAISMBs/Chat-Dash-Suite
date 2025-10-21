
export enum View {
  Dashboard = 'DASHBOARD',
  KnowledgeBases = 'KNOWLEDGE_BASES',
  Chatbots = 'CHATBOTS',
  VoiceAgents = 'VOICE_AGENTS',
}

export type KnowledgeSource = {
  id: string;
  type: 'URL' | 'FILE';
  name: string;
  content: string;
  size: number; // in bytes
};

export type KnowledgeBase = {
  id: string;
  name: string;
  sources: KnowledgeSource[];
  totalSize: number; // in bytes
  createdAt: string;
};

export type Chatbot = {
  id: string;
  name: string;
  systemPrompt: string;
  knowledgeBaseId: string | null;
  useThinkingMode: boolean;
  createdAt: string;
  usage: number;
};

export type VoiceAgent = {
  id: string;
  name: string;
  systemInstruction: string;
  voice: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'model';
  text: string;
};
