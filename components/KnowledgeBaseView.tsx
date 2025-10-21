
import React, { useState } from 'react';
import { KnowledgeBase, KnowledgeSource } from '../types';
import { Modal } from './Modal';

interface KnowledgeBaseViewProps {
  knowledgeBases: KnowledgeBase[];
  addKnowledgeBase: (kb: Omit<KnowledgeBase, 'id' | 'createdAt'>) => void;
  // deleteKnowledgeBase: (id: string) => void;
}

const MAX_SOURCES = 10;
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const NewKnowledgeBaseForm: React.FC<{ onSave: (kb: Omit<KnowledgeBase, 'id' | 'createdAt'>) => void; onClose: () => void; }> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [error, setError] = useState('');

  const totalSize = sources.reduce((acc, s) => acc + s.size, 0);

  const handleAddUrl = () => {
    if (!currentUrl || !urlContent) {
      setError('URL and its content summary are required.');
      return;
    }
    if (sources.length >= MAX_SOURCES) {
      setError(`Cannot add more than ${MAX_SOURCES} sources.`);
      return;
    }
    const newSize = totalSize + urlContent.length;
    if (newSize > MAX_SIZE_BYTES) {
      setError(`Total size cannot exceed ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSources([...sources, { id: Date.now().toString(), type: 'URL', name: currentUrl, content: urlContent, size: urlContent.length }]);
    setCurrentUrl('');
    setUrlContent('');
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (sources.length >= MAX_SOURCES) {
      setError(`Cannot add more than ${MAX_SOURCES} sources.`);
      return;
    }
    const newSize = totalSize + file.size;
    if (newSize > MAX_SIZE_BYTES) {
      setError(`Total size cannot exceed ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSources([...sources, { id: Date.now().toString(), type: 'FILE', name: file.name, content, size: file.size }]);
    };
    reader.readAsText(file);
    setError('');
    e.target.value = ''; // Reset file input
  };
  
  const handleSave = () => {
    if (!name.trim()) {
        setError("Knowledge base name is required.");
        return;
    }
    if(sources.length === 0) {
        setError("At least one source is required.");
        return;
    }
    onSave({ name, sources, totalSize });
  }

  return (
    <div className="space-y-4">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Knowledge Base Name" className="w-full bg-gray-700 p-2 rounded text-white" />
      
      <div className="bg-gray-700 p-4 rounded-lg space-y-3">
        <h3 className="font-semibold">Add URL Source</h3>
        <p className="text-sm text-gray-400">Due to browser limitations, paste the URL and a summary of its content below.</p>
        <input type="text" value={currentUrl} onChange={e => setCurrentUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-gray-600 p-2 rounded text-white"/>
        <textarea value={urlContent} onChange={e => setUrlContent(e.target.value)} placeholder="Paste content summary here..." rows={4} className="w-full bg-gray-600 p-2 rounded text-white"/>
        <button onClick={handleAddUrl} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors">Add URL</button>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Add File Source</h3>
        <input type="file" onChange={handleFileChange} accept=".txt,.md,.json" className="text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
      </div>
      
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="p-4 border border-gray-600 rounded-lg">
        <h3 className="font-semibold mb-2">Sources ({sources.length}/{MAX_SOURCES}) - Total Size: {(totalSize / (1024*1024)).toFixed(2)}MB / {MAX_SIZE_MB}MB</h3>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {sources.map(s => (
            <li key={s.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <span className={`text-xs font-bold ${s.type === 'URL' ? 'text-green-400' : 'text-purple-400'}`}>{s.type}</span>
              <span className="truncate mx-2 text-sm text-gray-300">{s.name}</span>
              <span className="text-xs text-gray-400">{(s.size / 1024).toFixed(2)} KB</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white transition-colors">Cancel</button>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition-colors">Save</button>
      </div>
    </div>
  );
};


export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ knowledgeBases, addKnowledgeBase }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSave = (kb: Omit<KnowledgeBase, 'id' | 'createdAt'>) => {
    addKnowledgeBase(kb);
    setIsModalOpen(false);
  }

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Knowledge Bases</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105">
          Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeBases.map((kb) => (
          <div key={kb.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-white truncate">{kb.name}</h2>
            <p className="text-gray-400 text-sm mt-1">Created on: {new Date(kb.createdAt).toLocaleDateString()}</p>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
              <span className="text-gray-300">{kb.sources.length} sources</span>
              <span className="text-gray-300">{(kb.totalSize / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          </div>
        ))}
        {knowledgeBases.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No knowledge bases yet. Click "Create New" to start.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Knowledge Base">
        <NewKnowledgeBaseForm onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
