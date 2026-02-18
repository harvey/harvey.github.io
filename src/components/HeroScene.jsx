import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useRef } from 'react';

function Orb() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
    ref.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.45} floatIntensity={0.8}>
      <Icosahedron ref={ref} args={[1.25, 8]}>
        <MeshDistortMaterial
          color="#72ecff"
          emissive="#4cc4ff"
          emissiveIntensity={0.22}
          roughness={0.1}
          metalness={0.45}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.85}
        />
      </Icosahedron>
    </Float>
  );
}

export default function HeroScene({ reducedMotion = false }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#05070d']} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 2, 2]} intensity={1.6} color="#8bf4ff" />
      <Orb />
      <Stars radius={90} depth={40} count={reducedMotion ? 900 : 1800} factor={2.4} saturation={0.4} fade speed={0.25} />
      <Environment preset="city" />
      <EffectComposer>
        <Bloom intensity={0.45} luminanceThreshold={0.3} luminanceSmoothing={0.8} />
        <Vignette eskil={false} offset={0.1} darkness={0.58} />
        <Noise opacity={0.018} />
      </EffectComposer>
    </Canvas>
  );
}
