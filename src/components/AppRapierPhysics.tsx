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
        <Physics debug>
          <Experience />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
