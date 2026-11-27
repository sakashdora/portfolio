import { Canvas } from '@react-three/fiber';
import { OrbitalSystem } from './OrbitalSystem';
import { ParticleField } from './ParticleField';

type OrbitConfig = { speed: number; scale: number; particles: number; offsetX?: number; offsetY?: number };

// Orbit rings + particles behind the hero portrait. Lives only inside the hero,
// so it scrolls away with it instead of following the page.
export default function HeroOrbit({ config, active = true }: { config: OrbitConfig; active?: boolean }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <OrbitalSystem config={config} />
      <ParticleField />
    </Canvas>
  );
}
