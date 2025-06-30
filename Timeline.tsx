import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Square, 
  Plus,
  Scissors,
  Copy,
  Trash2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Settings
} from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface Keyframe {
  id: string;
  time: number;
  property: string;
  value: any;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
}

interface AnimationTrack {
  id: string;
  objectId: string;
  objectName: string;
  property: string;
  keyframes: Keyframe[];
  color: string;
  visible: boolean;
  locked: boolean;
}

const Timeline: React.FC = () => {
  const { gameState, dispatch } = useGameContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [selectedKeyframes, setSelectedKeyframes] = useState<string[]>([]);
  const [tracks, setTracks] = useState<AnimationTrack[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // Initialize tracks for game objects
  useEffect(() => {
    const newTracks: AnimationTrack[] = [];
    gameState.objects.forEach((obj, index) => {
      const baseColor = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5];
      
      // Position tracks
      ['position.x', 'position.y', 'position.z'].forEach((prop, propIndex) => {
        newTracks.push({
          id: `${obj.id}_${prop}`,
          objectId: obj.id,
          objectName: obj.type,
          property: prop,
          keyframes: [],
          color: baseColor,
          visible: true,
          locked: false
        });
      });

      // Rotation tracks
      ['rotation.x', 'rotation.y', 'rotation.z'].forEach((prop) => {
        newTracks.push({
          id: `${obj.id}_${prop}`,
          objectId: obj.id,
          objectName: obj.type,
          property: prop,
          keyframes: [],
          color: baseColor,
          visible: true,
          locked: false
        });
      });

      // Scale tracks
      ['scale.x', 'scale.y', 'scale.z'].forEach((prop) => {
        newTracks.push({
          id: `${obj.id}_${prop}`,
          objectId: obj.id,
          objectName: obj.type,
          property: prop,
          keyframes: [],
          color: baseColor,
          visible: true,
          locked: false
        });
      });
    });
    setTracks(newTracks);
  }, [gameState.objects]);

  // Animation playback
  useEffect(() => {
    let animationFrame: number;
    
    if (isPlaying) {
      const animate = () => {
        setCurrentTime(prev => {
          const newTime = prev + (1/60) * playbackSpeed;
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          
          // Apply keyframe animations
          tracks.forEach(track => {
            const activeKeyframes = track.keyframes
              .filter(kf => kf.time <= newTime)
              .sort((a, b) => b.time - a.time);
            
            if (activeKeyframes.length > 0) {
              const keyframe = activeKeyframes[0];
              const nextKeyframe = track.keyframes.find(kf => kf.time > newTime);
              
              let value = keyframe.value;
              
              // Interpolate between keyframes
              if (nextKeyframe) {
                const progress = (newTime - keyframe.time) / (nextKeyframe.time - keyframe.time);
                const easedProgress = applyEasing(progress, keyframe.easing);
                value = interpolateValue(keyframe.value, nextKeyframe.value, easedProgress);
              }
              
              // Apply animation to object
              const obj = gameState.objects.find(o => o.id === track.objectId);
              if (obj) {
                const [category, axis] = track.property.split('.');
                const currentValue = obj[category as keyof typeof obj] as number[];
                const axisIndex = ['x', 'y', 'z'].indexOf(axis);
                
                if (currentValue && axisIndex !== -1) {
                  const newValue = [...currentValue];
                  newValue[axisIndex] = value;
                  
                  dispatch({
                    type: 'UPDATE_OBJECT',
                    payload: { id: obj.id, property: category, value: newValue }
                  });
                }
              }
            }
          });
          
          return newTime;
        });
        
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, playbackSpeed, tracks, gameState.objects, dispatch, duration]);

  const applyEasing = (t: number, easing: string): number => {
    switch (easing) {
      case 'ease-in': return t * t;
      case 'ease-out': return 1 - (1 - t) * (1 - t);
      case 'ease-in-out': return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case 'bounce': return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
      default: return t;
    }
  };

  const interpolateValue = (start: number, end: number, progress: number): number => {
    return start + (end - start) * progress;
  };

  const addKeyframe = (trackId: string, time: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const obj = gameState.objects.find(o => o.id === track.objectId);
    if (!obj) return;

    const [category, axis] = track.property.split('.');
    const currentValue = obj[category as keyof typeof obj] as number[];
    const axisIndex = ['x', 'y', 'z'].indexOf(axis);
    
    if (currentValue && axisIndex !== -1) {
      const newKeyframe: Keyframe = {
        id: `kf_${Date.now()}`,
        time,
        property: track.property,
        value: currentValue[axisIndex],
        easing: 'ease-in-out'
      };

      setTracks(prev => prev.map(t => 
        t.id === trackId 
          ? { ...t, keyframes: [...t.keyframes, newKeyframe].sort((a, b) => a.time - b.time) }
          : t
      ));
    }
  };

  const deleteKeyframe = (trackId: string, keyframeId: string) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId 
        ? { ...t, keyframes: t.keyframes.filter(kf => kf.id !== keyframeId) }
        : t
    ));
  };

  const timeToPixels = (time: number): number => {
    return (time / duration) * 800 * zoom;
  };

  const pixelsToTime = (pixels: number): number => {
    return (pixels / (800 * zoom)) * duration;
  };

  return (
    <div className="h-80 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 flex flex-col">
      {/* Timeline Controls */}
      <div className="h-12 bg-gray-800/80 border-b border-gray-700/50 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentTime(0)}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
          >
            <Square className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentTime(duration)}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-gray-600 mx-2" />

          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {currentTime.toFixed(2)}s / {duration}s
          </span>
          
          <div className="w-px h-6 bg-gray-600 mx-2" />
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>
          
          <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex">
        {/* Track Labels */}
        <div className="w-48 bg-gray-800/60 border-r border-gray-700/50 overflow-y-auto">
          <div className="p-2 border-b border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300">Animation Tracks</h4>
          </div>
          
          {tracks.map((track) => (
            <div key={track.id} className="h-8 border-b border-gray-700/30 flex items-center px-2">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: track.color }}
              />
              <span className="text-xs text-gray-400 truncate">
                {track.objectName}.{track.property}
              </span>
              <div className="ml-auto flex space-x-1">
                <button
                  onClick={() => setTracks(prev => prev.map(t => 
                    t.id === track.id ? { ...t, visible: !t.visible } : t
                  ))}
                  className={`w-3 h-3 rounded ${track.visible ? 'bg-green-500' : 'bg-gray-600'}`}
                />
                <button
                  onClick={() => setTracks(prev => prev.map(t => 
                    t.id === track.id ? { ...t, locked: !t.locked } : t
                  ))}
                  className={`w-3 h-3 rounded ${track.locked ? 'bg-red-500' : 'bg-gray-600'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="flex-1 relative overflow-auto" ref={timelineRef}>
          {/* Time Ruler */}
          <div className="h-8 bg-gray-700/50 border-b border-gray-600/50 relative">
            {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-gray-600/30"
                style={{ left: `${timeToPixels(i)}px` }}
              >
                <span className="absolute top-1 left-1 text-xs text-gray-400">
                  {i}s
                </span>
              </div>
            ))}
          </div>

          {/* Tracks */}
          {tracks.map((track, trackIndex) => (
            <div
              key={track.id}
              className="h-8 border-b border-gray-700/30 relative"
              style={{ backgroundColor: trackIndex % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent' }}
              onDoubleClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const time = pixelsToTime(clickX);
                addKeyframe(track.id, time);
              }}
            >
              {/* Keyframes */}
              {track.keyframes.map((keyframe) => (
                <motion.div
                  key={keyframe.id}
                  className="absolute top-1 w-6 h-6 rounded cursor-pointer"
                  style={{
                    left: `${timeToPixels(keyframe.time) - 12}px`,
                    backgroundColor: track.color,
                    border: selectedKeyframes.includes(keyframe.id) ? '2px solid white' : 'none'
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => {
                    setSelectedKeyframes(prev => 
                      prev.includes(keyframe.id)
                        ? prev.filter(id => id !== keyframe.id)
                        : [...prev, keyframe.id]
                    );
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    deleteKeyframe(track.id, keyframe.id);
                  }}
                />
              ))}

              {/* Keyframe connections */}
              {track.keyframes.length > 1 && (
                <svg className="absolute inset-0 pointer-events-none">
                  {track.keyframes.slice(0, -1).map((keyframe, index) => {
                    const nextKeyframe = track.keyframes[index + 1];
                    return (
                      <line
                        key={`${keyframe.id}-${nextKeyframe.id}`}
                        x1={timeToPixels(keyframe.time)}
                        y1={16}
                        x2={timeToPixels(nextKeyframe.time)}
                        y2={16}
                        stroke={track.color}
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    );
                  })}
                </svg>
              )}
            </div>
          ))}

          {/* Playhead */}
          <div
            ref={playheadRef}
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: `${timeToPixels(currentTime)}px` }}
          >
            <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rotate-45" />
          </div>
        </div>
      </div>

      {/* Keyframe Properties Panel */}
      {selectedKeyframes.length > 0 && (
        <div className="h-24 bg-gray-800/80 border-t border-gray-700/50 p-3">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Keyframe Properties</h5>
          <div className="flex space-x-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Easing</label>
              <select className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600">
                <option value="linear">Linear</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In-Out</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Value</label>
              <input
                type="number"
                step="0.1"
                className="w-20 bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
              />
            </div>
            <div className="flex items-end space-x-1">
              <button className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded">
                <Copy className="w-3 h-3" />
              </button>
              <button className="p-1 bg-red-500 hover:bg-red-600 text-white rounded">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;