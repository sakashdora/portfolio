import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const OrbitalSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const spheresRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(0);
  const currentScale = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scrollY = window.scrollY || 0;
    const heroHeight = window.innerHeight || 800;
    
    // When hero is at top (scrollY < 60), targetFactor is 0 to keep portrait clean.
    // As hero section moves up (scrollY from 60 to heroHeight * 0.65), targetFactor ramps to 1.
    const startScroll = 60;
    const fullScroll = heroHeight * 0.65;
    const targetFactor = THREE.MathUtils.clamp((scrollY - startScroll) / (fullScroll - startScroll), 0, 1);
    
    // Smooth lerping for organic entrance/exit
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetFactor, 0.08);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetFactor, 0.08);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseScale = isMobile ? 0.58 : 1.0;
    const factor = currentScale.current * baseScale;

    if (groupRef.current) {
      groupRef.current.scale.set(factor, factor, factor);
      groupRef.current.visible = factor > 0.01;

      const targetY = isMobile ? -0.3 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);

      if (isMobile) {
        // Gentle autonomous oscillation on touch devices
        groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1 + 0.2;
        groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
      } else {
        // Mouse parallax on desktop
        const mouseX = (state.pointer.x * Math.PI) / 8;
        const mouseY = (state.pointer.y * Math.PI) / 8;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY + 0.2, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
      }
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(t * 0.1) * 0.2 + 0.5;
      ringsRef.current.rotation.y = t * 0.05 + (scrollY * 0.001);
      
      ringsRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'opacity' in mesh.material) {
          (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.35 * currentOpacity.current;
        }
      });
    }
    
    if (spheresRef.current) {
      spheresRef.current.rotation.y = t * 0.12 + (scrollY * 0.002);
      spheresRef.current.position.y = Math.sin(t * 0.5) * 0.2;
      
      spheresRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'opacity' in mesh.material) {
          (mesh.material as THREE.MeshPhysicalMaterial).opacity = 0.85 * currentOpacity.current;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Planetary Rings */}
      <group ref={ringsRef}>
        {[2.5, 3.5, 4.5].map((radius, i) => (
          <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, (Math.PI / 3) * i]}>
            <torusGeometry args={[radius, 0.012, 16, 100]} />
            <meshPhysicalMaterial 
              color={i === 0 ? "#1677FF" : "#65B8FF"}
              transparent
              opacity={0}
              roughness={0.1}
              metalness={0.8}
              clearcoat={1}
            />
          </mesh>
        ))}
      </group>

      {/* Planetary Spheres */}
      <group ref={spheresRef}>
        {[
          { pos: [2, 1, 1], size: 0.35, color: '#1677FF' },
          { pos: [-2.5, -1, 0.5], size: 0.45, color: '#2F8CFF' },
          { pos: [1.5, -2, -1], size: 0.25, color: '#65B8FF' },
          { pos: [-1.5, 2, -0.5], size: 0.3, color: '#10254D' },
        ].map((sphere, i) => (
          <mesh key={`sphere-${i}`} position={new THREE.Vector3(...sphere.pos)}>
            <sphereGeometry args={[sphere.size, 32, 32]} />
            <meshPhysicalMaterial 
              color={sphere.color}
              transparent
              opacity={0}
              roughness={0.1}
              metalness={0.1}
              transmission={0.5}
              thickness={0.5}
              clearcoat={1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
