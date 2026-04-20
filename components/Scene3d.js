"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  MeshReflectorMaterial,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Smooth step easing ───────────────────────────────────────────────────────
function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

// ─── Camera path waypoints (5 stages: exterior → approach → door → interior → menu) ──
const CAM_POSITIONS = [
  new THREE.Vector3(0, 4.0, 24),    // Stage 0: Exterior wide
  new THREE.Vector3(0, 3.2, 13),    // Stage 1: Approach
  new THREE.Vector3(0, 2.2, 3.5),   // Stage 2: At entrance door
  new THREE.Vector3(0, 2.0, -3),    // Stage 3: Just inside
  new THREE.Vector3(0, 2.8, -13),   // Stage 4: Interior overview
  new THREE.Vector3(1, 1.8, -21),   // Stage 5: Menu table focus
];
const CAM_TARGETS = [
  new THREE.Vector3(0, 2.2, 0),
  new THREE.Vector3(0, 2.0, 0),
  new THREE.Vector3(0, 1.8, -4),
  new THREE.Vector3(0, 1.6, -12),
  new THREE.Vector3(0, 1.4, -22),
  new THREE.Vector3(1, 1.0, -26),
];

function getPathValue(arr, t) {
  const n = arr.length - 1;
  const scaled = Math.min(Math.max(t, 0), 0.9999) * n;
  const i = Math.floor(scaled);
  const f = smoothstep(scaled - i);
  return new THREE.Vector3().lerpVectors(arr[i], arr[i + 1], f);
}

// ─── Camera Controller (reads refs, no re-renders) ────────────────────────────
export function CameraController({ scrollProgress, mouseX, mouseY }) {
  const { camera } = useThree();
  const pos = useRef(CAM_POSITIONS[0].clone());
  const tgt = useRef(CAM_TARGETS[0].clone());

  useFrame(() => {
    const t = scrollProgress.current ?? 0;
    const mx = (mouseX.current ?? 0) * 0.5;
    const my = (mouseY.current ?? 0) * 0.25;

    const wantPos = getPathValue(CAM_POSITIONS, t);
    const wantTgt = getPathValue(CAM_TARGETS, t);
    wantPos.x += mx;
    wantPos.y += my;

    pos.current.lerp(wantPos, 0.04);
    tgt.current.lerp(wantTgt, 0.04);

    camera.position.copy(pos.current);
    camera.lookAt(tgt.current);
    camera.updateProjectionMatrix();
  });

  return null;
}

// ─── Building Exterior ────────────────────────────────────────────────────────
function Building() {
  const finCount = 9;
  return (
    <group>
      {/* Main facade body */}
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[13, 9, 1.6]} />
        <meshStandardMaterial color="#18130d" roughness={0.65} metalness={0.25} />
      </mesh>

      {/* Vertical architectural fins */}
      {Array.from({ length: finCount }).map((_, i) => (
        <mesh key={i} position={[-6 + i * 1.5, 4.5, 0.9]} castShadow>
          <boxGeometry args={[0.1, 9.5, 0.22]} />
          <meshStandardMaterial color="#2e2212" roughness={0.35} metalness={0.7} />
        </mesh>
      ))}

      {/* Glowing window panels */}
      {[[-3.8, 4.5], [3.8, 4.5]].map(([x, y], i) => (
        <group key={i} position={[x, y, 0.85]}>
          <mesh>
            <boxGeometry args={[2.5, 5.5, 0.06]} />
            <meshStandardMaterial
              color="#fde68a"
              transparent
              opacity={0.14}
              roughness={0.0}
              metalness={0.0}
              emissive="#c8880a"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Interior warmth leaking through */}
          <pointLight position={[0, 0, -0.8]} intensity={12} color="#f5c030" distance={9} />
        </group>
      ))}

      {/* Door frame */}
      <mesh position={[0, 2.8, 0.92]}>
        <boxGeometry args={[3.0, 5.8, 0.18]} />
        <meshStandardMaterial color="#281a08" roughness={0.25} metalness={0.75} />
      </mesh>
      {/* Door glass */}
      <mesh position={[0, 2.7, 1.05]}>
        <boxGeometry args={[2.5, 5.2, 0.04]} />
        <meshStandardMaterial color="#d4a853" transparent opacity={0.1} roughness={0.0} envMapIntensity={3} />
      </mesh>
      {/* Handle bar */}
      <mesh position={[0.5, 2.7, 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
        <meshStandardMaterial color="#c8a030" roughness={0.05} metalness={0.95} />
      </mesh>

      {/* Top canopy */}
      <mesh position={[0, 6.0, 3.2]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[7.5, 0.12, 4]} />
        <meshStandardMaterial color="#100d07" roughness={0.9} />
      </mesh>
      {[[-3.2, 6.0, 4.8], [3.2, 6.0, 4.8]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y - 2.5, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 4.2, 8]} />
          <meshStandardMaterial color="#b8900e" roughness={0.1} metalness={0.92} />
        </mesh>
      ))}

      {/* Restaurant name sign */}
      <mesh position={[0, 7.8, 0.95]}>
        <boxGeometry args={[5, 0.65, 0.18]} />
        <meshStandardMaterial color="#c8a030" emissive="#c8a030" emissiveIntensity={1.4} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 7.8, 1.8]} intensity={8} color="#fbbf24" distance={7} />

      {/* Entrance steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.2, 2.2 - i * 0.55]} receiveShadow>
          <boxGeometry args={[5.5, 0.2, 0.72]} />
          <meshStandardMaterial color="#141008" roughness={0.75} metalness={0.15} />
        </mesh>
      ))}

      {/* Bollards */}
      {[-2.2, -1.3, 1.3, 2.2].map((x, i) => (
        <group key={i} position={[x, 0, 4.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.12, 1.0, 12]} />
            <meshStandardMaterial color="#1c1608" roughness={0.35} metalness={0.75} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#ffe4a0" emissive="#fbbf24" emissiveIntensity={3} />
          </mesh>
          <pointLight position={[0, 0.55, 0]} intensity={3} color="#f5c842" distance={3} />
        </group>
      ))}
    </group>
  );
}

// ─── Interior Environment ─────────────────────────────────────────────────────
function Interior() {
  return (
    <group position={[0, 0, -6]}>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -10]} receiveShadow>
        <planeGeometry args={[22, 34]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={50}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0c0905"
          metalness={0.35}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.8, -10]}>
        <planeGeometry args={[22, 34]} />
        <meshStandardMaterial color="#0d0a06" roughness={1} />
      </mesh>

      {/* Walls */}
      {[-11, 11].map((x, i) => (
        <mesh
          key={i}
          rotation={[0, i === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
          position={[x, 2.9, -10]}
        >
          <planeGeometry args={[34, 5.8]} />
          <meshStandardMaterial color="#120e09" roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 2.9, -27]}>
        <planeGeometry args={[22, 5.8]} />
        <meshStandardMaterial color="#0f0c08" roughness={0.95} />
      </mesh>

      {/* Wall art panels */}
      {[[-9, 3.2, -9], [9, 3.2, -9], [-9, 3.2, -17], [9, 3.2, -17]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <boxGeometry args={[2.4, 1.5, 0.04]} />
          <meshStandardMaterial
            color="#c8880a"
            emissive="#8b5500"
            emissiveIntensity={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Wall sconces */}
      {[-8, -4, 0, 4, 8].flatMap((z, zi) =>
        [-10.5, 10.5].map((x, xi) => (
          <group key={`${zi}-${xi}`} position={[x, 4.1, z - 4]}>
            <mesh>
              <cylinderGeometry args={[0.09, 0.07, 0.38, 8]} />
              <meshStandardMaterial color="#2a1a08" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ffe4a0" emissive="#ffcc50" emissiveIntensity={3.5} />
            </mesh>
            <pointLight position={[0, 0.28, 0]} intensity={4.5} color="#f5d080" distance={5.5} />
          </group>
        ))
      )}

      {/* Chandelier pendants */}
      {[
        [-2.5, -8], [0, -8], [2.5, -8],
        [-1.5, -13], [1.5, -13],
        [0, -18],
      ].map(([x, z], i) => {
        const dropLen = 0.7 + (i % 3) * 0.3;
        return (
          <group key={i} position={[x, 5.8, z]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, dropLen, 6]} />
              <meshStandardMaterial color="#8B6914" metalness={0.92} roughness={0.08} />
            </mesh>
            <mesh position={[0, -dropLen / 2 - 0.1, 0]}>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={3} />
            </mesh>
            <pointLight position={[0, -dropLen / 2 - 0.1, 0]} intensity={6} color="#f5c842" distance={4.5} />
          </group>
        );
      })}

      {/* Dining tables */}
      {[
        [-3.5, -8], [3.5, -8],
        [-3.5, -14], [3.5, -14],
        [0, -20],
      ].map(([x, z], i) => (
        <DiningTable key={i} position={[x, 0, z]} />
      ))}

      {/* Ambient fill */}
      <pointLight position={[0, 1, -14]} intensity={4} color="#c8780a" distance={14} />
      <pointLight position={[0, 3, -22]} intensity={2} color="#f5c030" distance={10} />
    </group>
  );
}

// ─── Dining Table ─────────────────────────────────────────────────────────────
function DiningTable({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.07, 36]} />
        <meshStandardMaterial color="#1c1409" roughness={0.12} metalness={0.04} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.77, 0]}>
        <torusGeometry args={[0.93, 0.024, 8, 36]} />
        <meshStandardMaterial color="#c8a030" roughness={0.08} metalness={0.92} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.2, 0.82, 12]} />
        <meshStandardMaterial color="#1e1609" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.07, 12]} />
        <meshStandardMaterial color="#191209" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Plates */}
      {[[0.32, 0.1], [-0.32, -0.12]].map(([px, pz], pi) => (
        <mesh key={pi} position={[px, 0.815, pz]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.19, 24]} />
          <meshStandardMaterial color="#ece8df" roughness={0.08} metalness={0.04} />
        </mesh>
      ))}

      {/* Glasses */}
      {[[0.28, -0.22], [-0.28, 0.22]].map(([gx, gz], gi) => (
        <mesh key={gi} position={[gx, 0.88, gz]}>
          <cylinderGeometry args={[0.055, 0.02, 0.28, 12]} />
          <meshStandardMaterial color="#c8e8f0" roughness={0.0} transparent opacity={0.28} envMapIntensity={2.5} />
        </mesh>
      ))}

      {/* Candle + flame */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.22, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color="#ffcc50" emissive="#ff8800" emissiveIntensity={5} />
      </mesh>
      <pointLight position={[0, 1.02, 0]} intensity={3.5} color="#ff9a20" distance={2.8} castShadow />
    </group>
  );
}

// ─── Ground & Street ──────────────────────────────────────────────────────────
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#0e0b07" roughness={0.97} metalness={0.0} />
      </mesh>

      {/* Wet puddles */}
      {[[2.5, 6], [-3, 9], [1, 13]].map(([x, z], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, z]}>
          <circleGeometry args={[0.7 + i * 0.28, 18]} />
          <meshStandardMaterial color="#c8a030" roughness={0.0} transparent opacity={0.1} />
        </mesh>
      ))}

      {/* Street lamps */}
      {[-6.5, 6.5].map((x, i) => (
        <group key={i} position={[x, 0, 14]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.1, 7.5, 8]} />
            <meshStandardMaterial color="#1c1608" metalness={0.82} roughness={0.18} />
          </mesh>
          <mesh position={[0, 3.9, 0]}>
            <sphereGeometry args={[0.24, 12, 12]} />
            <meshStandardMaterial color="#ffe4a0" emissive="#ffcc50" emissiveIntensity={2.8} />
          </mesh>
          <pointLight position={[0, 3.8, 0]} intensity={18} color="#f5d080" distance={12} castShadow />
        </group>
      ))}
    </group>
  );
}

// ─── Atmosphere ───────────────────────────────────────────────────────────────
function Atmosphere() {
  return (
    <>
      <Sparkles count={55} scale={[20, 7, 20]} size={0.45} speed={0.07} color="#fde68a" opacity={0.35} position={[0, 3, -4]} />
      <Sparkles count={28} scale={[9, 4, 9]} size={0.28} speed={0.05} color="#f5c842" opacity={0.55} position={[0, 2, -16]} />
    </>
  );
}

// ─── Scene Lights ─────────────────────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.07} color="#1e1508" />
      <directionalLight
        position={[8, 14, 10]}
        intensity={0.4}
        color="#c0900e"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={70}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />
      <directionalLight position={[-6, 18, -8]} intensity={0.15} color="#9ab0c8" />
    </>
  );
}

// ─── Canvas Export ────────────────────────────────────────────────────────────
export default function Scene3D({ scrollProgress, mouseX, mouseY }) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.2]}
      camera={{ position: [0, 4, 24], fov: 50, near: 0.1, far: 130 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
    >
      <color attach="background" args={["#050401"]} />
      <fog attach="fog" args={["#080601", 20, 60]} />

      <Suspense fallback={null}>
        <SceneLights />
        <Environment preset="night" />
        <CameraController scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />
        <Building />
        <Interior />
        <Ground />
        <Atmosphere />
      </Suspense>
    </Canvas>
  );
}