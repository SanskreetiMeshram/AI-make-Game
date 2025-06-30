import React from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Download, Upload, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-black/80 backdrop-blur-sm border-b border-blue-500/20 px-6 flex items-center justify-between relative z-50">
      <div className="flex items-center space-x-4">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EpicEnders
          </h1>
        </motion.div>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Play Test</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </motion.button>

        <div className="w-px h-6 bg-gray-600 mx-2" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
        </motion.button>
      </div>
    </header>
  );
};

export default Header;