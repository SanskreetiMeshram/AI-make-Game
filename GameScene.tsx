import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Cone, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface GameObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  behaviors: string[];
  physics?: {
    velocity: [number, number, number];
    acceleration: [number, number, number];
    mass: number;
    friction: number;
  };
}

interface GameSceneProps {
  objects: GameObject[];
  selectedObject: string | null;
  onSelectObject: (id: string) => void;
  isPlaying: boolean;
}

const GameScene: React.FC<GameSceneProps> = ({ 
  objects, 
  selectedObject, 
  onSelectObject, 
  isPlaying 
}) => {
  const sceneRef = useRef<THREE.Group>(null);
  const [objectStates, setObjectStates] = useState<Map<string, any>>(new Map());

  // Initialize physics states
  useEffect(() => {
    const newStates = new Map();
    objects.forEach(obj => {
      if (!objectStates.has(obj.id)) {
        newStates.set(obj.id, {
          velocity: obj.physics?.velocity || [0, 0, 0],
          acceleration: obj.physics?.acceleration || [0, 0, 0],
          animationTime: 0,
          behaviorState: {},
          isGrounded: false,
          health: 100,
          energy: 100,
          mood: 'neutral'
        });
      } else {
        newStates.set(obj.id, objectStates.get(obj.id));
      }
    });
    setObjectStates(newStates);
  }, [objects]);

  useFrame((state, delta) => {
    if (isPlaying && sceneRef.current) {
      objects.forEach((obj, index) => {
        const mesh = sceneRef.current?.children[index] as THREE.Mesh | THREE.Group;
        if (!mesh) return;

        const objState = objectStates.get(obj.id) || {};
        const newState = { ...objState };
        newState.animationTime += delta;

        // Apply realistic behaviors
        obj.behaviors.forEach(behavior => {
          switch (behavior) {
            case 'rotate':
              mesh.rotation.y += delta;
              break;

            case 'bounce':
              const bounceHeight = Math.abs(Math.sin(newState.animationTime * 3)) * 2;
              mesh.position.y = obj.position[1] + bounceHeight;
              break;

            case 'float':
              mesh.position.y = obj.position[1] + Math.sin(newState.animationTime + index) * 0.5;
              break;

            case 'walk':
              // Realistic walking animation
              const walkSpeed = 2;
              mesh.position.x += Math.sin(newState.animationTime * walkSpeed) * 0.1;
              mesh.rotation.z = Math.sin(newState.animationTime * walkSpeed * 2) * 0.1;
              break;

            case 'run':
              // Fast running with head bob
              const runSpeed = 4;
              mesh.position.x += Math.sin(newState.animationTime * runSpeed) * 0.2;
              mesh.position.y = obj.position[1] + Math.abs(Math.sin(newState.animationTime * runSpeed * 2)) * 0.3;
              break;

            case 'jump':
              // Realistic jump physics
              if (newState.animationTime % 3 < 0.1) {
                newState.velocity[1] = 5;
              }
              newState.velocity[1] -= 9.81 * delta; // Gravity
              mesh.position.y = Math.max(obj.position[1], mesh.position.y + newState.velocity[1] * delta);
              if (mesh.position.y <= obj.position[1]) {
                newState.velocity[1] = 0;
                newState.isGrounded = true;
              }
              break;

            case 'fly':
              // Smooth flying motion
              mesh.position.y = obj.position[1] + Math.sin(newState.animationTime * 2) * 1;
              mesh.rotation.x = Math.sin(newState.animationTime) * 0.2;
              mesh.rotation.z = Math.cos(newState.animationTime * 1.5) * 0.1;
              break;

            case 'swim':
              // Swimming motion
              mesh.position.y = obj.position[1] + Math.sin(newState.animationTime * 3) * 0.3;
              mesh.rotation.x = Math.sin(newState.animationTime * 2) * 0.3;
              break;

            case 'eat':
              // Eating animation
              if (newState.animationTime % 2 < 0.3) {
                mesh.scale.setScalar(1.1);
                newState.energy = Math.min(100, newState.energy + delta * 10);
              } else {
                mesh.scale.setScalar(1);
              }
              break;

            case 'sleep':
              // Sleeping animation
              mesh.rotation.z = Math.PI / 6;
              mesh.scale.setScalar(0.9);
              newState.energy = Math.min(100, newState.energy + delta * 20);
              newState.mood = 'peaceful';
              break;

            case 'attack':
              // Attack animation
              const attackCycle = newState.animationTime % 1.5;
              if (attackCycle < 0.2) {
                mesh.scale.setScalar(1.3);
                mesh.rotation.y += delta * 10;
              } else if (attackCycle < 0.4) {
                mesh.scale.setScalar(1.1);
              } else {
                mesh.scale.setScalar(1);
              }
              break;

            case 'dance':
              // Dancing animation
              mesh.rotation.y = Math.sin(newState.animationTime * 4) * 0.5;
              mesh.position.y = obj.position[1] + Math.abs(Math.sin(newState.animationTime * 6)) * 0.5;
              mesh.rotation.x = Math.sin(newState.animationTime * 3) * 0.2;
              break;

            case 'patrol':
              // Patrolling behavior
              const patrolRange = 5;
              mesh.position.x = obj.position[0] + Math.sin(newState.animationTime * 0.5) * patrolRange;
              mesh.rotation.y = Math.sin(newState.animationTime * 0.5) > 0 ? 0 : Math.PI;
              break;

            case 'follow':
              // Follow player behavior
              const playerObj = objects.find(o => o.type === 'character');
              if (playerObj && obj.id !== playerObj.id) {
                const direction = new THREE.Vector3()
                  .subVectors(
                    new THREE.Vector3(...playerObj.position),
                    new THREE.Vector3(...obj.position)
                  )
                  .normalize();
                
                mesh.position.x += direction.x * delta * 2;
                mesh.position.z += direction.z * delta * 2;
                mesh.lookAt(new THREE.Vector3(...playerObj.position));
              }
              break;

            case 'grow':
              // Growing animation
              const growthFactor = 1 + Math.sin(newState.animationTime) * 0.2;
              mesh.scale.setScalar(growthFactor);
              break;

            case 'shrink':
              // Shrinking animation
              const shrinkFactor = 1 - Math.sin(newState.animationTime) * 0.2;
              mesh.scale.setScalar(Math.max(0.1, shrinkFactor));
              break;

            case 'pulse':
              // Pulsing animation
              const pulseFactor = 1 + Math.sin(newState.animationTime * 5) * 0.3;
              mesh.scale.setScalar(pulseFactor);
              break;

            case 'wave':
              // Wave motion
              mesh.position.y = obj.position[1] + Math.sin(newState.animationTime * 2 + obj.position[0]) * 0.5;
              break;

            case 'spiral':
              // Spiral motion
              const radius = 2;
              mesh.position.x = obj.position[0] + Math.cos(newState.animationTime) * radius;
              mesh.position.z = obj.position[2] + Math.sin(newState.animationTime) * radius;
              mesh.position.y = obj.position[1] + newState.animationTime * 0.5;
              break;

            case 'vibrate':
              // Vibration effect
              mesh.position.x = obj.position[0] + (Math.random() - 0.5) * 0.1;
              mesh.position.z = obj.position[2] + (Math.random() - 0.5) * 0.1;
              break;

            case 'breathe':
              // Breathing animation
              const breatheScale = 1 + Math.sin(newState.animationTime * 2) * 0.05;
              mesh.scale.setScalar(breatheScale);
              break;

            case 'idle':
              // Idle animation with subtle movements
              mesh.rotation.y += Math.sin(newState.animationTime * 0.5) * 0.01;
              mesh.position.y = obj.position[1] + Math.sin(newState.animationTime * 0.8) * 0.02;
              break;

            // Vehicle behaviors
            case 'drive':
              if (obj.type === 'vehicle') {
                mesh.position.x += delta * 3;
                mesh.rotation.z = Math.sin(newState.animationTime * 10) * 0.05; // Suspension
              }
              break;

            case 'brake':
              if (obj.type === 'vehicle') {
                newState.velocity[0] *= 0.95; // Deceleration
                mesh.rotation.x = -0.1; // Nose dive
              }
              break;

            case 'turn':
              if (obj.type === 'vehicle') {
                mesh.rotation.y += delta;
                mesh.rotation.z = Math.sin(newState.animationTime * 2) * 0.2; // Banking
              }
              break;

            // Nature behaviors
            case 'sway':
              if (obj.type === 'tree') {
                mesh.rotation.z = Math.sin(newState.animationTime * 1.5) * 0.1;
                mesh.rotation.x = Math.cos(newState.animationTime * 1.2) * 0.05;
              }
              break;

            case 'waterfall':
              if (obj.type === 'terrain') {
                // Create particle effect simulation
                mesh.position.y -= delta * 2;
                if (mesh.position.y < obj.position[1] - 5) {
                  mesh.position.y = obj.position[1] + 5;
                }
              }
              break;

            case 'wind':
              // Wind effect on objects
              const windStrength = Math.sin(newState.animationTime * 0.5) * 0.1;
              mesh.rotation.z = windStrength;
              mesh.position.x = obj.position[0] + windStrength * 0.5;
              break;
          }
        });

        // Update object state
        setObjectStates(prev => new Map(prev.set(obj.id, newState)));
      });
    }
  });

  const renderObject = (obj: GameObject) => {
    const isSelected = selectedObject === obj.id;
    const color = obj.color || '#ffffff';
    const scale = obj.scale || [1, 1, 1];
    const rotation = obj.rotation || [0, 0, 0];

    const commonProps = {
      position: obj.position,
      scale: scale,
      rotation: rotation,
      onClick: () => onSelectObject(obj.id),
    };

    const material = (
      <meshStandardMaterial 
        color={color} 
        wireframe={isSelected}
        emissive={isSelected ? '#00ff00' : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
        metalness={0.3}
        roughness={0.7}
      />
    );

    switch (obj.type) {
      case 'cube':
        return (
          <Box key={obj.id} {...commonProps}>
            {material}
          </Box>
        );
      
      case 'sphere':
        return (
          <Sphere key={obj.id} {...commonProps}>
            {material}
          </Sphere>
        );
      
      case 'cylinder':
        return (
          <Cylinder key={obj.id} {...commonProps}>
            {material}
          </Cylinder>
        );
      
      case 'cone':
        return (
          <Cone key={obj.id} {...commonProps}>
            {material}
          </Cone>
        );

      case 'terrain':
        return (
          <group key={obj.id} {...commonProps}>
            <Plane args={[10, 10, 32, 32]} rotation={[-Math.PI / 2, 0, 0]}>
              <meshStandardMaterial 
                color="#4a5d23" 
                wireframe={isSelected}
                displacementScale={0.5}
              />
            </Plane>
          </group>
        );

      case 'tree':
        return (
          <group key={obj.id} {...commonProps}>
            {/* Trunk */}
            <Cylinder position={[0, 1, 0]} args={[0.2, 0.3, 2]}>
              <meshStandardMaterial color="#8B4513" />
            </Cylinder>
            {/* Leaves */}
            <Sphere position={[0, 2.5, 0]} args={[1.5]}>
              <meshStandardMaterial color="#228B22" />
            </Sphere>
          </group>
        );

      case 'vehicle':
        return (
          <group key={obj.id} {...commonProps}>
            {/* Car body */}
            <Box position={[0, 0.5, 0]} args={[2, 0.8, 4]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Wheels */}
            <Cylinder position={[-0.8, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} args={[0.3, 0.2, 0.2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder position={[0.8, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} args={[0.3, 0.2, 0.2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder position={[-0.8, 0, -1.2]} rotation={[0, 0, Math.PI / 2]} args={[0.3, 0.2, 0.2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder position={[0.8, 0, -1.2]} rotation={[0, 0, Math.PI / 2]} args={[0.3, 0.2, 0.2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
          </group>
        );

      case 'character':
        return (
          <group key={obj.id} {...commonProps}>
            {/* Head */}
            <Sphere position={[0, 1.7, 0]} args={[0.3]}>
              <meshStandardMaterial color="#ffdbac" />
            </Sphere>
            {/* Body */}
            <Cylinder position={[0, 1, 0]} args={[0.25, 0.3, 0.8]}>
              <meshStandardMaterial color="#4169e1" />
            </Cylinder>
            {/* Arms */}
            <Cylinder position={[-0.4, 1.2, 0]} rotation={[0, 0, Math.PI / 6]} args={[0.08, 0.08, 0.6]}>
              <meshStandardMaterial color="#ffdbac" />
            </Cylinder>
            <Cylinder position={[0.4, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]} args={[0.08, 0.08, 0.6]}>
              <meshStandardMaterial color="#ffdbac" />
            </Cylinder>
            {/* Legs */}
            <Cylinder position={[-0.15, 0.4, 0]} args={[0.08, 0.08, 0.8]}>
              <meshStandardMaterial color="#000080" />
            </Cylinder>
            <Cylinder position={[0.15, 0.4, 0]} args={[0.08, 0.08, 0.8]}>
              <meshStandardMaterial color="#000080" />
            </Cylinder>
          </group>
        );

      case 'powerup':
        return (
          <group key={obj.id} {...commonProps}>
            <Sphere args={[0.5]}>
              <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={0.3}
              />
            </Sphere>
            {/* Rotating ring */}
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[0.7, 0.1, 8, 16]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );

      default:
        return (
          <Box key={obj.id} {...commonProps}>
            {material}
          </Box>
        );
    }
  };

  return (
    <group ref={sceneRef}>
      {objects.map(renderObject)}
      
      {/* Environment lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4169e1" />
      
      {/* Ground plane */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#2d5a27" />
      </Plane>
    </group>
  );
};

export default GameScene;