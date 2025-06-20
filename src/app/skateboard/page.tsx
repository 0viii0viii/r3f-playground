'use client';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WALL_SIZE = 10;
const PLAYER_SIZE = 0.5;
const SPEED = 0.2;

function Player({
  position,
  setPosition,
}: {
  position: [number, number, number];
  setPosition: React.Dispatch<React.SetStateAction<[number, number, number]>>;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPosition(pos => {
        let [x, y, z] = pos;
        if (e.key === 'ArrowUp' && z > -WALL_SIZE / 2 + PLAYER_SIZE) z -= SPEED;
        if (e.key === 'ArrowDown' && z < WALL_SIZE / 2 - PLAYER_SIZE) z += SPEED;
        if (e.key === 'ArrowLeft' && x > -WALL_SIZE / 2 + PLAYER_SIZE) x -= SPEED;
        if (e.key === 'ArrowRight' && x < WALL_SIZE / 2 - PLAYER_SIZE) x += SPEED;
        return [x, y, z];
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPosition]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(...position);
    }
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[PLAYER_SIZE, 0.2, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function Wall({
  position,
  args,
}: {
  position: [number, number, number];
  args: [number, number, number];
}) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

function McGrow(props: any) {
  const { scene, nodes, materials } = useGLTF('/Mcgraw2.glb') as any;
  console.log(nodes);

  return (
    <RigidBody type="dynamic" colliders="cuboid" restitution={1} friction={1}>
      <group {...props} dispose={null}>
        <mesh geometry={nodes['모자'].geometry}>
          <meshStandardMaterial color="#d32f2f" />
        </mesh>
        <mesh geometry={nodes['눈'].geometry} position={[2, -8, 76]}>
          <meshPhysicalMaterial
            color="#000"
            metalness={1}
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            reflectivity={1}
            sheen={1}
            sheenColor="#000"
          />
        </mesh>
        <mesh geometry={nodes['부리'].geometry}>
          <meshStandardMaterial color="#ff9800" />
        </mesh>
        <mesh geometry={nodes['바디'].geometry}>
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh geometry={nodes['배떄지'].geometry} position={[0, -1, 0]}>
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh geometry={nodes['발'].geometry} position={[0, 0, -60]}>
          <meshStandardMaterial color="#F2CBCB" />
        </mesh>
      </group>
    </RigidBody>
  );
}

function Showcase({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow>
          <boxGeometry args={[1, 1.5, 1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </RigidBody>
      <McGrow scale={0.01} position={[0, 1.8, 0]} rotation={[Math.PI / 2, Math.PI, Math.PI]} />
    </group>
  );
}

export default function SkateboardPage() {
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0.2, 0]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} castShadow />
        <OrbitControls />
        <Physics gravity={[0, -9.81, 0]}>
          {/* 바닥 */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, -0.5, 0]} receiveShadow>
              <boxGeometry args={[WALL_SIZE, 1, WALL_SIZE]} />
              <meshStandardMaterial color="#fff" />
            </mesh>
          </RigidBody>
          {/* 벽 4개 */}
          <RigidBody type="fixed" colliders="cuboid">
            <Wall position={[0, 0.5, -WALL_SIZE / 2]} args={[WALL_SIZE, 1, 0.2]} />
            <Wall position={[0, 0.5, WALL_SIZE / 2]} args={[WALL_SIZE, 1, 0.2]} />
            <Wall position={[-WALL_SIZE / 2, 0.5, 0]} args={[0.2, 1, WALL_SIZE]} />
            <Wall position={[WALL_SIZE / 2, 0.5, 0]} args={[0.2, 1, WALL_SIZE]} />
          </RigidBody>
          {/* 장식장 2개 */}
          <Showcase position={[-2, 0.5, 2]} />
          <Showcase position={[2, 0.5, -2]} />
          {/* 플레이어 */}
          <Player position={playerPos} setPosition={setPlayerPos} />
        </Physics>
      </Canvas>
    </div>
  );
}
