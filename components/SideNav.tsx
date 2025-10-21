
import React from 'react';
import { View } from '../types';
import { NAV_ITEMS, CloseIcon } from '../constants';

interface SideNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const SideNav: React.FC<SideNavProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 bg-gray-900 border-r border-gray-800 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Gemini Suite</h1>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center p-3 my-1 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};
