"use client";

import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { FRONT_ZONES, BACK_ZONES, Zone3D } from "@/lib/bodyZones3d";

const ACTIVE_COLOR = "#1B3A2D";
const INACTIVE_COLOR = "#C9D6CB";
const HEAD_COLOR_ACTIVE = "#1B3A2D";
const HEAD_COLOR_INACTIVE = "#D6DFD7";

function ZoneMesh({ zone, active, onSelect }: { zone: Zone3D; active: boolean; onSelect: (code: string) => void }) {
  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    onSelect(zone.code);
  }

  if (zone.shape === "sphere") {
    return (
      <mesh position={[zone.x, zone.y, zone.z]} onClick={handleClick}>
        <sphereGeometry args={[zone.w / 2, 20, 20]} />
        <meshStandardMaterial color={active ? HEAD_COLOR_ACTIVE : HEAD_COLOR_INACTIVE} roughness={0.6} />
      </mesh>
    );
  }

  return (
    <RoundedBox
      position={[zone.x, zone.y, zone.z]}
      args={[zone.w, zone.h, zone.d]}
      radius={0.1}
      smoothness={4}
      onClick={handleClick}
    >
      <meshStandardMaterial color={active ? ACTIVE_COLOR : INACTIVE_COLOR} roughness={0.6} />
    </RoundedBox>
  );
}

export default function BodyModel3D({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (code: string) => void;
}) {
  return (
    <div className="w-full h-[420px] rounded-2xl bg-papier cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0.5, 5.5], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={0.8} />
        <directionalLight position={[-3, 2, -4]} intensity={0.3} />

        {[...FRONT_ZONES, ...BACK_ZONES].map((zone) => (
          <ZoneMesh key={zone.code} zone={zone} active={selected.includes(zone.code)} onSelect={onToggle} />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}