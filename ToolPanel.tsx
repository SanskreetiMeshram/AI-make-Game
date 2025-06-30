import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Circle, 
  Triangle, 
  User, 
  TreePine, 
  Mountain, 
  Car,
  Zap,
  Gamepad2
} from 'lucide-react';

interface ToolPanelProps {
  onAddObject: (type: string) => void;
}

const objectTypes = [
  { type: 'cube', label: 'Cube', icon: Box, color: 'text-blue-400' },
  { type: 'sphere', label: 'Sphere', icon: Circle, color: 'text-green-400' },
  { type: 'cylinder', label: 'Cylinder', icon: Triangle, color: 'text-yellow-400' },
  { type: 'cone', label: 'Cone', icon: Triangle, color: 'text-orange-400' },
  { type: 'character', label: 'Character', icon: User, color: 'text-purple-400' },
  { type: 'tree', label: 'Tree', icon: TreePine, color: 'text-green-500' },
  { type: 'terrain', label: 'Terrain', icon: Mountain, color: 'text-brown-400' },
  { type: 'vehicle', label: 'Vehicle', icon: Car, color: 'text-red-400' },
  { type: 'powerup', label: 'Power-up', icon: Zap, color: 'text-yellow-500' },
  { type: 'interactive', label: 'Interactive', icon: Gamepad2, color: 'text-cyan-400' },
];

const ToolPanel: React.FC<ToolPanelProps> = ({ onAddObject }) => {
  return (
    <div className="w-64 bg-gray-900/80 backdrop-blur-sm border-l border-gray-700/50 p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Game Objects</h3>
      
      <div className="space-y-2">
        {objectTypes.map((obj) => {
          const Icon = obj.icon;
          return (
            <motion.button
              key={obj.type}
              onClick={() => onAddObject(obj.type)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all border border-transparent hover:border-gray-600"
            >
              <Icon className={`w-5 h-5 ${obj.color}`} />
              <span className="text-gray-300 font-medium">{obj.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
          >
            Import 3D Model
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors"
          >
            Generate with AI
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ToolPanel;