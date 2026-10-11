"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Matrix4, Mesh, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { DashboardAsset } from "@/lib/dashboard-data";
import {
  cameraTarget,
  homeCamera,
  sceneAssets,
  type CameraAction,
  type ScenePoint,
} from "@/lib/industrial-scene";
import {
  Cable,
  cableCurve,
  Conveyor,
  FactoryFloor,
  FactoryHall,
  FactoryDetails,
  EquipmentShadows,
  IndustrialMaterials,
  HmiStation,
  NetworkRack,
  PlcCabinet,
  RemoteIo,
  RobotArm,
} from "./industrial-models";

export interface IndustrialCanvasProps {
  animate: boolean;
  network: boolean;
  risks: boolean;
  selectedId?: string | null;
  command: { action: CameraAction; sequence: number } | null;
  onInspect: (asset: DashboardAsset) => void;
  onQuality: (quality: string) => void;
  onFailure: () => void;
  efficient?: boolean;
}

function CameraRig({ command, animate }: Pick<IndustrialCanvasProps, "command" | "animate">) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, gl, invalidate } = useThree();
  const reportView = useCallback(() => {
    gl.domElement.setAttribute(
      "data-camera",
      camera.position
        .toArray()
        .map((value) => value.toFixed(2))
        .join(",")
    );
  }, [camera, gl]);
  useLayoutEffect(reportView, [reportView]);
  useEffect(() => {
    if (!command || !controls.current) return;
    const target = controls.current.target;
    const offset = camera.position.clone().sub(target);
    if (command.action === "reset") {
      camera.position.set(...homeCamera);
      target.set(...cameraTarget);
    } else if (command.action === "left" || command.action === "right") {
      offset.applyAxisAngle(new Vector3(0, 1, 0), command.action === "left" ? 0.3 : -0.3);
      camera.position.copy(target).add(offset);
    } else {
      offset.multiplyScalar(command.action === "in" ? 0.82 : 1.22).clampLength(7, 23);
      camera.position.copy(target).add(offset);
    }
    controls.current.update();
    reportView();
    invalidate();
  }, [command, camera, invalidate, reportView]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={cameraTarget}
      enableDamping={animate}
      dampingFactor={0.09}
      minDistance={7}
      maxDistance={23}
      minPolarAngle={0.3}
      maxPolarAngle={Math.PI / 2.1}
      enablePan={false}
      rotateSpeed={0.65}
      zoomSpeed={0.7}
      onChange={reportView}
    />
  );
}

function NetworkConnections({ animate }: { animate: boolean }) {
  const packets = useRef<(Mesh | null)[]>([]);
  const elapsed = useRef(0);
  const routes = useMemo(
    () =>
      sceneAssets
        .filter((item) => item.id !== "GW-02")
        .map((item) => {
          const target = item.id === "PLC-07" ? [-4.95, 0, 2.1] : item.position;
          const points: ScenePoint[] = [
            [target[0], 0.16, 2.9],
            [target[0], 0.16, target[2] + 0.85],
            [target[0], 0.65, target[2] + 0.6],
          ];
          return {
            id: item.id,
            points,
            curve: cableCurve(points, true),
          };
        }),
    []
  );
  useFrame((_, delta) => {
    if (!animate) return;
    elapsed.current += Math.min(delta, 0.05);
    routes.forEach((route, i) =>
      route.curve.getPointAt((elapsed.current * 0.22 + i * 0.18) % 1, packets.current[i]?.position)
    );
  });
  return (
    <group>
      <Cable
        points={[
          [-7.5, 0.16, 2.9],
          [7.2, 0.16, 2.9],
        ]}
        color="#168dff"
        radius={0.018}
        luminous
        orthogonal
      />
      <Cable
        points={[
          [-3.3, 0.55, -2.9],
          [-3.3, 0.16, -2.9],
          [-3.3, 0.16, 2.9],
        ]}
        color="#168dff"
        radius={0.018}
        luminous
        orthogonal
      />
      {routes.map((route, i) => (
        <group key={route.id}>
          <Cable points={route.points} color="#168dff" radius={0.018} luminous orthogonal />
          <mesh
            ref={(node) => {
              packets.current[i] = node;
            }}
            position={route.curve.getPointAt(i * 0.18)}
          >
            <sphereGeometry args={[0.045, 12, 8]} />
            <meshBasicMaterial color="#c5e7ff" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SceneAsset({
  entry,
  risks,
  selected,
  onInspect,
  children,
}: {
  entry: (typeof sceneAssets)[number];
  risks: boolean;
  selected?: boolean;
  onInspect: IndustrialCanvasProps["onInspect"];
  children: React.ReactNode;
}) {
  const inspect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta < 5) onInspect(entry.asset);
  };
  return (
    <>
      <group
        position={entry.position}
        onClick={inspect}
        onPointerOver={(event) => {
          event.stopPropagation();
          (event.nativeEvent.target as HTMLCanvasElement).style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          (event.nativeEvent.target as HTMLCanvasElement).style.cursor = "grab";
        }}
      >
        {children}
      </group>
      {(risks || selected) && (
        <mesh
          position={[entry.position[0], 0.08, entry.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.78, 0.8, 48]} />
          <meshBasicMaterial
            color={selected ? "#00c9ff" : entry.asset.risk >= 8 ? "#dbaa78" : "#7091bc"}
            transparent
            opacity={0.75}
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}

function PerformanceBudget({ animate, onDegrade }: { animate: boolean; onDegrade: () => void }) {
  const sample = useRef({ frames: 0, time: 0, warmup: 0 });
  useFrame((_, delta) => {
    // Adapt once after shader warmup; no per-frame React state updates.
    if (!animate || document.hidden) return;
    sample.current.warmup += delta;
    if (sample.current.warmup < 1) return;
    sample.current.frames++;
    sample.current.time += Math.min(delta, 0.25);
    if (sample.current.time >= 1.2) {
      if (sample.current.time / sample.current.frames > 0.035) onDegrade();
      sample.current.frames = 0;
      sample.current.time = 0;
    }
  });
  return null;
}

function SceneWorld(
  props: IndustrialCanvasProps & {
    low: boolean;
    onDegrade: () => void;
    labels: React.RefObject<(HTMLButtonElement | null)[]>;
  }
) {
  const { gl, invalidate } = useThree();
  const { onFailure } = props;
  const rendered = useRef(false);
  useEffect(() => {
    // Wake a fully idle demand loop when Play or visibility resumes animation.
    invalidate();
  }, [props.animate, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    invalidate();
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, invalidate, onFailure]);
  useFrame(() => {
    if (!rendered.current) {
      gl.domElement.setAttribute("data-rendered", "true");
      rendered.current = true;
    }
  });
  return (
    <IndustrialMaterials>
      <color attach="background" args={["#0b1119"]} />
      <fog attach="fog" args={["#0b1119", 15, 38]} />
      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#b3c9e0", "#10151b", 0.55]} />
      <directionalLight
        position={[2, 9, 5]}
        color="#f2f4f6"
        intensity={2.6}
        castShadow={!props.low}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
      />
      <spotLight
        position={[-5, 6, -4]}
        color="#9cbbde"
        intensity={80}
        angle={0.8}
        penumbra={0.9}
        distance={22}
      />
      <pointLight position={[5, 4, 0]} color="#b9d3ee" intensity={12} distance={14} />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[0, 4, 10]}
          rotation={[0, Math.PI, 0]}
          scale={[12, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3.5}
          position={[0, 6, 1]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[14, 0.8, 1]}
        />
        <Lightformer
          intensity={2}
          color="#8cbded"
          position={[-6, 4, -3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[3, 7, 1]}
        />
        <Lightformer
          intensity={2}
          position={[5, 3, -5]}
          rotation={[0, -Math.PI / 4, 0]}
          scale={[3, 6, 1]}
        />
      </Environment>
      <FactoryFloor low={props.low} />
      <EquipmentShadows />
      <FactoryHall />
      <FactoryDetails />
      {sceneAssets.map((entry) => (
        <SceneAsset
          key={entry.id}
          entry={entry}
          selected={props.selectedId === entry.id}
          risks={props.risks}
          onInspect={props.onInspect}
        >
          {entry.id === "PLC-01" ? (
            <PlcCabinet />
          ) : entry.id === "GW-02" ? (
            <NetworkRack />
          ) : entry.id === "HIS-01" ? (
            <NetworkRack historian />
          ) : entry.id === "RTU-03" ? (
            <RemoteIo />
          ) : entry.id === "HMI-04" ? (
            <HmiStation />
          ) : (
            <Conveyor animate={props.animate} />
          )}
        </SceneAsset>
      ))}
      <group
        onClick={(event) => {
          event.stopPropagation();
          if (event.delta < 5) props.onInspect(sceneAssets[0].asset);
        }}
      >
        <RobotArm animate={props.animate} />
      </group>
      {props.network && <NetworkConnections animate={props.animate} />}
      <CameraRig command={props.command} animate={props.animate} />
      <LabelProjection labels={props.labels} />
      {!props.low && <PerformanceBudget animate={props.animate} onDegrade={props.onDegrade} />}
    </IndustrialMaterials>
  );
}

export default function IndustrialCanvas(props: IndustrialCanvasProps) {
  const [low, setLow] = useState(props.efficient ?? false);
  const [rendererReady, setRendererReady] = useState(false);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const { onQuality } = props;
  const degrade = useCallback(() => {
    setLow(true);
    onQuality("Efficient · 1×");
  }, [onQuality]);
  return (
    <>
      <Canvas
        className="cc-webgl"
        camera={{ position: homeCamera, fov: props.efficient ? 45 : 27, near: 0.1, far: 100 }}
        dpr={low ? 1 : [1, 1.5]}
        shadows={!low}
        frameloop={props.animate ? "always" : "demand"}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false, stencil: false }}
        fallback={
          <div className="cc-renderer-unavailable">
            WebGL is unavailable. Use the 2D asset view.
          </div>
        }
        onCreated={({ gl }) => {
          // Software WebGL needs the efficient path before compiling the factory's
          // shadows/reflections. Frame sampling cannot adapt a paused demand loop.
          const context = gl.getContext();
          const debug = context.getExtension("WEBGL_debug_renderer_info");
          const renderer = context.getParameter(debug?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER);
          const software = /swiftshader|llvmpipe|softpipe|software rasterizer|basic render/i.test(
            renderer
          );
          const efficient = !!props.efficient || software;
          setLow(efficient);
          setRendererReady(true);
          gl.domElement.tabIndex = 0;
          onQuality(efficient ? "Efficient · 1×" : "Adaptive · ≤1.5×");
          gl.domElement.setAttribute(
            "aria-label",
            "3D industrial assembly cell. Drag to orbit; scroll to zoom."
          );
          gl.domElement.setAttribute("role", "img");
        }}
      >
        <Suspense fallback={null}>
          {rendererReady && <SceneWorld {...props} labels={labels} low={low} onDegrade={degrade} />}
        </Suspense>
      </Canvas>
      <div className="cc-projected-labels">
        {[
          ...sceneAssets.map((entry) => ({
            id: entry.id,
            name: entry.asset.name,
            asset: entry.asset,
          })),
          { id: "ROBOT-01", name: "Robot arm / PLC-01 controlled", asset: sceneAssets[0].asset },
        ].map((entry, index) => (
          <button
            key={entry.id}
            ref={(node) => {
              labels.current[index] = node;
            }}
            className={`cc-3d-label ${entry.asset.risk >= 8 ? "is-high-risk" : ""}`}
            aria-label={`Inspect ${entry.id}, ${entry.name}`}
            aria-pressed={props.selectedId === entry.asset.id}
            onClick={() => props.onInspect(entry.asset)}
          >
            <span className="cc-3d-label-dot" />
            <span>
              {entry.id}
              <small>{entry.id === "ROBOT-01" ? "Assembly robot" : entry.name}</small>
            </span>
            {props.risks && <span className="cc-3d-risk">{entry.asset.risk.toFixed(1)}</span>}
            <span className="cc-3d-tooltip">Demo asset · Click to inspect</span>
          </button>
        ))}
      </div>
    </>
  );
}

function LabelProjection({ labels }: { labels: React.RefObject<(HTMLButtonElement | null)[]> }) {
  const { camera, size } = useThree();
  const points = useMemo(
    () => [
      ...sceneAssets.map((entry) => new Vector3(...entry.label)),
      new Vector3(1.8, 3.12, -0.4),
    ],
    []
  );
  const projected = useMemo(() => new Vector3(), []);
  const previous = useRef({ matrix: new Matrix4(), width: 0, height: 0 });
  useFrame(() => {
    if (
      previous.current.width === size.width &&
      previous.current.height === size.height &&
      previous.current.matrix.equals(camera.matrixWorld)
    )
      return;
    previous.current.matrix.copy(camera.matrixWorld);
    previous.current.width = size.width;
    previous.current.height = size.height;
    points.forEach((point, index) => {
      const label = labels.current[index];
      if (!label) return;
      projected.copy(point).project(camera);
      const x = ((projected.x + 1) * size.width) / 2;
      const y = ((-projected.y + 1) * size.height) / 2;
      label.style.setProperty("transform", `translate3d(${x}px,${y}px,0) translate(-50%,-100%)`);
      label.style.setProperty(
        "visibility",
        projected.z < 1 &&
          projected.z > -1 &&
          x > 15 &&
          x < size.width - 15 &&
          y > 15 &&
          y < size.height - 15
          ? "visible"
          : "hidden"
      );
    });
  });
  return null;
}
