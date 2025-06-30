import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { saveAs } from 'file-saver';
import ObjectInspector from './ObjectInspector';
import ToolPanel from './ToolPanel';
import Timeline from './Timeline';
import GameScene from './GameScene';
import { useGameContext } from '../context/GameContext';

const GameEditor: React.FC = () => {
  const { gameState, dispatch } = useGameContext();
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameMode, setGameMode] = useState<'edit' | 'play'>('edit');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePlayTest = () => {
    setIsPlaying(!isPlaying);
    setGameMode(isPlaying ? 'edit' : 'play');
    
    if (!isPlaying) {
      dispatch({ type: 'START_GAME' });
      console.log('Starting game with objects:', gameState.objects);
    } else {
      dispatch({ type: 'STOP_GAME' });
      console.log('Stopping game');
    }
  };

  const handleSaveGame = () => {
    const gameData = {
      name: 'My Game',
      version: '1.0.0',
      created: new Date().toISOString(),
      objects: gameState.objects,
      settings: gameState.gameSettings,
      camera: gameState.cameraPosition
    };

    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: 'application/json' });
    saveAs(blob, 'my_game.json');
    console.log('Game saved successfully');
  };

  const handleExportGame = () => {
    const exportData = {
      ...gameState,
      metadata: {
        name: 'Exported Game',
        version: '1.0.0',
        platform: 'web',
        exported: new Date().toISOString()
      }
    };

    // Create HTML file for web export
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Game</title>
    <style>
        body { margin: 0; padding: 0; background: #000; overflow: hidden; }
        canvas { display: block; }
        #gameData { display: none; }
    </style>
</head>
<body>
    <div id="gameData">${JSON.stringify(exportData)}</div>
    <script>
        // Game runtime would be injected here
        console.log('Game loaded:', JSON.parse(document.getElementById('gameData').textContent));
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, 'exported_game.html');
    console.log('Game exported for web');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSaveGame();
            break;
          case 'e':
            e.preventDefault();
            handleExportGame();
            break;
          case ' ':
            e.preventDefault();
            handlePlayTest();
            break;
        }
      }
      
      // Delete selected object
      if (e.key === 'Delete' && selectedObject) {
        dispatch({ type: 'DELETE_OBJECT', payload: { id: selectedObject } });
        setSelectedObject(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedObject]);

  return (
    <div className="h-full flex">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Controls */}
        <div className="h-14 bg-gray-900/50 border-b border-gray-700/50 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 2D/3D Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setIs3DMode(false)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  !is3DMode ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                2D
              </button>
              <button
                onClick={() => setIs3DMode(true)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  is3DMode ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                3D
              </button>
            </div>

            {/* Grid Toggle */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                showGrid ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid
            </button>

            {/* Game Mode Indicator */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              gameMode === 'play' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {gameMode === 'play' ? 'PLAY MODE' : 'EDIT MODE'}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Save Button */}
            <motion.button
              onClick={handleSaveGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Save (Ctrl+S)
            </motion.button>

            {/* Export Button */}
            <motion.button
              onClick={handleExportGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              Export (Ctrl+E)
            </motion.button>

            {/* Play Test Button */}
            <motion.button
              onClick={handlePlayTest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? 'Stop (Space)' : 'Play Test (Space)'}
            </motion.button>
          </div>
        </div>

        {/* 3D/2D Viewport */}
        <div className="flex-1 relative bg-gray-950">
          {is3DMode ? (
            <Canvas
              ref={canvasRef}
              camera={{ position: [10, 10, 10], fov: 45 }}
              className="w-full h-full"
              shadows
            >
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              
              {showGrid && <Grid infiniteGrid fadeDistance={50} fadeStrength={0.5} />}
              
              <GameScene 
                objects={gameState.objects} 
                selectedObject={selectedObject}
                onSelectObject={setSelectedObject}
                isPlaying={isPlaying}
              />
              
              {!isPlaying && (
                <>
                  <OrbitControls enablePan enableZoom enableRotate />
                  <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport />
                  </GizmoHelper>
                </>
              )}
            </Canvas>
          ) : (
            <div className="w-full h-full bg-gray-900 relative">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ 
                  background: showGrid 
                    ? 'url("data:image/svg+xml,%3csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3cpattern id=\'grid\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'%3e%3cpath d=\'M 20 0 L 0 0 0 20\' fill=\'none\' stroke=\'%23333\' stroke-width=\'1\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\' /%3e%3c/svg%3e")' 
                    : '#111' 
                }}
              />
              {/* 2D game objects would be rendered here */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                2D Mode - Objects will render here
              </div>
            </div>
          )}

          {/* Game State Overlay */}
          {isPlaying && (
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
              <div className="text-green-400 font-medium flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Game Running</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Objects: {gameState.objects.length} | Mode: {is3DMode ? '3D' : '2D'}
              </div>
            </div>
          )}

          {/* Object Count */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-2">
            <div className="text-xs text-gray-400">
              Objects: {gameState.objects.length}
              {selectedObject && (
                <span className="text-blue-400 ml-2">
                  | Selected: {gameState.objects.find(o => o.id === selectedObject)?.type}
                </span>
              )}
            </div>
          </div>

          {/* Performance Monitor */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2">
            <div className="text-xs text-gray-400">
              FPS: 60 | Memory: 45MB
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Timeline />
      </div>

      {/* Tool Panel */}
      <ToolPanel onAddObject={(type) => {
        const newObject = {
          type, 
          position: [Math.random() * 4 - 2, 0, Math.random() * 4 - 2] as [number, number, number],
          id: `${type}_${Date.now()}`
        };
        
        dispatch({ 
          type: 'ADD_OBJECT', 
          payload: newObject
        });
        
        console.log('Added object:', newObject);
      }} />

      {/* Object Inspector */}
      {selectedObject && (
        <ObjectInspector 
          objectId={selectedObject}
          onClose={() => setSelectedObject(null)}
        />
      )}
    </div>
  );
};

export default GameEditor;