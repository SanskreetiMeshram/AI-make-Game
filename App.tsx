import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GameEditor from './components/GameEditor';
import AssetLibrary from './components/AssetLibrary';
import TemplateGallery from './components/TemplateGallery';
import AITools from './components/AITools';
import ProjectManager from './components/ProjectManager';
import { GameProvider } from './context/GameContext';

type ViewType = 'editor' | 'assets' | 'templates' | 'ai-tools' | 'projects';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderMainContent = () => {
    switch (currentView) {
      case 'editor':
        return <GameEditor />;
      case 'assets':
        return <AssetLibrary />;
      case 'templates':
        return <TemplateGallery onSelectTemplate={() => setCurrentView('editor')} />;
      case 'ai-tools':
        return <AITools />;
      case 'projects':
        return <ProjectManager onOpenProject={() => setCurrentView('editor')} />;
      default:
        return <GameEditor />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GameProvider>
        <div className="h-screen bg-black text-white overflow-hidden">
          {/* Animated background */}
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900 opacity-50" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          
          <Header />
          
          <div className="flex h-[calc(100vh-4rem)]">
            <Sidebar 
              currentView={currentView}
              onViewChange={setCurrentView}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            
            <main className={`flex-1 relative transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </GameProvider>
    </DndProvider>
  );
}

export default App;