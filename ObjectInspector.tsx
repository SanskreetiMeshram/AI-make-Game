import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Palette, Zap, Plus, Trash2 } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface ObjectInspectorProps {
  objectId: string;
  onClose: () => void;
}

const ObjectInspector: React.FC<ObjectInspectorProps> = ({ objectId, onClose }) => {
  const { gameState, dispatch } = useGameContext();
  const obj = gameState.objects.find(o => o.id === objectId);
  const [activeTab, setActiveTab] = useState('transform');

  if (!obj) return null;

  const updateObjectProperty = (property: string, value: any) => {
    dispatch({
      type: 'UPDATE_OBJECT',
      payload: { id: objectId, property, value }
    });
  };

  const toggleBehavior = (behavior: string) => {
    const behaviors = obj.behaviors.includes(behavior)
      ? obj.behaviors.filter(b => b !== behavior)
      : [...obj.behaviors, behavior];
    
    updateObjectProperty('behaviors', behaviors);
  };

  // Comprehensive behavior list with categories
  const behaviorCategories = {
    'Movement': ['walk', 'run', 'jump', 'fly', 'swim', 'crawl', 'teleport', 'dash'],
    'Animation': ['rotate', 'bounce', 'float', 'pulse', 'wave', 'spiral', 'vibrate', 'breathe'],
    'Life': ['eat', 'sleep', 'drink', 'rest', 'grow', 'age', 'reproduce', 'die'],
    'Combat': ['attack', 'defend', 'dodge', 'block', 'charge', 'retreat', 'heal', 'rage'],
    'Social': ['follow', 'flee', 'dance', 'communicate', 'lead', 'cooperate', 'compete'],
    'AI': ['patrol', 'guard', 'hunt', 'search', 'wander', 'investigate', 'react', 'learn'],
    'Vehicle': ['drive', 'brake', 'turn', 'accelerate', 'reverse', 'drift', 'jump', 'boost'],
    'Nature': ['sway', 'wind', 'waterfall', 'waves', 'seasons', 'weather', 'erosion', 'bloom'],
    'Physics': ['gravity', 'magnetism', 'friction', 'bounce', 'stick', 'repel', 'attract', 'orbit'],
    'Interactive': ['collect', 'activate', 'trigger', 'open', 'close', 'push', 'pull', 'carry']
  };

  const tabs = [
    { id: 'transform', label: 'Transform', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'behaviors', label: 'Behaviors', icon: Zap },
    { id: 'physics', label: 'Physics', icon: Settings }
  ];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700/50 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Object Inspector</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-400">
          <div>Type: <span className="text-blue-400">{obj.type}</span></div>
          <div>ID: <span className="text-gray-500 font-mono text-xs">{obj.id}</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'transform' && (
          <div className="space-y-4">
            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis}>
                    <label className="block text-xs text-gray-500 mb-1">{axis}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={obj.position[index].toFixed(2)}
                      onChange={(e) => {
                        const newPos = [...obj.position];
                        newPos[index] = parseFloat(e.target.value) || 0;
                        updateObjectProperty('position', newPos);
                      }}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rotation</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis}>
                    <label className="block text-xs text-gray-500 mb-1">{axis}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={((obj.rotation?.[index] || 0) * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => {
                        const newRot = obj.rotation || [0, 0, 0];
                        newRot[index] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                        updateObjectProperty('rotation', newRot);
                      }}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis}>
                    <label className="block text-xs text-gray-500 mb-1">{axis}</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={(obj.scale?.[index] || 1).toFixed(2)}
                      onChange={(e) => {
                        const newScale = obj.scale || [1, 1, 1];
                        newScale[index] = Math.max(0.1, parseFloat(e.target.value) || 1);
                        updateObjectProperty('scale', newScale);
                      }}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={obj.color || '#ffffff'}
                  onChange={(e) => updateObjectProperty('color', e.target.value)}
                  className="w-12 h-8 bg-gray-800 border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={obj.color || '#ffffff'}
                  onChange={(e) => updateObjectProperty('color', e.target.value)}
                  className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none text-white font-mono"
                />
              </div>
            </div>

            {/* Material Properties */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Material</label>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Metalness</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.3"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Roughness</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-600" />
                <span className="text-sm text-gray-300">Visible</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                <span className="text-sm text-gray-300">Cast Shadows</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                <span className="text-sm text-gray-300">Receive Shadows</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'behaviors' && (
          <div className="space-y-4">
            {/* Active Behaviors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Active Behaviors</h4>
                <span className="text-xs text-gray-500">{obj.behaviors.length}</span>
              </div>
              
              {obj.behaviors.length > 0 ? (
                <div className="space-y-1">
                  {obj.behaviors.map((behavior) => (
                    <div
                      key={behavior}
                      className="flex items-center justify-between p-2 bg-blue-500/20 border border-blue-500/30 rounded"
                    >
                      <span className="text-sm text-blue-400 font-medium">{behavior}</span>
                      <button
                        onClick={() => toggleBehavior(behavior)}
                        className="p-1 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No behaviors assigned
                </div>
              )}
            </div>

            {/* Available Behaviors */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Available Behaviors</h4>
              
              {Object.entries(behaviorCategories).map(([category, behaviors]) => (
                <div key={category} className="mb-4">
                  <h5 className="text-xs font-medium text-gray-400 mb-2">{category}</h5>
                  <div className="grid grid-cols-2 gap-1">
                    {behaviors.map((behavior) => (
                      <button
                        key={behavior}
                        onClick={() => toggleBehavior(behavior)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          obj.behaviors.includes(behavior)
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {behavior}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'physics' && (
          <div className="space-y-4">
            {/* Physics Properties */}
            <div>
              <label className="flex items-center space-x-2 mb-3">
                <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-600" />
                <span className="text-sm text-gray-300">Enable Physics</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mass</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                defaultValue="1"
                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Friction</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.5"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bounciness</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.3"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                <span className="text-sm text-gray-300">Is Trigger</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                <span className="text-sm text-gray-300">Kinematic</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                <span className="text-sm text-gray-300">Freeze Rotation</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Duplicate object
              const newObj = {
                ...obj,
                id: `${obj.type}_${Date.now()}`,
                position: [obj.position[0] + 1, obj.position[1], obj.position[2]] as [number, number, number]
              };
              dispatch({ type: 'ADD_OBJECT', payload: newObj });
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            Duplicate
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              dispatch({ type: 'DELETE_OBJECT', payload: { id: objectId } });
              onClose();
            }}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ObjectInspector;