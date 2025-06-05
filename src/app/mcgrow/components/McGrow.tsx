'use client';

import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';

export default function Scene() {
  const [degraded, degrade] = useState(false);
  return (
    <Canvas shadows camera={{ position: [0, -30, 0], fov: 60 }}>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
      />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        castShadow
        intensity={2}
        shadow-bias={-0.0001}
      />
      <McGrow scale={0.1} position={[0, 0, 0]} rotation={[0, 0, Math.PI]} />
    </Canvas>
  );
}

function McGrow(props: any) {
  const { scene, nodes, materials } = useGLTF('/mcgrow2.glb') as any;
  console.log(materials);

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sphere001.geometry}>
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh geometry={nodes['모자001'].geometry}>
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      <mesh geometry={nodes['바디002'].geometry}>
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh geometry={nodes['발'].geometry}>
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh geometry={nodes['배떄지'].geometry}>
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
}
