import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Folder, Calendar, Users, Settings, Trash2, Copy } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  type: '2D' | '3D' | 'Mixed';
  lastModified: string;
  collaborators: number;
  status: 'Active' | 'Archived' | 'Draft';
  thumbnail: string;
}

interface ProjectManagerProps {
  onOpenProject: (projectId: string) => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Space Adventure',
    description: 'Epic space exploration game with combat mechanics',
    type: '3D',
    lastModified: '2 hours ago',
    collaborators: 3,
    status: 'Active',
    thumbnail: 'https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Pixel Platformer',
    description: 'Retro-style 2D platformer with unique mechanics',
    type: '2D',
    lastModified: '1 day ago',
    collaborators: 1,
    status: 'Active',
    thumbnail: 'https://images.pexels.com/photos/163077/mario-luigi-yoschi-figures-163077.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    name: 'Racing Championship',
    description: 'High-speed racing game with customizable vehicles',
    type: '3D',
    lastModified: '3 days ago',
    collaborators: 5,
    status: 'Draft',
    thumbnail: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '4',
    name: 'Puzzle Quest',
    description: 'Mind-bending puzzle game with beautiful art',
    type: '2D',
    lastModified: '1 week ago',
    collaborators: 2,
    status: 'Archived',
    thumbnail: 'https://images.pexels.com/photos/220237/pexels-photo-220237.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const ProjectManager: React.FC<ProjectManagerProps> = ({ onOpenProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/20';
      case 'Draft': return 'text-yellow-400 bg-yellow-400/20';
      case 'Archived': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '2D': return 'text-blue-400 bg-blue-400/20';
      case '3D': return 'text-purple-400 bg-purple-400/20';
      case 'Mixed': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="h-full bg-gray-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              My Projects
            </h2>
            <p className="text-gray-400">Manage and organize your game projects</p>
          </div>
          
          <motion.button
            onClick={() => setShowNewProjectModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </motion.button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer"
              onClick={() => onOpenProject(project.id)}
            >
              <div className="relative">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(project.type)}`}>
                    {project.type}
                  </span>
                </div>
                
                <div className="absolute top-3 right-3">
                  <div className="flex space-x-1">
                    <button className="p-1 bg-black/50 hover:bg-black/70 text-white rounded transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-1 bg-black/50 hover:bg-black/70 text-white rounded transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{project.lastModified}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{project.collaborators}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProject(project.id);
                    }}
                  >
                    Open
                  </motion.button>
                  
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">Create your first game project to get started</p>
            <motion.button
              onClick={() => setShowNewProjectModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Create Project
            </motion.button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-blue-400">4</div>
            <div className="text-sm text-gray-400">Total Projects</div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-green-400">2</div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-yellow-400">1</div>
            <div className="text-sm text-gray-400">In Draft</div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-purple-400">11</div>
            <div className="text-sm text-gray-400">Collaborators</div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Create New Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                <input
                  type="text"
                  placeholder="My Awesome Game"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  placeholder="Describe your game..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white h-20 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white">
                  <option value="2D">2D Game</option>
                  <option value="3D">3D Game</option>
                  <option value="Mixed">Mixed 2D/3D</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  // Create project logic here
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;