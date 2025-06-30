import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Download, Plus, Grid, List } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'model' | 'texture' | 'audio' | 'animation' | 'sprite';
  category: string;
  thumbnail: string;
  size: string;
  format: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Spaceship Model',
    type: 'model',
    category: '3D Models',
    thumbnail: 'https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=200',
    size: '2.4 MB',
    format: '.fbx'
  },
  {
    id: '2',
    name: 'Character Walk',
    type: 'animation',
    category: 'Animations',
    thumbnail: 'https://images.pexels.com/photos/163077/mario-luigi-yoschi-figures-163077.jpeg?auto=compress&cs=tinysrgb&w=200',
    size: '156 KB',
    format: '.fbx'
  },
  {
    id: '3',
    name: 'Laser Sound',
    type: 'audio',
    category: 'Audio',
    thumbnail: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=200',
    size: '89 KB',
    format: '.wav'
  },
  {
    id: '4',
    name: 'Stone Texture',
    type: 'texture',
    category: 'Textures',
    thumbnail: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=200',
    size: '512 KB',
    format: '.png'
  },
  {
    id: '5',
    name: 'Hero Sprite',
    type: 'sprite',
    category: 'Sprites',
    thumbnail: 'https://images.pexels.com/photos/163077/mario-luigi-yoschi-figures-163077.jpeg?auto=compress&cs=tinysrgb&w=200',
    size: '64 KB',
    format: '.png'
  },
  {
    id: '6',
    name: 'Tree Model',
    type: 'model',
    category: '3D Models',
    thumbnail: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=200',
    size: '1.2 MB',
    format: '.obj'
  }
];

const AssetLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const categories = ['All', '3D Models', 'Textures', 'Audio', 'Animations', 'Sprites'];

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'model': return 'text-blue-400';
      case 'texture': return 'text-green-400';
      case 'audio': return 'text-purple-400';
      case 'animation': return 'text-orange-400';
      case 'sprite': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full bg-gray-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Asset Library
          </h2>
          <p className="text-gray-400">Manage your game assets and resources</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </motion.button>
          </div>
        </div>

        {/* Selected Assets Bar */}
        {selectedAssets.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-medium">
                {selectedAssets.length} asset{selectedAssets.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors">
                  Add to Scene
                </button>
                <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  Download
                </button>
                <button 
                  onClick={() => setSelectedAssets([])}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assets Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className={`bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  selectedAssets.includes(asset.id)
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
                onClick={() => toggleAssetSelection(asset.id)}
              >
                <div className="relative">
                  <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full bg-black/60 ${getTypeColor(asset.type)}`}>
                      {asset.type}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-white truncate mb-1">{asset.name}</h4>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{asset.size}</span>
                    <span>{asset.format}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border transition-all cursor-pointer ${
                  selectedAssets.includes(asset.id)
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
                onClick={() => toggleAssetSelection(asset.id)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{asset.name}</h4>
                    <p className="text-sm text-gray-400">{asset.category}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${getTypeColor(asset.type)} font-medium`}>
                      {asset.type}
                    </div>
                    <div className="text-xs text-gray-400">{asset.size} • {asset.format}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or upload new assets</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Upload Assets
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetLibrary;