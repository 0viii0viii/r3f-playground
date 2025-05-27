'use client';
import { Physics } from '@react-three/rapier';

import { Canvas } from '@react-three/fiber';

import { Suspense } from 'react';
import Experience from './Experience';

export default function AppRapierPhysics() {
  return (
    <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
      <color attach="background" args={['#ececec']} />
      <Suspense>
        <Physics gravity={[0, -9.81, 0]}>
          <Experience />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
