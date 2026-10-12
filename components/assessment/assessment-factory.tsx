"use client";

import { memo, Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { CanvasTexture, Vector3 } from "three";
import type { OrbitControls as Controls } from "three-stdlib";
import {
  Cable,
  Conveyor,
  FactoryDetails,
  FactoryFloor,
  FactoryHall,
  HmiStation,
  IndustrialMaterials,
  MetalBox,
  NetworkRack,
  PlcCabinet,
  RemoteIo,
  RobotArm,
} from "@/components/dashboard/industrial-models";
import type { EnvironmentAsset } from "./industrial-environment";
import type { ScenePoint } from "@/lib/industrial-scene";

export interface FactoryProps {
  assets: EnvironmentAsset[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onFailure: () => void;
  inspect: string;
  sceneLabel: string;
  command: { action: "in" | "out" | "reset"; sequence: number } | null;
  risk?: number;
}

const positions: ScenePoint[] = [
  [-4.1, 0, -2.7],
  [2.8, 0, -2.5],
  [-3.5, 0, 2.7],
  [4.5, 0, 2.2],
];

function PlantShadows({ assetCount }: { assetCount: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(32, 32, 4, 32, 32, 32);
    gradient.addColorStop(0, "rgba(0,0,0,.8)");
    gradient.addColorStop(0.45, "rgba(0,0,0,.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  const shadows = [
    ...Array.from({ length: Math.min(assetCount, 12) }, (_, i) => [
      positions[i % 4][0],
      0.205,
      positions[i % 4][2] + Math.floor(i / 4) * 2.4,
      3.5,
      2.4,
    ]),
    ...[-6, -3, 0, 3, 6].map((x) => [x, 0.068, -7.5, 2, 2]),
    ...[-7.6, 7.4].map((x) => [x, 0.068, -0.6, 2, 2]),
    [0, 0.068, 1.3, 12, 2.5],
    [2, 0.068, 2.5, 3, 3],
  ];
  return (
    <group>
      {shadows.map(([x, y, z, width, depth], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            toneMapped={false}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function ProcessVessel({ position, height = 3.5 }: { position: ScenePoint; height?: number }) {
  return (
    <group position={position}>
      <MetalBox size={[1.6, 0.16, 1.6]} position={[0, 0.15, 0]} dark />
      <mesh position={[0, height / 2 + 0.3, 0]}>
        <cylinderGeometry args={[0.62, 0.62, height, 24]} />
        <meshStandardMaterial color="#a9b5be" metalness={0.88} roughness={0.29} />
      </mesh>
      {[0.5, height * 0.5, height].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.64, 0.025, 6, 24]} />
          <meshStandardMaterial color="#c4ced3" metalness={0.9} roughness={0.26} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.3, 0]} scale={[1, 0.4, 1]}>
        <sphereGeometry args={[0.62, 24, 12]} />
        <meshStandardMaterial color="#a9b5be" metalness={0.88} roughness={0.29} />
      </mesh>
      <Cable
        points={[
          [0, height + 0.5, 0],
          [0, height + 0.9, 0],
          [1, height + 0.9, 0],
          [1, 0.5, 0],
          [1.7, 0.5, 0],
        ]}
        radius={0.065}
        color="#a2b1bc"
      />
      <MetalBox size={[0.08, height, 0.08]} position={[-0.7, height / 2, 0.2]} />
      {Array.from({ length: 9 }, (_, i) => (
        <MetalBox
          key={i}
          size={[0.3, 0.025, 0.04]}
          position={[-0.7, 0.45 + (i * height) / 10, 0.22]}
        />
      ))}
    </group>
  );
}

function FactoryWorld({
  assets,
  selectedId,
  onSelect,
  onFailure,
  command,
  labels,
  risk,
}: FactoryProps & { labels: RefObject<(HTMLButtonElement | null)[]> }) {
  const { gl, camera, invalidate } = useThree();
  const controls = useRef<Controls>(null);
  const projected = useRef(new Vector3());
  const frames = useRef(0);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useEffect(() => {
    if (!command) return;
    if (command.action === "reset") {
      camera.position.set(11.8, 8.8, 13.8);
      controls.current?.target.set(0, 0.85, -1);
    } else camera.position.multiplyScalar(command.action === "in" ? 0.9 : 1.1).clampLength(9, 24);
    controls.current?.update();
    invalidate();
  }, [command, camera, invalidate]);
  useFrame(() => {
    gl.domElement.setAttribute("data-rendered", "true");
    gl.domElement.setAttribute("data-scene-frames", String(++frames.current));
    gl.domElement.setAttribute(
      "data-camera",
      camera.position
        .toArray()
        .map((n) => n.toFixed(3))
        .join(",")
    );
    const bounds = gl.domElement.getBoundingClientRect();
    assets.slice(0, 12).forEach((_, i) => {
      const label = labels.current[i];
      if (!label) return;
      const base = positions[i % 4];
      const point = projected.current
        .set(base[0], 2.4, base[2] + Math.floor(i / 4) * 2.4)
        .project(camera);
      label.style.setProperty(
        "transform",
        "translate(" +
          (point.x * 0.5 + 0.5) * bounds.width +
          "px," +
          (-point.y * 0.5 + 0.5) * bounds.height +
          "px) translate(-50%,-100%)"
      );
    });
  });

  // All geometry represents illustrative industrial context, never a plant survey.
  return (
    <IndustrialMaterials>
      <color attach="background" args={["#07121b"]} />
      <fog attach="fog" args={["#07121b", 24, 48]} />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#d7e6f4", "#101923", 1.1]} />
      <directionalLight position={[2, 11, 7]} intensity={3.8} color="#eef7ff" />
      <pointLight position={[-6, 4, -2]} color="#55bdff" intensity={32} distance={18} />
      <pointLight position={[6, 3, -4]} color="#a5cbdf" intensity={25} distance={16} />
      <Environment resolution={64} frames={1}>
        <Lightformer
          intensity={3}
          position={[0, 7, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[15, 3, 1]}
        />
        <Lightformer
          intensity={2}
          position={[-8, 4, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[4, 8, 1]}
        />
      </Environment>
      <FactoryFloor low />
      <group position={[0, 0, -3]}>
        <FactoryHall />
      </group>
      <FactoryDetails />
      <PlantShadows assetCount={assets.length} />
      <group position={[0, 0, -4]} scale={[0.8, 0.8, 0.8]}>
        <NetworkRack historian />
      </group>
      {[-6, -3, 0, 3, 6].map((x, i) => (
        <group key={x} position={[x, 0, -7.5]}>
          <ProcessVessel position={[0, 0, 0]} height={i % 2 ? 3.2 : 4.1} />
          <Cable
            color={i % 2 ? "#27cbbb" : "#219bd9"}
            points={[
              [0, 0.18, 0],
              [0, 0.18, 2],
              [2, 0.18, 2],
            ]}
            radius={0.025}
          />
        </group>
      ))}
      {[-7.6, 7.4].map((x) => (
        <group key={x}>
          <ProcessVessel position={[x, 0, -0.6]} height={2.7} />
          <Cable
            color="#8395a4"
            radius={0.08}
            points={[
              [x, 0.5, 0],
              [x, 0.5, 3.6],
              [x / 2, 0.5, 3.6],
            ]}
          />
        </group>
      ))}
      {[-6, -2.3, 1.4, 5.1].map((x, i) => (
        <group key={x}>
          <MetalBox size={[3.4, 0.12, 3.1]} position={[x, 0.12, -2.5]} color="#344552" />
          <Cable
            color={["#20bfff", "#22d4bd", "#ffb64b", "#ff6374"][i]}
            radius={0.025}
            luminous
            orthogonal
            points={[
              [x - 1.7, 0.22, -4.1],
              [x + 1.7, 0.22, -4.1],
              [x + 1.7, 0.22, -0.95],
              [x - 1.7, 0.22, -0.95],
              [x - 1.7, 0.22, -4.1],
            ]}
          />
        </group>
      ))}
      {assets.slice(0, 12).map((asset, i) => {
        const base = positions[i % 4];
        const pos: ScenePoint = [base[0], 0, base[2] + Math.floor(i / 4) * 2.4];
        const selected = asset.id === selectedId;
        return (
          <group
            key={asset.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              if (e.delta < 5) onSelect(asset.id);
            }}
          >
            {/hmi|scada/i.test(asset.kind) ? (
              <HmiStation />
            ) : /sensor|field|actuator/i.test(asset.kind) ? (
              <RemoteIo />
            ) : (
              <PlcCabinet />
            )}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.23, 0]}>
              <ringGeometry args={[0.85, selected ? 1.03 : 0.9, 32]} />
              <meshBasicMaterial
                color={
                  selected ? (risk !== undefined && risk >= 7 ? "#ff566b" : "#28cbff") : "#37677d"
                }
              />
            </mesh>
          </group>
        );
      })}
      <group position={[0, 0, 1.3]} scale={[0.9, 0.9, 0.9]}>
        <Conveyor animate={false} />
      </group>
      <group position={[0.6, 0, 2.5]} scale={[0.95, 0.95, 0.95]}>
        <RobotArm animate={false} />
      </group>
      {positions.slice(1).map((p, i) => (
        <Cable
          key={i}
          color={["#23bfff", "#31cfbb", "#ffad54"][i]}
          radius={0.025}
          luminous
          orthogonal
          points={[
            [positions[0][0], 0.24, positions[0][2]],
            [positions[0][0], 0.24, p[2] + 0.7],
            [p[0], 0.24, p[2] + 0.7],
            [p[0], 0.24, p[2]],
          ]}
        />
      ))}
      <OrbitControls
        ref={controls}
        target={[0, 0.85, -1]}
        enableDamping={false}
        enablePan={false}
        minDistance={9}
        maxDistance={24}
        minPolarAngle={0.4}
        maxPolarAngle={1.35}
        rotateSpeed={0.6}
      />
    </IndustrialMaterials>
  );
}

function AssessmentFactory(props: FactoryProps) {
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="ac-factory-layer">
      <Canvas
        frameloop="demand"
        dpr={1}
        camera={{ position: [11.8, 8.8, 13.8], fov: 38 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          gl.domElement.setAttribute("role", "img");
          gl.domElement.setAttribute("aria-label", props.sceneLabel);
        }}
        fallback={<span>{props.inspect}</span>}
      >
        <Suspense fallback={null}>
          <FactoryWorld {...props} labels={labels} />
        </Suspense>
      </Canvas>
      <div className="ac-factory-labels">
        {props.assets.slice(0, 12).map((asset, i) => (
          <button
            key={asset.id}
            ref={(node) => {
              labels.current[i] = node;
            }}
            className="ac-factory-label"
            aria-label={`${props.inspect} ${asset.label}`}
            aria-pressed={asset.id === props.selectedId}
            onClick={() => props.onSelect(asset.id)}
          >
            {asset.label}
            {asset.id === props.selectedId && props.risk !== undefined && (
              <b className="ac-factory-risk">{props.risk.toFixed(1)} / 10</b>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(AssessmentFactory);
