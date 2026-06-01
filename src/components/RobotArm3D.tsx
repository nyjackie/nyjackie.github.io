import { useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

const SEGMENT_LENGTHS = [0.6, 1.0, 0.8, 0.5, 0.35, 0.25];
const SEGMENT_COLORS = ['#f4a261', '#2a9d8f', '#6c63ff', '#48bfe3', '#72c585', '#ffd166'];
const JOINT_RADIUS = [0.18, 0.16, 0.14, 0.12, 0.10, 0.09];
const SEGMENT_RADIUS = [0.13, 0.11, 0.09, 0.07, 0.06, 0.05];

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function RoundJoint({ color, radius }: { color: string; radius: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
    </mesh>
  );
}

function RoundSegment({ length, radius, color }: { length: number; radius: number; color: string }) {
  return (
    <mesh position={[0, length / 2, 0]}>
      <capsuleGeometry args={[radius, length - radius * 2, 8, 16]} />
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.55} />
    </mesh>
  );
}

function CuteGripper() {
  return (
    <group>
      {/* Wrist ball */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ffd166" metalness={0.1} roughness={0.5} />
      </mesh>
      {/* Left finger */}
      <group position={[-0.06, 0.1, 0]} rotation={[0, 0, 0.2]}>
        <mesh>
          <capsuleGeometry args={[0.025, 0.12, 6, 12]} />
          <meshStandardMaterial color="#ff9f9f" metalness={0.05} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ff7b7b" metalness={0.05} roughness={0.7} />
        </mesh>
      </group>
      {/* Right finger */}
      <group position={[0.06, 0.1, 0]} rotation={[0, 0, -0.2]}>
        <mesh>
          <capsuleGeometry args={[0.025, 0.12, 6, 12]} />
          <meshStandardMaterial color="#ff9f9f" metalness={0.05} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ff7b7b" metalness={0.05} roughness={0.7} />
        </mesh>
      </group>
      {/* Thumb */}
      <group position={[0, 0.08, 0.05]} rotation={[0.3, 0, 0]}>
        <mesh>
          <capsuleGeometry args={[0.022, 0.08, 6, 12]} />
          <meshStandardMaterial color="#ff9f9f" metalness={0.05} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial color="#ff7b7b" metalness={0.05} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

function ArmChain({ angles }: { angles: number[] }) {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame(() => {
    angles.forEach((angle, i) => {
      const g = groupRefs.current[i];
      if (!g) return;
      const rad = degToRad(angle * 0.5);
      if (i === 0) {
        g.rotation.y = rad;
      } else if (i % 2 === 1) {
        g.rotation.z = rad;
      } else {
        g.rotation.x = rad;
      }
    });
  });

  let content: ReactNode = <CuteGripper />;

  for (let i = 5; i >= 0; i--) {
    content = (
      <group ref={(el) => { groupRefs.current[i] = el; }}>
        <RoundJoint color={SEGMENT_COLORS[i]} radius={JOINT_RADIUS[i]} />
        <RoundSegment length={SEGMENT_LENGTHS[i]} radius={SEGMENT_RADIUS[i]} color={SEGMENT_COLORS[i]} />
        <group position={[0, SEGMENT_LENGTHS[i], 0]}>
          {content}
        </group>
      </group>
    );
  }

  return <group position={[0, 0, 0]}>{content}</group>;
}

function CuteBase() {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Main base dome */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.32, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e8c9a0" metalness={0.05} roughness={0.7} />
      </mesh>
      {/* Flat bottom */}
      <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 24]} />
        <meshStandardMaterial color="#d4ad78" metalness={0.05} roughness={0.7} />
      </mesh>
      {/* Little decorative ring */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.2, 0.025, 12, 32]} />
        <meshStandardMaterial color="#f4a261" metalness={0.15} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Scene({ angles }: { angles: number[] }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />
      <pointLight position={[0, 4, 3]} intensity={0.3} color="#ffe4c4" />
      <CuteBase />
      <ArmChain angles={angles} />
      <Grid
        args={[10, 10]}
        position={[0, -0.12, 0]}
        cellColor="#e0d5c5"
        sectionColor="#c8b8a0"
        fadeDistance={6}
        cellSize={0.5}
        sectionSize={2}
      />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        target={[0, 1.2, 0]}
      />
    </>
  );
}

export default function RobotArm3D({ angles }: { angles: number[] }) {
  return (
    <Canvas
      camera={{ position: [3.5, 2.5, 3.5], fov: 45 }}
      style={{ width: '100%', height: '100%', minHeight: 360 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene angles={angles} />
    </Canvas>
  );
}
