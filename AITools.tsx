import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Image, Music, User, Gamepad2, Download } from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  color: string;
}

const aiTools: AITool[] = [
  {
    id: 'character-gen',
    name: 'Character Generator',
    description: 'Create unique 2D/3D characters from text descriptions',
    icon: User,
    category: 'Characters',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'environment-gen',
    name: 'Environment Generator',
    description: 'Generate immersive game environments and landscapes',
    icon: Image,
    category: 'Environments',
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'animation-gen',
    name: 'Animation Creator',
    description: 'Generate smooth animations for sprites and 3D models',
    icon: Wand2,
    category: 'Animations',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'sound-gen',
    name: 'Sound Designer',
    description: 'Create sound effects and ambient audio',
    icon: Music,
    category: 'Audio',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'behavior-gen',
    name: 'Behavior Scripts',
    description: 'Generate game logic and NPC behaviors',
    icon: Gamepad2,
    category: 'Logic',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'texture-gen',
    name: 'Texture Generator',
    description: 'Create seamless textures and materials',
    icon: Sparkles,
    category: 'Materials',
    color: 'from-indigo-500 to-purple-500'
  }
];

const AITools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedTool) return;

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent({
        type: selectedTool,
        prompt,
        result: 'Generated content would appear here',
        timestamp: new Date().toISOString()
      });
      setIsGenerating(false);
    }, 3000);
  };

  const selectedToolData = aiTools.find(tool => tool.id === selectedTool);

  return (
    <div className="h-full bg-gray-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            AI Creative Tools
          </h2>
          <p className="text-gray-400">Generate game assets with artificial intelligence</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Tools Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-4">Available Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {aiTools.map((tool) => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;

                return (
                  <motion.div
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br ' + tool.color + ' text-white'
                        : 'bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        isSelected ? 'bg-white/20' : 'bg-gray-800'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{tool.name}</h4>
                        <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                          {tool.description}
                        </p>
                        <div className="mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Generation Results */}
            {generatedContent && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Generated Content</h4>
                  <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-400 mb-2">Prompt:</div>
                  <div className="text-white">{generatedContent.prompt}</div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white font-medium mb-2">Content Generated Successfully!</div>
                    <div className="text-gray-400 text-sm">Ready to add to your game</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generation Panel */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 h-fit">
            <h3 className="text-lg font-semibold text-white mb-4">AI Generation</h3>
            
            {selectedToolData ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <selectedToolData.icon className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">{selectedToolData.name}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{selectedToolData.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Describe what you want to create:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., A heroic knight character with blue armor and a glowing sword..."
                    className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white resize-none"
                  />
                </div>

                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    isGenerating
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Generate</span>
                    </div>
                  )}
                </motion.button>

                {/* Generation Tips */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-6">
                  <h4 className="text-sm font-medium text-purple-400 mb-2">💡 Tips for better results:</h4>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Be specific about style, colors, and details</li>
                    <li>• Mention the game genre for context</li>
                    <li>• Include reference styles (e.g., "cartoon", "realistic")</li>
                    <li>• Specify dimensions for 2D/3D assets</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400">Select an AI tool to get started</div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Generations */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Generations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Fantasy Knight</div>
                    <div className="text-xs text-gray-400">2 hours ago</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  "A heroic knight with blue armor..."
                </p>
                <div className="flex space-x-2">
                  <button className="flex-1 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors">
                    Use in Game
                  </button>
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;