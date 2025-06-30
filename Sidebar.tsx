import React from 'react';
import { motion } from 'framer-motion';
import { 
  Edit3, 
  Package, 
  Grid3X3, 
  Sparkles, 
  FolderOpen, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'editor', label: 'Game Editor', icon: Edit3 },
  { id: 'assets', label: 'Asset Library', icon: Package },
  { id: 'templates', label: 'Templates', icon: Grid3X3 },
  { id: 'ai-tools', label: 'AI Tools', icon: Sparkles },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  collapsed, 
  onToggleCollapse 
}) => {
  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0, width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/80 backdrop-blur-sm border-r border-blue-500/20 flex flex-col relative z-40"
    >
      <div className="p-4 border-b border-gray-700/50">
        <motion.button
          onClick={onToggleCollapse}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </motion.button>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </motion.button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <div className={`text-xs text-gray-500 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? 'v1.0' : 'EpicEnders v1.0.0'}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;