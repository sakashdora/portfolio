import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { OrbitalSystem } from './OrbitalSystem';
import { ParticleField } from './ParticleField';
import { Suspense } from 'react';

export const Scene = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        eventSource={document.body} 
        eventPrefix="client" 
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#F8FBFF']} />
        
        <ambientLight intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#FFFFFF" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#65B8FF" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <OrbitalSystem />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
};
