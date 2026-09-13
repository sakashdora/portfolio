import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Trail, Stars } from '@react-three/drei';
import * as THREE from 'three';

const OrbitRing = ({ radius, speed, rotationX, rotationY, color }: { radius: number, speed: number, rotationX: number, rotationY: number, color: string }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z -= speed * 0.5;
    }
    if (orbRef.current) {
      const t = state.clock.getElapsedTime() * speed;
      orbRef.current.position.x = Math.cos(t) * radius;
      orbRef.current.position.y = Math.sin(t) * radius;
    }
  });

  return (
    <group rotation={[rotationX, rotationY, 0]}>
      {/* The Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      
      {/* The Orb on the ring */}
      <Trail
        width={0.5}
        length={4}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        <mesh ref={orbRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Trail>
    </group>
  );
};

export const OrbitalSystem = ({ config }: { config?: { speed: number, scale: number, particles: number, offsetX?: number, offsetY?: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const speedMult = config?.speed ?? 1;
  const scaleMult = config?.scale ?? 1;
  const particles = config?.particles ?? 300;
  const offsetX = config?.offsetX ?? 0;
  const offsetY = config?.offsetY ?? 0;

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Very subtle mouse parallax for the whole system
    const targetX = (state.pointer.x * 0.2);
    const targetY = (state.pointer.y * 0.2);
    
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    
    // Slow continuous ambient rotation
    groupRef.current.rotation.z += 0.001 * speedMult;
  });

  return (
    <group ref={groupRef} scale={[scaleMult, scaleMult, scaleMult]} position={[offsetX, offsetY, 0]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#1677FF" />
      
      <Float speed={2 * speedMult} rotationIntensity={0.1} floatIntensity={0.2}>
        <OrbitRing radius={2.5} speed={0.4 * speedMult} rotationX={Math.PI / 3} rotationY={0} color="#1677FF" />
        <OrbitRing radius={3.2} speed={-0.3 * speedMult} rotationX={Math.PI / 4} rotationY={Math.PI / 4} color="#6ED7FF" />
        <OrbitRing radius={4} speed={0.2 * speedMult} rotationX={Math.PI / 2.5} rotationY={-Math.PI / 6} color="#1677FF" />
      </Float>

      {/* Floating background particles */}
      <Stars radius={10} depth={20} count={particles} factor={2} saturation={0} fade speed={1 * speedMult} />
      
      {/* Inner glow effect around the portrait */}
      <mesh position={[0, 0, -1]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#1677FF" transparent opacity={0.05} />
      </mesh>
    </group>
  );
};
