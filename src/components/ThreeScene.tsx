import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import type { Mesh } from 'three';

/* ========================================
   ROTATING WIREFRAME MESH
   ======================================== */

interface ShapeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  floatSpeed?: number;
  children: React.ReactNode;
}

const FloatingShape = ({ position, color, speed = 0.5, floatSpeed = 2, children }: ShapeProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        {children}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
      </mesh>
    </Float>
  );
};

/* ========================================
   HERO 3D SCENE
   ======================================== */

const HeroScene = () => {
  return (
    <div className="absolute inset-0 three-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Orange icosahedron — top right */}
        <FloatingShape position={[4, 2.5, -1]} color="#f97316" speed={0.4} floatSpeed={1.5}>
          <icosahedronGeometry args={[1.2, 0]} />
        </FloatingShape>

        {/* Blue torus — bottom left */}
        <FloatingShape position={[-4.5, -1.5, -2]} color="#3b82f6" speed={0.3} floatSpeed={2}>
          <torusGeometry args={[1, 0.35, 16, 32]} />
        </FloatingShape>

        {/* Green octahedron — mid left */}
        <FloatingShape position={[-2, 2, 1]} color="#22c55e" speed={0.6} floatSpeed={1.8}>
          <octahedronGeometry args={[0.8, 0]} />
        </FloatingShape>

        {/* Blue box — right side */}
        <FloatingShape position={[5, -2, -3]} color="#3b82f6" speed={0.35} floatSpeed={2.2}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
        </FloatingShape>

        {/* Small orange dodecahedron — far left */}
        <FloatingShape position={[-5.5, 0.5, -2]} color="#f97316" speed={0.5} floatSpeed={1.5}>
          <dodecahedronGeometry args={[0.6, 0]} />
        </FloatingShape>
      </Canvas>
    </div>
  );
};

/* ========================================
   PROJECT CARD 3D SHAPE
   ======================================== */

interface ProjectShapeProps {
  shape: 'torusKnot' | 'icosahedron' | 'octahedron' | 'dodecahedron' | 'torus';
  color: string;
}

const RotatingProjectMesh = ({ color, children }: { color: string; children: React.ReactNode }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {children}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
    </Float>
  );
};

const ProjectShape = ({ shape, color }: ProjectShapeProps) => {
  return (
    <div className="w-full h-full three-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <RotatingProjectMesh color={color}>
          {shape === 'torusKnot' && <torusKnotGeometry args={[0.7, 0.22, 64, 12]} />}
          {shape === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
          {shape === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
          {shape === 'dodecahedron' && <dodecahedronGeometry args={[0.9, 0]} />}
          {shape === 'torus' && <torusGeometry args={[0.8, 0.3, 16, 32]} />}
        </RotatingProjectMesh>
      </Canvas>
    </div>
  );
};

export { HeroScene, ProjectShape };
