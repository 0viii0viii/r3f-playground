'use client';
import { OrbitControls } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

export default function Experience() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />
      <InvertedSphereCollider />
      {Array.from({ length: 45 }).map((_, i) => (
        <SmallBall key={i} position={randomPointInSphere(3)} index={i} />
      ))}
    </>
  );
}

function InvertedSphereCollider() {
  const geometry = useMemo(() => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(6, 5.1, 5.5));
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(2.6, 30, 30));

    // Make sure the .matrix of each mesh is current
    box.updateMatrix();
    sphere.updateMatrix();

    // perform operations on the meshes
    const subRes = CSG.subtract(box, sphere);

    return subRes.geometry;
  }, []);

  return (
    <RigidBody type="fixed" colliders="trimesh" restitution={1}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="yellow" side={THREE.BackSide} transparent opacity={0.1} />
      </mesh>
    </RigidBody>
  );
}

function SmallBall({ position, index }: { position: [number, number, number]; index: number }) {
  const color = useMemo(() => {
    const indexPlusOne = index + 1;
    if (indexPlusOne <= 10) return 'yellow';
    if (indexPlusOne <= 20) return 'blue';
    if (indexPlusOne <= 30) return 'red';
    if (indexPlusOne <= 40) return 'black';
    return 'green';
  }, [index]);

  return (
    <RigidBody
      colliders="ball"
      restitution={0.9}
      friction={0.2}
      position={position}
      linearDamping={0.5}
      angularDamping={0.5}
      canSleep={true}
      ccd={true}
      mass={1}
      type="dynamic"
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={1} />
      </mesh>
    </RigidBody>
  );
}

function randomPointInSphere(radius: number): [number, number, number] {
  let x, y, z;
  do {
    x = (Math.random() * 2 - 1) * (radius * 0.8); // 반지름을 80%로 줄임
    y = (Math.random() * 2 - 1) * (radius * 0.8);
    z = (Math.random() * 2 - 1) * (radius * 0.8);
  } while (x * x + y * y + z * z > radius * 0.8 * (radius * 0.8));
  return [x, y, z];
}
