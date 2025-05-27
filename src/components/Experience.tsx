'use client';
import { Box, OrbitControls, Sphere } from '@react-three/drei';
import { BallCollider, RigidBody } from '@react-three/rapier';

export default function Experience() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />
      <RigidBody position={[0, 5, 0]} colliders={false} gravityScale={4}>
        <BallCollider args={[1]} position={[0, 1, 0]} />
        <Sphere position-y={1}>
          <meshStandardMaterial color={'hotpink'} />
        </Sphere>
        <Box>
          <meshStandardMaterial color="royalblue" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" restitution={2}>
        <Box position={[0, 0, 0]} args={[10, 1, 10]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
}
