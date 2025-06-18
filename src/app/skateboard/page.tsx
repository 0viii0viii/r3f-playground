'use client';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
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
  const { scene, nodes, materials } = useGLTF('/McGraw.glb') as any;
  console.log(nodes);

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes['모자'].geometry}>
        <meshStandardMaterial color="#d32f2f" />
      </mesh>
      <mesh geometry={nodes['눈'].geometry}>
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh geometry={nodes['부리'].geometry}>
        <meshStandardMaterial color="#ff9800" />
      </mesh>
      <mesh geometry={nodes['바디'].geometry}>
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh geometry={nodes['배떄지'].geometry}>
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh geometry={nodes['발'].geometry}>
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
}

function Showcase({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1, 2.5, 1]} />
        <meshPhysicalMaterial
          color="#fff" // 재질의 기본 색상
          transmission={1} // 투명도 정도 (0-1)
          roughness={0} // 표면의 거칠기 정도 (0-1)
          thickness={1} // 재질의 두께
          ior={1.5} // 굴절률 (Index of Refraction)
          transparent={true} // 투명 여부
          opacity={0.3} // 불투명도 (0-1)
          metalness={0} // 금속성 정도 (0-1)
          reflectivity={0.1} // 반사도 (0-1)
          envMapIntensity={1} // 환경 맵 강도
          clearcoat={1} // 클리어코트 강도 (0-1)
          clearcoatRoughness={0} // 클리어코트 표면 거칠기 (0-1)
          attenuationColor="#fff" // 감쇠 색상
          attenuationDistance={0.5} // 감쇠 거리
        />
      </mesh>
      <McGrow scale={0.01} position={[0, 0, 0]} rotation={[Math.PI / 2, Math.PI, Math.PI]} />
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
        {/* 바닥 */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[WALL_SIZE, 1, WALL_SIZE]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* 벽 4개 */}
        <Wall position={[0, 0.5, -WALL_SIZE / 2]} args={[WALL_SIZE, 1, 0.2]} />
        <Wall position={[0, 0.5, WALL_SIZE / 2]} args={[WALL_SIZE, 1, 0.2]} />
        <Wall position={[-WALL_SIZE / 2, 0.5, 0]} args={[0.2, 1, WALL_SIZE]} />
        <Wall position={[WALL_SIZE / 2, 0.5, 0]} args={[0.2, 1, WALL_SIZE]} />
        {/* 장식장 2개 */}
        <Showcase position={[-2, 0.5, 2]} />
        <Showcase position={[2, 0.5, -2]} />
        {/* 플레이어 */}
        <Player position={playerPos} setPosition={setPlayerPos} />
      </Canvas>
    </div>
  );
}
