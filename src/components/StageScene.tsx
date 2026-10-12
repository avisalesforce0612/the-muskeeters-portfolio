import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';

function Stage({ progress }: { progress: MotionValue<number> }) {
  const beams = useRef<Array<THREE.Mesh | null>>([]);
  const movingGroup = useRef<THREE.Group>(null);
  const guitar = useRef<THREE.Group>(null);
  const strummingArm = useRef<THREE.Group>(null);
  const cajonArms = useRef<Array<THREE.Group | null>>([]);
  const guitarStrings = useRef<Array<THREE.Mesh | null>>([]);
  const { camera } = useThree();

  useFrame((state, delta) => {
    const journey = progress.get();
    const elapsed = state.clock.elapsedTime;
    const sweep = Math.sin(elapsed * 0.38);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, -4.4 + journey * 8.8, 2.1, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.55 + Math.sin(journey * Math.PI) * 0.48, 2.1, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 8.5 - Math.sin(journey * Math.PI) * 1.1, 2.1, delta);
    camera.lookAt(-2.9 + journey * 5.8, -0.35, -0.5);
    beams.current.forEach((beam, index) => {
      if (beam) beam.rotation.z = (index - 1) * 0.055 + sweep * 0.035;
    });
    if (movingGroup.current) {
      movingGroup.current.position.y = Math.sin(elapsed * 0.55) * 0.025;
    }
    if (guitar.current) guitar.current.rotation.z = Math.sin(elapsed * 1.1) * 0.018;
    if (strummingArm.current) strummingArm.current.rotation.z = -0.18 + Math.sin(elapsed * 8.4) * 0.32;
    cajonArms.current.forEach((arm, index) => {
      if (arm) arm.rotation.z = Math.sin(elapsed * 5.2 + index * Math.PI) * 0.28;
    });
    guitarStrings.current.forEach((string, index) => {
      if (string) string.position.y = (index - 2.5) * 0.027 + Math.sin(elapsed * 25 + index) * 0.003;
    });
  });

  return (
    <>
      <color attach="background" args={['#171a12']} />
      <fog attach="fog" args={['#171a12', 9, 22]} />
      <ambientLight intensity={0.82} />
      <pointLight position={[-4, 3.3, 1]} color="#e9b45d" intensity={24} distance={13} />
      <pointLight position={[0, 3.6, -1]} color="#b99a57" intensity={17} distance={14} />
      <pointLight position={[4, 3.2, 1]} color="#9aa06a" intensity={20} distance={13} />
      <group ref={movingGroup}>
        <mesh position={[0, -2.02, -1]} receiveShadow>
          <boxGeometry args={[13, 0.34, 4.6]} />
          <meshStandardMaterial color="#27271c" roughness={0.86} metalness={0.12} />
        </mesh>
        <mesh position={[0, -1.82, -0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[13, 4.2]} />
          <meshStandardMaterial color="#423d2a" roughness={0.72} metalness={0.14} />
        </mesh>
        <mesh position={[0, -1.835, -0.85]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.86, 0.88, 80]} />
          <meshBasicMaterial color="#d4a653" transparent opacity={0.62} />
        </mesh>
        <mesh position={[0, -1.831, -0.85]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.24, 1.26, 80]} />
          <meshBasicMaterial color="#86905d" transparent opacity={0.34} />
        </mesh>
        {[-1, 0, 1].map((spot, index) => (
          <group key={spot}>
            <mesh position={[spot * 3.7, 3.35, -1.4]}>
              <sphereGeometry args={[0.1, 16, 12]} />
              <meshBasicMaterial color={index === 1 ? '#fff1bd' : '#e7b55c'} />
            </mesh>
            <mesh
              ref={(node) => { beams.current[index] = node; }}
              position={[spot * 3.7, 1.2, -1.35]}
            >
              <coneGeometry args={[1.08, 4.5, 32, 1, true]} />
              <meshBasicMaterial
                color={index === 1 ? '#dec57c' : '#c4a558'}
                transparent
                opacity={0.075}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
        {[-4.7, 4.7].map((position) => (
          <group key={position} position={[position, -1.17, -1.8]}>
            <mesh>
              <boxGeometry args={[0.9, 1.28, 0.75]} />
              <meshStandardMaterial color="#25251d" roughness={0.74} metalness={0.24} />
            </mesh>
            <mesh position={[0, 0.12, 0.39]}>
              <circleGeometry args={[0.24, 28]} />
              <meshStandardMaterial color="#151710" emissive="#71673b" emissiveIntensity={0.22} />
            </mesh>
            <mesh position={[0, 0.12, 0.405]}>
              <ringGeometry args={[0.25, 0.27, 28]} />
              <meshBasicMaterial color="#a99456" />
            </mesh>
          </group>
        ))}
        <group ref={guitar} position={[-3.05, -1.3, 0.45]}>
          <mesh position={[-0.34, 0, 0]}>
            <sphereGeometry args={[0.57, 32, 24]} />
            <meshStandardMaterial color="#9a6238" roughness={0.42} />
          </mesh>
          <mesh position={[0.04, 0.02, 0]}>
            <sphereGeometry args={[0.45, 32, 24]} />
            <meshStandardMaterial color="#b77b43" roughness={0.4} />
          </mesh>
          <mesh position={[-0.14, 0.38, 0.01]}>
            <sphereGeometry args={[0.29, 24, 18]} />
            <meshStandardMaterial color="#a66c3e" roughness={0.44} />
          </mesh>
          <mesh position={[0.87, 0.28, 0]}>
            <boxGeometry args={[1.63, 0.17, 0.13]} />
            <meshStandardMaterial color="#6b472c" roughness={0.4} />
          </mesh>
          <mesh position={[0.9, 0.28, 0.075]}>
            <boxGeometry args={[1.61, 0.115, 0.025]} />
            <meshStandardMaterial color="#33291e" roughness={0.52} />
          </mesh>
          <mesh position={[1.75, 0.32, 0]}>
            <boxGeometry args={[0.3, 0.26, 0.16]} />
            <meshStandardMaterial color="#76502f" roughness={0.42} />
          </mesh>
          <mesh position={[0.09, 0.03, 0.465]}>
            <circleGeometry args={[0.17, 28]} />
            <meshBasicMaterial color="#271d16" />
          </mesh>
          <mesh position={[0.09, 0.03, 0.47]}>
            <ringGeometry args={[0.18, 0.205, 28]} />
            <meshBasicMaterial color="#d3a65b" />
          </mesh>
          {Array.from({ length: 6 }, (_, index) => (
            <mesh
              key={`string-${index}`}
              ref={(node) => { guitarStrings.current[index] = node; }}
              position={[0.65, (index - 2.5) * 0.027, 0.1]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.004, 0.004, 2.03, 5]} />
              <meshStandardMaterial color="#e7d8b2" metalness={0.74} roughness={0.24} />
            </mesh>
          ))}
          {Array.from({ length: 9 }, (_, index) => (
            <mesh key={`fret-${index}`} position={[0.38 + index * 0.145, 0.28, 0.105]}>
              <boxGeometry args={[0.012, 0.13, 0.014]} />
              <meshBasicMaterial color="#c3a870" />
            </mesh>
          ))}
          <group ref={strummingArm} position={[-0.33, 0.66, 0.37]}>
            <mesh position={[0.05, -0.2, 0]} rotation={[0, 0, -0.35]}>
              <boxGeometry args={[0.2, 0.55, 0.2]} />
              <meshStandardMaterial color="#4b5033" roughness={0.76} />
            </mesh>
            <mesh position={[0.19, -0.52, 0.03]} rotation={[0, 0, 0.42]}>
              <boxGeometry args={[0.15, 0.47, 0.15]} />
              <meshStandardMaterial color="#d2a579" roughness={0.68} />
            </mesh>
            <mesh position={[0.29, -0.76, 0.06]}>
              <sphereGeometry args={[0.105, 16, 12]} />
              <meshStandardMaterial color="#deb58c" roughness={0.66} />
            </mesh>
            <mesh position={[0.29, -0.88, 0.11]} rotation={[0, 0, 0.18]}>
              <coneGeometry args={[0.045, 0.14, 4]} />
              <meshStandardMaterial color="#f0d08a" roughness={0.4} />
            </mesh>
          </group>
        </group>
        <group position={[3.1, -1.32, 0.28]}>
          <mesh>
            <boxGeometry args={[0.96, 1.22, 0.58]} />
            <meshStandardMaterial color="#895634" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.3]}>
            <boxGeometry args={[0.86, 1.12, 0.025]} />
            <meshStandardMaterial color="#bd8a50" roughness={0.53} />
          </mesh>
          <mesh position={[0, -0.13, 0.32]}>
            <ringGeometry args={[0.12, 0.145, 28]} />
            <meshBasicMaterial color="#473824" />
          </mesh>
          {[-1, 1].map((side, index) => (
            <group
              key={`cajon-arm-${side}`}
              ref={(node) => { cajonArms.current[index] = node; }}
              position={[side * 0.29, 0.7, 0.48]}
            >
              <mesh position={[side * -0.05, -0.22, 0]}>
                <boxGeometry args={[0.12, 0.48, 0.13]} />
                <meshStandardMaterial color={index === 0 ? '#495039' : '#7c5035'} roughness={0.7} />
              </mesh>
              <mesh position={[side * -0.1, -0.49, 0.035]}>
                <sphereGeometry args={[0.09, 14, 12]} />
                <meshStandardMaterial color="#dab38a" roughness={0.66} />
              </mesh>
            </group>
          ))}
        </group>
        <group position={[0.15, -0.1, 0.25]}>
          <mesh position={[0, -0.86, 0]}>
            <cylinderGeometry args={[0.018, 0.026, 1.75, 8]} />
            <meshStandardMaterial color="#99875d" metalness={0.72} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.085, 12, 10]} />
            <meshStandardMaterial color="#c6a661" metalness={0.48} roughness={0.4} />
          </mesh>
          <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.29, 24]} />
            <meshStandardMaterial color="#756848" metalness={0.46} roughness={0.42} />
          </mesh>
        </group>
      </group>
      <Sparkles count={52} scale={[11, 5, 5]} size={1.6} speed={0.14} color="#efc56e" opacity={0.56} />
    </>
  );
}

export default function StageScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="stage-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [-4.4, 1.55, 8.5], fov: 43 }}
        dpr={[1, 1.15]}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        fallback={<div className="stage-fallback" />}
      >
        <Stage progress={progress} />
      </Canvas>
    </div>
  );
}
