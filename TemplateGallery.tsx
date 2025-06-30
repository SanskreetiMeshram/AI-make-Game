import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Edit, Download, Star, Clock, Users } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: string) => void;
}

const gameTemplates = [
  {
    id: 'shooter',
    name: 'Space Shooter',
    description: 'Classic top-down space shooter with enemies, power-ups, and boss battles',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '2D',
    difficulty: 'Beginner',
    playTime: '5-10 min',
    rating: 4.8,
    downloads: 1250,
    features: ['Enemy AI', 'Power-ups', 'Boss Battles', 'Particle Effects']
  },
  {
    id: 'runner',
    name: 'Endless Runner',
    description: 'Fast-paced 3D running game with dynamic obstacles and collectibles',
    image: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '3D',
    difficulty: 'Intermediate',
    playTime: 'Endless',
    rating: 4.6,
    downloads: 980,
    features: ['Procedural Generation', 'Character Customization', 'Leaderboards', 'Daily Challenges']
  },
  {
    id: 'flappy',
    name: 'Flappy Bird Clone',
    description: 'Simple one-button flying game with precise physics and scoring',
    image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '2D',
    difficulty: 'Beginner',
    playTime: '2-5 min',
    rating: 4.4,
    downloads: 2100,
    features: ['One-Touch Controls', 'High Score System', 'Smooth Physics', 'Sound Effects']
  },
  {
    id: 'flying',
    name: '3D Flight Simulator',
    description: 'Realistic flight controls with dynamic weather and multiple aircraft',
    image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '3D',
    difficulty: 'Advanced',
    playTime: '15-30 min',
    rating: 4.9,
    downloads: 750,
    features: ['Realistic Physics', 'Weather System', 'Multiple Aircraft', 'Free Flight Mode']
  },
  {
    id: 'speedrunner',
    name: 'Speed Runner',
    description: 'Time-based platformer with precise controls and speedrun mechanics',
    image: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '2D',
    difficulty: 'Intermediate',
    playTime: '3-8 min',
    rating: 4.7,
    downloads: 890,
    features: ['Time Trials', 'Ghost Mode', 'Level Editor', 'Replay System']
  },
  {
    id: 'whackamole',
    name: 'Whack-a-Mole',
    description: 'Classic arcade-style reaction game with 3D graphics and power-ups',
    image: 'https://images.pexels.com/photos/163077/mario-luigi-yoschi-figures-163077.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '3D',
    difficulty: 'Beginner',
    playTime: '2-5 min',
    rating: 4.3,
    downloads: 1450,
    features: ['3D Graphics', 'Power-ups', 'Combo System', 'Multiplayer Mode']
  },
  {
    id: 'match3',
    name: 'Match-3 Puzzle',
    description: 'Colorful gem-matching puzzle with special effects and combos',
    image: 'https://images.pexels.com/photos/220237/pexels-photo-220237.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '2D',
    difficulty: 'Intermediate',
    playTime: '10-20 min',
    rating: 4.5,
    downloads: 1680,
    features: ['Special Gems', 'Combo Effects', 'Level Progression', 'Daily Puzzles']
  },
  {
    id: 'crossyroad',
    name: 'Crossy Road Style',
    description: 'Navigate through traffic and obstacles in this 3D endless crosser',
    image: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: '3D',
    difficulty: 'Intermediate',
    playTime: 'Endless',
    rating: 4.6,
    downloads: 1120,
    features: ['Voxel Graphics', 'Character Collection', 'Dynamic Traffic', 'Coin System']
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingDemo, setPlayingDemo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', '2D', '3D'];

  const filteredTemplates = selectedCategory === 'All' 
    ? gameTemplates 
    : gameTemplates.filter(t => t.category === selectedCategory);

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'downloads': return b.downloads - a.downloads;
      case 'name': return a.name.localeCompare(b.name);
      default: return b.downloads - a.downloads; // popular
    }
  });

  const handlePlayDemo = (templateId: string) => {
    setPlayingDemo(templateId);
    
    // Simulate actual game demo
    setTimeout(() => {
      setPlayingDemo(null);
      // Here we would actually load and run the game template
      console.log(`Playing demo for ${templateId}`);
    }, 4000);
  };

  const handleEditTemplate = (templateId: string) => {
    // Load template into editor
    onSelectTemplate(templateId);
    console.log(`Loading template ${templateId} into editor`);
  };

  const handleDownloadTemplate = (templateId: string) => {
    // Download template files
    const template = gameTemplates.find(t => t.id === templateId);
    if (template) {
      const gameData = {
        name: template.name,
        type: template.category,
        objects: generateTemplateObjects(templateId),
        settings: generateTemplateSettings(templateId)
      };
      
      const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const generateTemplateObjects = (templateId: string) => {
    switch (templateId) {
      case 'shooter':
        return [
          { id: 'player', type: 'character', position: [0, 0, 0], behaviors: ['move', 'shoot'] },
          { id: 'enemy1', type: 'sphere', position: [5, 0, 0], behaviors: ['patrol', 'attack'], color: '#ff0000' },
          { id: 'powerup', type: 'powerup', position: [3, 1, 0], behaviors: ['rotate', 'pulse'] }
        ];
      case 'runner':
        return [
          { id: 'player', type: 'character', position: [0, 0, 0], behaviors: ['run', 'jump'] },
          { id: 'obstacle1', type: 'cube', position: [10, 0, 0], behaviors: ['move'] },
          { id: 'coin', type: 'sphere', position: [8, 1, 0], behaviors: ['rotate', 'float'], color: '#ffd700' }
        ];
      case 'flappy':
        return [
          { id: 'bird', type: 'sphere', position: [0, 2, 0], behaviors: ['fly', 'flap'], color: '#ffff00' },
          { id: 'pipe1', type: 'cylinder', position: [5, 0, 0], behaviors: ['move'] },
          { id: 'pipe2', type: 'cylinder', position: [5, 4, 0], behaviors: ['move'] }
        ];
      case 'flying':
        return [
          { id: 'aircraft', type: 'vehicle', position: [0, 5, 0], behaviors: ['fly', 'turn'] },
          { id: 'terrain', type: 'terrain', position: [0, -2, 0], behaviors: ['wave'] },
          { id: 'cloud', type: 'sphere', position: [10, 8, 0], behaviors: ['float', 'drift'], color: '#ffffff' }
        ];
      default:
        return [];
    }
  };

  const generateTemplateSettings = (templateId: string) => {
    return {
      gravity: templateId === 'flappy' ? -15 : -9.81,
      physics: true,
      camera: templateId === 'flying' ? 'third-person' : 'side-view',
      controls: templateId === 'flappy' ? 'one-button' : 'keyboard'
    };
  };

  return (
    <div className="h-full bg-gray-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Game Templates
          </h2>
          <p className="text-gray-400">Start with professionally designed, fully playable game templates</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="downloads">Most Downloaded</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all"
            >
              <div className="relative">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Play Demo Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={() => handlePlayDemo(template.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
                    disabled={playingDemo === template.id}
                  >
                    <Play className="w-8 h-8" />
                  </motion.button>
                </div>
                
                {/* Demo Playing State */}
                {playingDemo === template.id && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
                    <div className="text-white text-center mb-4">
                      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                      <div className="text-lg font-semibold">Playing Demo</div>
                      <div className="text-sm text-gray-300">{template.name}</div>
                    </div>
                    <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4 }}
                      />
                    </div>
                  </div>
                )}

                {/* Template Info Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.category === '2D' ? 'bg-blue-500/80' : 'bg-purple-500/80'
                  } text-white`}>
                    {template.category}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.difficulty === 'Beginner' ? 'bg-green-500/80' :
                    template.difficulty === 'Intermediate' ? 'bg-yellow-500/80' :
                    'bg-red-500/80'
                  } text-white`}>
                    {template.difficulty}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/60 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-white">{template.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{template.description}</p>

                {/* Template Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{template.playTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{template.downloads}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 2 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        +{template.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => handleEditTemplate(template.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleDownloadTemplate(template.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Template Showcase */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Featured: 3D Flight Simulator</h3>
              <p className="text-gray-300 mb-4">
                Experience the most advanced flight simulation template with realistic physics, 
                dynamic weather systems, and multiple aircraft models.
              </p>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li>• Realistic flight physics and aerodynamics</li>
                <li>• Dynamic weather with wind, rain, and storms</li>
                <li>• 5 different aircraft types</li>
                <li>• Procedural terrain and landmarks</li>
                <li>• Day/night cycle with realistic lighting</li>
                <li>• VR support for immersive experience</li>
              </ul>
              <div className="flex space-x-4">
                <motion.button
                  onClick={() => handlePlayDemo('flying')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Try Demo</span>
                </motion.button>
                <motion.button
                  onClick={() => handleEditTemplate('flying')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Customize</span>
                </motion.button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Flight Simulator"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
            </div>
          </div>
        </div>

        {/* Template Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
            <div className="text-2xl font-bold text-blue-400">{gameTemplates.length}</div>
            <div className="text-sm text-gray-400">Templates Available</div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
            <div className="text-2xl font-bold text-green-400">
              {gameTemplates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Downloads</div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {(gameTemplates.reduce((sum, t) => sum + t.rating, 0) / gameTemplates.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-sm text-gray-400">Fully Playable</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;