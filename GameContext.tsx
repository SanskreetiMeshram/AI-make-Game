import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface GameObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  behaviors: string[];
}

interface GameState {
  objects: GameObject[];
  isPlaying: boolean;
  selectedObject: string | null;
  cameraPosition: [number, number, number];
  gameSettings: {
    gravity: number;
    physics: boolean;
  };
}

type GameAction = 
  | { type: 'ADD_OBJECT'; payload: { type: string; position: [number, number, number]; id: string } }
  | { type: 'UPDATE_OBJECT'; payload: { id: string; property: string; value: any } }
  | { type: 'DELETE_OBJECT'; payload: { id: string } }
  | { type: 'SELECT_OBJECT'; payload: { id: string | null } }
  | { type: 'START_GAME' }
  | { type: 'STOP_GAME' }
  | { type: 'UPDATE_CAMERA'; payload: [number, number, number] };

const initialState: GameState = {
  objects: [],
  isPlaying: false,
  selectedObject: null,
  cameraPosition: [10, 10, 10],
  gameSettings: {
    gravity: -9.81,
    physics: true
  }
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_OBJECT':
      return {
        ...state,
        objects: [
          ...state.objects,
          {
            id: action.payload.id,
            type: action.payload.type,
            position: action.payload.position,
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: '#ffffff',
            behaviors: []
          }
        ]
      };

    case 'UPDATE_OBJECT':
      return {
        ...state,
        objects: state.objects.map(obj =>
          obj.id === action.payload.id
            ? { ...obj, [action.payload.property]: action.payload.value }
            : obj
        )
      };

    case 'DELETE_OBJECT':
      return {
        ...state,
        objects: state.objects.filter(obj => obj.id !== action.payload.id),
        selectedObject: state.selectedObject === action.payload.id ? null : state.selectedObject
      };

    case 'SELECT_OBJECT':
      return {
        ...state,
        selectedObject: action.payload.id
      };

    case 'START_GAME':
      return {
        ...state,
        isPlaying: true
      };

    case 'STOP_GAME':
      return {
        ...state,
        isPlaying: false
      };

    case 'UPDATE_CAMERA':
      return {
        ...state,
        cameraPosition: action.payload
      };

    default:
      return state;
  }
}

const GameContext = createContext<{
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};