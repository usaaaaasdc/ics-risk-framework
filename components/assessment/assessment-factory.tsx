"use client";

import { memo, Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
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
}

const positions: ScenePoint[] = [
  [-3.2, 0, -2.2],
  [2.5, 0, -2.4],
  [-3.2, 0, 2.3],
  [3.7, 0, 2.3],
];

function FactoryWorld({
  assets,
  selectedId,
  onSelect,
  onFailure,
  command,
  labels,
}: FactoryProps & { labels: RefObject<(HTMLButtonElement | null)[]> }) {
  const { gl, camera, invalidate } = useThree();
  const controls = useRef<Controls>(null);
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
      camera.position.set(10, 10, 13);
      controls.current?.target.set(0, 0.8, 0);
    } else camera.position.multiplyScalar(command.action === "in" ? 0.9 : 1.1).clampLength(9, 24);
    controls.current?.update();
    invalidate();
  }, [command, camera, invalidate]);
  useFrame(() => {
    gl.domElement.setAttribute("data-rendered", "true");
    const bounds = gl.domElement.getBoundingClientRect();
    assets.slice(0, 12).forEach((_, i) => {
      const label = labels.current[i];
      if (!label) return;
      const base = positions[i % 4];
      const point = new Vector3(base[0], 2.4, base[2] + Math.floor(i / 4) * 2.4).project(camera);
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
      <color attach="background" args={["#0b1825"]} />
      <fog attach="fog" args={["#0b1825", 18, 42]} />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#cee4ff", "#101923", 1]} />
      <directionalLight position={[2, 10, 5]} intensity={3.2} color="#eef7ff" />
      <pointLight position={[-6, 4, -2]} color="#78c7ff" intensity={22} distance={16} />
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
      <FactoryHall />
      <FactoryDetails />
      <group position={[0, 0, -4]} scale={[0.8, 0.8, 0.8]}>
        <NetworkRack historian />
      </group>
      {[-5, -2, 1, 4].map((x, i) => (
        <group key={x} position={[x, 0, -6.5]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 3.5, 20]} />
            <meshStandardMaterial color="#8394a4" metalness={0.85} roughness={0.38} />
          </mesh>
          <MetalBox size={[1.5, 0.16, 1.5]} position={[0, 0.12, 0]} />
          <Cable
            color="#8796a6"
            points={[
              [0, 3.5, 0],
              [0, 4.2, 0],
              [1.4, 4.2, 0],
              [1.4, 0.6, 0],
            ]}
            radius={0.065}
          />
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
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
              <ringGeometry args={[0.85, selected ? 1.03 : 0.9, 32]} />
              <meshBasicMaterial color={selected ? "#28cbff" : "#37677d"} />
            </mesh>
          </group>
        );
      })}
      <group position={[0, 0, 1.3]} scale={[0.7, 0.7, 0.7]}>
        <Conveyor animate={false} />
      </group>
      <group position={[1.3, 0, 2.5]} scale={[0.7, 0.7, 0.7]}>
        <RobotArm animate={false} />
      </group>
      {positions.slice(1).map((p, i) => (
        <Cable
          key={i}
          color={["#23bfff", "#31cfbb", "#ffad54"][i]}
          radius={0.025}
          points={[
            [positions[0][0], 0.16, positions[0][2]],
            [positions[0][0], 0.16, p[2] + 0.7],
            [p[0], 0.16, p[2] + 0.7],
            [p[0], 0.16, p[2]],
          ]}
        />
      ))}
      <OrbitControls
        ref={controls}
        target={[0, 0.8, 0]}
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
        camera={{ position: [10, 10, 13], fov: 42 }}
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
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(AssessmentFactory);
