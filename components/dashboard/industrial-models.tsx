"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { MeshReflectorMaterial, RoundedBox } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferGeometry,
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CurvePath,
  DataTexture,
  CylinderGeometry,
  Group,
  InstancedMesh,
  LinearFilter,
  LinearMipmapLinearFilter,
  LineCurve3,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  SphereGeometry,
  Vector3,
  Vector2,
} from "three";
import type { ScenePoint } from "@/lib/industrial-scene";

const steel = { color: "#a7b2bd", metalness: 0.86, roughness: 0.45 };
const graphite = { color: "#202831", metalness: 0.68, roughness: 0.54 };

type MaterialLibrary = {
  get: (dark: boolean, color?: string, lit?: boolean) => MeshStandardMaterial;
  panel: (kind: "hmi" | "label" | "warning") => CanvasTexture;
};
const MaterialContext = createContext<MaterialLibrary | null>(null);

export function IndustrialMaterials({ children }: { children: ReactNode }) {
  const library = useMemo(() => {
    // Shared brushed-metal maps and materials keep detail cheap across the entire cell.
    const grain = new Uint8Array(128 * 128 * 4);
    const normals = new Uint8Array(grain.length);
    for (let i = 0; i < 128 * 128; i++) {
      const row = Math.floor(i / 128);
      const noise = Math.sin(row * 71.17 + (i % 128) * 0.13) * 0.5 + 0.5;
      const value = 180 + noise * 38;
      grain.set([value, value, value, 255], i * 4);
      normals.set([128, 123 + noise * 10, 255, 255], i * 4);
    }
    const roughness = new DataTexture(grain, 128, 128);
    const normal = new DataTexture(normals, 128, 128);
    for (const texture of [roughness, normal]) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(3, 3);
      texture.magFilter = LinearFilter;
      texture.minFilter = LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
      texture.anisotropy = 2;
      texture.needsUpdate = true;
    }
    const materials = new Map<string, MeshStandardMaterial>();
    const panels = new Map<string, CanvasTexture>();
    return {
      get(dark: boolean, color?: string, lit = false) {
        const key = `${dark}/${color}/${lit}`;
        let material = materials.get(key);
        if (!material) {
          material = new MeshStandardMaterial({
            ...(dark ? graphite : steel),
            ...(color ? { color, metalness: 0.68, roughness: 0.5 } : {}),
            roughnessMap: roughness,
            normalMap: normal,
            normalScale: new Vector2(0.1, 0.1),
            ...(lit ? { emissive: color, emissiveIntensity: 1.5, toneMapped: false } : {}),
          });
          materials.set(key, material);
        }
        return material;
      },
      panel(kind: "hmi" | "label" | "warning") {
        let texture = panels.get(kind);
        if (!texture) {
          texture = createPanelTexture(kind);
          panels.set(kind, texture);
        }
        return texture;
      },
      dispose() {
        materials.forEach((material) => material.dispose());
        panels.forEach((texture) => texture.dispose());
        roughness.dispose();
        normal.dispose();
      },
    };
  }, []);
  useEffect(() => () => library.dispose(), [library]);
  return <MaterialContext.Provider value={library}>{children}</MaterialContext.Provider>;
}

function useMetal(dark = false, color?: string, lit = false) {
  const library = useContext(MaterialContext);
  if (!library) throw new Error("Industrial materials must wrap factory geometry");
  return library.get(dark, color, lit);
}

function RepeatedParts({
  positions,
  size,
  shape = "box",
  color = "#19232d",
}: {
  positions: ScenePoint[];
  size: ScenePoint;
  shape?: "box" | "roller" | "led" | "bolt";
  color?: string;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const material = useMetal(false, color, shape === "led");
  const [width, height, depth] = size;
  const geometry = useMemo(
    () =>
      shape === "roller"
        ? new CylinderGeometry(width, width, height, 20).rotateX(Math.PI / 2)
        : shape === "bolt"
          ? new CylinderGeometry(width, width, height, 6).rotateX(Math.PI / 2)
          : shape === "led"
            ? new SphereGeometry(width, 8, 6)
            : new BoxGeometry(width, height, depth),
    [shape, width, height, depth]
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => {
    const instance = mesh.current;
    if (!instance) return;
    const matrix = new Matrix4();
    positions.forEach((point, index) =>
      instance.setMatrixAt(index, matrix.makeTranslation(...point))
    );
    instance.instanceMatrix.needsUpdate = true;
    instance.computeBoundingSphere();
  }, [positions]);
  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, undefined, positions.length]}
      material={material}
      castShadow={shape !== "led"}
      receiveShadow
    />
  );
}

function ConveyorRollers() {
  const positions = useMemo(
    () => Array.from({ length: 59 }, (_, i) => [-6.55 + i * 0.226, 0.97, 1.35] as ScenePoint),
    []
  );
  return (
    <RepeatedParts positions={positions} size={[0.087, 1.2, 0]} shape="roller" color="#c2c8d0" />
  );
}

export function MetalBox({
  size,
  position,
  color,
  dark = false,
  radius = 0.035,
  children,
  ...props
}: {
  size: ScenePoint;
  color?: string;
  dark?: boolean;
  radius?: number;
  children?: ReactNode;
} & Omit<ThreeElements["mesh"], "args" | "ref">) {
  const material = useMetal(dark, color);
  // Thin sheet metal, rails and fittings don't need densely tessellated bevels.
  if (Math.min(...size) < 0.12)
    return (
      <mesh position={position} castShadow receiveShadow material={material} {...props}>
        <boxGeometry args={size} />
        {children}
      </mesh>
    );
  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={1}
      bevelSegments={2}
      material={material}
      position={position}
      castShadow
      receiveShadow
      {...props}
    >
      {children}
    </RoundedBox>
  );
}

function Cylinder({
  position,
  radius,
  length,
  rotation = [Math.PI / 2, 0, 0],
  dark = false,
}: {
  position: ScenePoint;
  radius: number;
  length: number;
  rotation?: ScenePoint;
  dark?: boolean;
}) {
  const material = useMetal(dark);
  return (
    <mesh position={position} rotation={rotation} castShadow material={material}>
      <cylinderGeometry args={[radius, radius, length, 24]} />
    </mesh>
  );
}

function Indicator({ position, color = "#9adbc1" }: { position: ScenePoint; color?: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.017, 8, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

function createPanelTexture(kind: "hmi" | "label" | "warning") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = kind === "hmi" ? 320 : kind === "warning" ? 512 : 96;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = kind === "hmi" ? "#0c1922" : "#bbc1c7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (kind === "warning") {
    ctx.fillStyle = "#d2ae55";
    ctx.beginPath();
    ctx.moveTo(256, 40);
    ctx.lineTo(480, 440);
    ctx.lineTo(32, 440);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#22282e";
    ctx.lineWidth = 18;
    ctx.stroke();
    ctx.fillStyle = "#22282e";
    ctx.font = "bold 260px monospace";
    ctx.fillText("ϟ", 175, 370);
  } else if (kind === "label") {
    ctx.fillStyle = "#242c33";
    ctx.font = "bold 25px monospace";
    ctx.fillText("ICS / CONTROL SYSTEM", 24, 37);
    ctx.font = "16px monospace";
    ctx.fillText("ASSEMBLY CELL 01    /    DEMO", 24, 69);
  } else {
    ctx.fillStyle = "#8ebde4";
    ctx.font = "bold 19px monospace";
    ctx.fillText("ASSEMBLY LINE 01", 24, 34);
    ctx.fillStyle = "#68aa91";
    ctx.font = "14px monospace";
    ctx.fillText("DEMO PROCESS / LOCAL", 24, 60);
    [0, 1, 2].forEach((i) => {
      ctx.fillStyle = "#162c3b";
      ctx.fillRect(24 + i * 160, 78, 145, 44);
      ctx.fillStyle = i === 2 ? "#dbb574" : "#87c4de";
      ctx.fillRect(34 + i * 160, 88, 9, 9);
      ctx.font = "14px monospace";
      ctx.fillText(["PLC READY", "OT / LINK", "DEMO CELL"][i], 50 + i * 160, 101);
    });
    ctx.strokeStyle = "#354d62";
    ctx.lineWidth = 2;
    for (let x = 24; x < 490; x += 65) {
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x, 240);
      ctx.stroke();
    }
    for (let y = 140; y <= 240; y += 35) {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(488, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "#95c6ef";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 24; x < 488; x += 4) {
      const y = 180 + Math.sin(x * 0.026) * 20 + Math.cos(x * 0.07) * 7;
      if (x === 24) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#a6bdcd";
    ctx.font = "14px monospace";
    ctx.fillText("CYCLE  4.8s", 24, 284);
    ctx.fillText("LOAD  62%", 205, 284);
    ctx.fillText("OT / LOCAL", 365, 284);
  }
  const result = new CanvasTexture(canvas);
  result.colorSpace = SRGBColorSpace;
  return result;
}

function PanelTexture({
  kind,
  size,
  position,
}: {
  kind: "hmi" | "label" | "warning";
  size: [number, number];
  position: ScenePoint;
}) {
  const library = useContext(MaterialContext);
  if (!library) throw new Error("Industrial materials must wrap panel textures");
  const texture = library.panel(kind);
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export function cableCurve(points: ScenePoint[], orthogonal = false) {
  const vectors = points.map((point) => new Vector3(...point));
  if (!orthogonal) return new CatmullRomCurve3(vectors);
  const curve = new CurvePath<Vector3>();
  vectors.slice(1).forEach((point, index) => curve.add(new LineCurve3(vectors[index], point)));
  return curve;
}

export function Cable({
  points,
  color = "#1a2430",
  radius = 0.025,
  luminous = false,
  orthogonal = false,
}: {
  points: ScenePoint[];
  color?: string;
  radius?: number;
  luminous?: boolean;
  orthogonal?: boolean;
}) {
  const curve = useMemo(() => cableCurve(points, orthogonal), [points, orthogonal]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 32, radius, 6, false]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.25}
          emissive={luminous ? color : "#000000"}
          emissiveIntensity={luminous ? 1.5 : 0}
          toneMapped={!luminous}
        />
      </mesh>
      {luminous && (
        <mesh>
          <tubeGeometry args={[curve, 32, radius * 4.5, 6, false]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

export function PlcCabinet() {
  const modules = useMemo(
    () =>
      [0.83, 1.45, 2.05].flatMap((y) =>
        Array.from({ length: 6 }, (_, i) => [-0.34 + i * 0.135, y + 0.14, 0.63] as ScenePoint)
      ),
    []
  );
  const grey = useMemo(() => modules.filter((_, i) => i < 6 || i > 11), [modules]);
  const green = useMemo(() => modules.slice(6, 12), [modules]);
  const terminals = useMemo(
    () => modules.map(([x, y]) => [x, y - 0.06, 0.7] as ScenePoint),
    [modules]
  );
  const leds = useMemo(() => modules.map(([x, y]) => [x, y + 0.085, 0.7] as ScenePoint), [modules]);
  const vents = useMemo(
    () => Array.from({ length: 16 }, (_, i) => [-1.05, 0.4 + i * 0.12, 0.455] as ScenePoint),
    []
  );
  return (
    <group>
      {[0.98, 1.9].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <MetalBox size={[0.88, 2.65, 0.88]} position={[0, 1.4, 0]} color="#949fa9" />
          <MetalBox size={[0.8, 2.5, 0.035]} position={[0, 1.4, 0.465]} color="#aab3bb" />
          <MetalBox size={[0.045, 0.4, 0.08]} position={[0.3, 1.42, 0.51]} dark />
          <PanelTexture kind="label" size={[0.6, 0.11]} position={[0, 2.5, 0.487]} />
          <Indicator position={[-0.2, 2.23, 0.49]} />
          <PanelTexture kind="warning" size={[0.14, 0.14]} position={[-0.22, 1.32, 0.488]} />
          <MetalBox size={[0.92, 0.12, 0.93]} position={[0, 0.08, 0]} dark />
          <CabinetVents position={[0, 0.4, 0.49]} />
        </group>
      ))}
      <MetalBox size={[0.78, 2.65, 0.88]} position={[-1.05, 1.4, 0]} color="#9aa5af" />
      <RepeatedParts positions={vents} size={[0.57, 0.014, 0.02]} />
      <MetalBox size={[1.24, 2.65, 0.88]} position={[0, 1.4, 0]} dark />
      <MetalBox size={[1.12, 2.5, 0.08]} position={[0, 1.4, 0.48]} color="#7e8993" />
      <MetalBox size={[0.94, 1.9, 0.09]} position={[0, 1.48, 0.535]} dark />
      {[0.83, 1.45, 2.05].map((y) => (
        <MetalBox key={y} size={[0.84, 0.035, 0.09]} position={[0, y, 0.61]} />
      ))}
      <RepeatedParts positions={grey} size={[0.11, 0.28, 0.11]} color="#505965" />
      <RepeatedParts positions={green} size={[0.11, 0.28, 0.11]} color="#467967" />
      <RepeatedParts positions={terminals} size={[0.06, 0.06, 0.015]} />
      <RepeatedParts positions={leds} size={[0.017, 0, 0]} shape="led" color="#8fbba5" />
      <mesh position={[0, 1.5, 0.75]}>
        <boxGeometry args={[0.96, 1.95, 0.015]} />
        <meshPhysicalMaterial
          color="#a5c3d4"
          metalness={0.2}
          roughness={0.15}
          transparent
          opacity={0.13}
          depthWrite={false}
          clearcoat={1}
        />
      </mesh>
      <MetalBox size={[1.04, 1.35, 0.06]} position={[0, 0.93, 0.78]} color="#9aa5af" />
      <PanelTexture kind="warning" size={[0.16, 0.16]} position={[-0.26, 1.28, 0.82]} />
      <MetalBox size={[1.04, 0.32, 0.06]} position={[0, 2.37, 0.78]} color="#9aa5af" />
      {[-0.45, 0.45].map((x) => (
        <MetalBox key={x} size={[0.14, 0.8, 0.06]} position={[x, 1.88, 0.78]} color="#9aa5af" />
      ))}
      <PanelTexture kind="hmi" size={[0.57, 0.35]} position={[0, 1.88, 0.82]} />
      {[-0.2, 0, 0.2].map((x) => (
        <Indicator key={x} position={[x, 1.58, 0.83]} color={x === 0.2 ? "#e2b67d" : "#97c7b1"} />
      ))}
      <MetalBox size={[0.055, 0.36, 0.07]} position={[0.51, 1.38, 0.84]} radius={0.012} />
      {[0.45, 1.4, 2.35].map((y) => (
        <MetalBox key={y} size={[0.07, 0.16, 0.1]} position={[-0.59, y, 0.51]} radius={0.01} />
      ))}
      <CabinetVents position={[0, 0.22, 0.82]} />
      <PanelTexture kind="label" size={[0.74, 0.14]} position={[0, 2.52, 0.532]} />
      <MetalBox size={[1.28, 0.12, 0.93]} position={[0, 0.08, 0]} dark />
      <Cable
        points={[
          [0.4, 0.15, -0.3],
          [0.6, 0.12, -0.7],
          [1.5, 0.12, -1.5],
        ]}
      />
    </group>
  );
}

export function NetworkRack({ historian = false }: { historian?: boolean }) {
  const height = historian ? 2.35 : 1.8;
  const rows = historian ? 7 : 5;
  const ports = useMemo(
    () =>
      Array.from({ length: rows }, (_, row) =>
        Array.from(
          { length: 6 },
          (_, port) => [-0.26 + port * 0.1, 0.4 + row * 0.25, 0.56] as ScenePoint
        )
      ).flat(),
    [rows]
  );
  const leds = useMemo(
    () => ports.map((point) => [point[0] + 0.027, point[1] + 0.045, point[2] + 0.01] as ScenePoint),
    [ports]
  );
  return (
    <group>
      <MetalBox size={[0.92, height, 0.8]} position={[0, height / 2 + 0.08, 0]} dark />
      <MetalBox
        size={[0.8, height - 0.18, 0.08]}
        position={[0, height / 2 + 0.08, 0.44]}
        color="#5d6875"
      />
      {Array.from({ length: historian ? 7 : 5 }, (_, row) => (
        <group key={row} position={[0, 0.4 + row * 0.25, 0.51]}>
          <MetalBox size={[0.72, 0.2, 0.08]} position={[0, 0, 0]} dark radius={0.01} />
        </group>
      ))}
      <RepeatedParts positions={ports} size={[0.065, 0.06, 0.016]} />
      <RepeatedParts positions={leds} size={[0.017, 0, 0]} shape="led" color="#8fbba5" />
      <MetalBox size={[0.05, 0.36, 0.07]} position={[0.38, height / 2, 0.53]} />
      <PanelTexture kind="label" size={[0.64, 0.1]} position={[0, height - 0.04, 0.488]} />
      {[0, 1, 2].map((i) => (
        <Cable
          key={i}
          points={[
            [-0.23 + i * 0.15, 0.5, 0.6],
            [-0.25 + i * 0.15, 0.3, 0.7],
            [0.3, 0.14, 0.8],
            [0.8, 0.12, 1.2],
          ]}
          radius={0.013}
          color={i === 1 ? "#31495b" : "#1e2830"}
        />
      ))}
    </group>
  );
}

export function RemoteIo() {
  return (
    <group>
      <group position={[1.05, 0, -0.08]}>
        <MetalBox size={[1.1, 2.05, 0.82]} position={[0, 1.13, 0]} color="#9aa6af" />
        <MetalBox size={[1, 1.92, 0.045]} position={[0, 1.13, 0.44]} />
        <MetalBox size={[0.06, 0.36, 0.08]} position={[0.4, 1.1, 0.5]} dark />
        <PanelTexture kind="hmi" size={[0.5, 0.33]} position={[-0.06, 1.55, 0.47]} />
        <CabinetVents position={[0, 0.5, 0.48]} />
        <MetalBox size={[1.16, 0.15, 0.88]} position={[0, 0.1, 0]} dark />
      </group>
      <MetalBox size={[0.85, 1.65, 0.65]} position={[0, 0.91, 0]} color="#74818b" />
      <MetalBox size={[0.73, 1.48, 0.035]} position={[0, 0.93, 0.35]} dark />
      {Array.from({ length: 7 }, (_, i) => (
        <MetalBox
          key={i}
          size={[0.48, 0.018, 0.02]}
          position={[0, 0.6 + i * 0.075, 0.38]}
          color="#63737e"
          radius={0.003}
        />
      ))}
      <PanelTexture kind="label" size={[0.61, 0.11]} position={[0, 1.52, 0.375]} />
      <Indicator position={[0.22, 1.28, 0.39]} />
      <MetalBox size={[0.06, 0.24, 0.07]} position={[0.29, 0.92, 0.39]} />
      <MetalBox size={[0.95, 0.12, 0.75]} position={[0, 0.09, 0]} dark />
    </group>
  );
}

export function HmiStation() {
  const keys = useMemo(
    () =>
      Array.from(
        { length: 32 },
        (_, i) => [-0.32 + (i % 8) * 0.075, 1.326, 0.15 + Math.floor(i / 8) * 0.065] as ScenePoint
      ),
    []
  );
  return (
    <group rotation={[0, -0.25, 0]}>
      <MetalBox size={[0.8, 0.1, 0.65]} position={[0, 0.08, 0]} dark />
      <MetalBox size={[0.72, 1.15, 0.52]} position={[0, 0.65, -0.06]} color="#8e9ba7" />
      <MetalBox size={[0.63, 0.98, 0.025]} position={[0, 0.65, 0.22]} color="#667582" />
      <MetalBox size={[0.04, 0.25, 0.05]} position={[0.25, 0.77, 0.25]} dark />
      <group position={[0, 1.73, 0.1]} rotation={[-0.16, 0, 0]}>
        <MetalBox size={[1.18, 0.8, 0.18]} color="#a4b1bb" position={[0, 0, 0]} />
        <MetalBox size={[1.07, 0.68, 0.025]} dark position={[0, 0, 0.1]} />
        <PanelTexture kind="hmi" size={[0.99, 0.59]} position={[0, 0.015, 0.116]} />
        <Indicator position={[0.48, -0.34, 0.11]} />
      </group>
      <MetalBox size={[0.62, 0.06, 0.4]} position={[0, 1.28, 0.27]} dark />
      <RepeatedParts positions={keys} size={[0.052, 0.018, 0.045]} color="#85919b" />
      <mesh position={[0.22, 1.33, 0.28]}>
        <cylinderGeometry args={[0.048, 0.048, 0.05, 16]} />
        <meshStandardMaterial color="#b65d49" metalness={0.4} roughness={0.45} />
      </mesh>
      <Cable
        points={[
          [0, 1.5, -0.04],
          [0.1, 0.6, -0.1],
          [0.2, 0.15, -0.15],
          [-0.8, 0.12, -0.4],
        ]}
        radius={0.018}
      />
    </group>
  );
}

function CabinetVents({ position }: { position: ScenePoint }) {
  const positions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => [0, i * 0.035, 0] as ScenePoint),
    []
  );
  return (
    <group position={position}>
      <RepeatedParts positions={positions} size={[0.6, 0.012, 0.016]} />
    </group>
  );
}

function RobotLink({ from, to, radius }: { from: ScenePoint; to: ScenePoint; radius: number }) {
  const { midpoint, rotation, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const direction = b.clone().sub(a);
    return {
      midpoint: a.clone().add(b).multiplyScalar(0.5),
      rotation: new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        direction.clone().normalize()
      ),
      length: direction.length(),
    };
  }, [from, to]);
  return (
    <group position={midpoint} quaternion={rotation}>
      <MetalBox size={[radius * 1.5, length, radius * 1.6]} position={[0, 0, 0]} radius={0.09} />
      <MetalBox
        size={[radius * 0.9, length * 0.72, 0.02]}
        dark
        position={[0, 0, radius * 0.81]}
        radius={0.02}
      />
    </group>
  );
}

export function RobotArm({ animate }: { animate: boolean }) {
  const swivel = useRef<Group>(null);
  const elapsed = useRef(0);
  const bolts = useMemo(
    () =>
      [
        [0, 1.08, 0.42],
        [0.68, 2.65, 0.37],
      ].flatMap(([x, y, z]) =>
        Array.from(
          { length: 8 },
          (_, i) =>
            [
              x + Math.sin((i * Math.PI) / 4) * 0.23,
              y + Math.cos((i * Math.PI) / 4) * 0.23,
              z,
            ] as ScenePoint
        )
      ),
    []
  );
  useFrame((_, delta) => {
    if (!animate || !swivel.current) return;
    elapsed.current += Math.min(delta, 0.05);
    swivel.current.rotation.y = Math.sin(elapsed.current * 0.32) * 0.13;
  });
  return (
    <group position={[1.3, 0, -0.55]}>
      <MetalBox size={[1.25, 0.18, 1.15]} position={[0, 0.17, 0]} dark />
      <Cylinder position={[0, 0.4, 0]} radius={0.43} length={0.35} rotation={[0, 0, 0]} />
      <group ref={swivel}>
        <Cylinder position={[0, 0.68, 0]} radius={0.33} length={0.22} rotation={[0, 0, 0]} />
        <MetalBox size={[0.48, 0.46, 0.42]} position={[0, 0.95, 0]} />
        <Cylinder position={[0, 1.08, 0]} radius={0.34} length={0.7} />
        <Cylinder position={[0, 1.08, 0.38]} radius={0.28} length={0.08} dark />
        <Cylinder position={[0, 1.08, 0.43]} radius={0.16} length={0.03} />
        <RobotLink from={[0, 1.08, 0]} to={[0.68, 2.65, 0]} radius={0.3} />
        <Cylinder position={[0.68, 2.65, 0]} radius={0.3} length={0.62} />
        <Cylinder position={[0.68, 2.65, 0.34]} radius={0.27} length={0.07} dark />
        <Cylinder position={[0.68, 2.65, 0.39]} radius={0.15} length={0.025} />
        <RobotLink from={[0.68, 2.65, 0]} to={[1.4, 2.3, 1.1]} radius={0.24} />
        <RepeatedParts positions={bolts} size={[0.023, 0.032, 0]} shape="bolt" color="#aebcc6" />
        <mesh position={[1.4, 2.3, 1.1]} castShadow>
          <sphereGeometry args={[0.2, 24, 16]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <RobotLink from={[1.4, 2.3, 1.1]} to={[1.7, 1.65, 1.7]} radius={0.13} />
        <Cylinder
          position={[1.7, 1.52, 1.7]}
          radius={0.14}
          length={0.22}
          rotation={[0, 0, 0]}
          dark
        />
        <MetalBox size={[0.4, 0.12, 0.15]} position={[1.7, 1.38, 1.7]} />
        <MetalBox size={[0.27, 0.15, 0.23]} position={[1.7, 1.48, 1.7]} dark />
        <PanelTexture kind="label" size={[0.3, 0.08]} position={[0.08, 1.48, 0.255]} />
        {[-1, 1].map((sign) => (
          <MetalBox
            key={sign}
            size={[0.055, 0.23, 0.11]}
            position={[1.7 + sign * 0.14, 1.23, 1.7]}
            dark
            radius={0.01}
          />
        ))}
        <Cable
          points={[
            [-0.18, 0.7, -0.15],
            [-0.22, 1.4, -0.12],
            [0.46, 2.73, -0.1],
            [0.9, 2.8, 0.35],
            [1.4, 2.48, 1.15],
            [1.84, 1.6, 1.7],
          ]}
          radius={0.055}
        />
      </group>
    </group>
  );
}

function Workpiece({ offset, animate }: { offset: number; animate: boolean }) {
  const ref = useRef<Group>(null);
  const elapsed = useRef(offset);
  useFrame((_, delta) => {
    if (!animate || !ref.current) return;
    elapsed.current += Math.min(delta, 0.05) * 0.22;
    ref.current.position.x = ((elapsed.current + 6) % 12) - 6;
  });
  return (
    <group ref={ref} position={[offset, 1.11, 1.35]}>
      <MetalBox size={[0.85, 0.08, 0.74]} position={[0, 0, 0]} dark />
      {[-1, 1].map((sign) => (
        <MetalBox key={sign} size={[0.75, 0.19, 0.065]} position={[0, 0.13, sign * 0.26]} />
      ))}
      <MetalBox size={[0.4, 0.12, 0.35]} position={[0, 0.12, 0]} color="#87959f" />
    </group>
  );
}

export function Conveyor({ animate }: { animate: boolean }) {
  const legs = useMemo(
    () => [-5.4, -1.8, 1.8, 5.4].flatMap((x) => [0.83, 1.87].map((z) => [x, 0.5, z] as ScenePoint)),
    []
  );
  const feet = useMemo(() => legs.map(([x, , z]) => [x, 0.1, z] as ScenePoint), [legs]);
  const braces = useMemo(
    () => [-5.4, -1.8, 1.8, 5.4].map((x) => [x, 0.42, 1.35] as ScenePoint),
    []
  );
  const guards = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => -6.4 + i * 0.47).flatMap((x) =>
        [0.69, 2.01].map((z) => [x, 1.12, z] as ScenePoint)
      ),
    []
  );
  const axleCaps = useMemo(
    () =>
      Array.from({ length: 59 }, (_, i) => -6.55 + i * 0.226).flatMap((x) =>
        [0.73, 1.97].map((z) => [x, 0.97, z] as ScenePoint)
      ),
    []
  );
  const fixings = useMemo(
    () => guards.map(([x, , z]) => [x, 0.87, z + 0.07] as ScenePoint),
    [guards]
  );
  return (
    <group position={[0, 0, -1.35]}>
      <RepeatedParts positions={legs} size={[0.12, 0.85, 0.13]} color="#85929c" />
      <RepeatedParts positions={feet} size={[0.28, 0.06, 0.28]} />
      <RepeatedParts positions={braces} size={[0.12, 0.1, 1.18]} color="#85929c" />
      <RepeatedParts positions={guards} size={[0.04, 0.24, 0.05]} color="#71808d" />
      <RepeatedParts positions={axleCaps} size={[0.033, 0.06, 0]} shape="roller" color="#34404b" />
      <RepeatedParts positions={fixings} size={[0.026, 0.025, 0]} shape="bolt" color="#71808d" />
      {[-6.4, -3.2, 0, 3.2, 6.4].map((x) => (
        <MetalBox key={x} size={[0.06, 0.36, 1.2]} position={[x, 0.63, 1.35]} dark />
      ))}
      {[0.69, 2.01].map((z) => (
        <group key={z}>
          <MetalBox size={[13.4, 0.2, 0.12]} position={[0, 0.96, z]} />
          <MetalBox size={[13.4, 0.22, 0.1]} position={[0, 0.72, z]} dark />
          <MetalBox size={[13.2, 0.03, 0.04]} position={[0, 1.25, z]} color="#8c9da9" />
        </group>
      ))}
      <ConveyorRollers />
      <Cylinder position={[-5.75, 0.82, 2.22]} radius={0.21} length={0.43} dark />
      <MetalBox size={[0.45, 0.35, 0.34]} position={[-5.75, 0.84, 1.99]} />
      <MetalBox size={[0.48, 0.43, 0.22]} position={[-4.95, 0.55, 2.02]} dark />
      <Indicator position={[-4.83, 0.64, 2.14]} />
      {[-4, -1.75, 1.2, 4.1].map((offset) => (
        <Workpiece key={offset} offset={offset} animate={animate} />
      ))}
    </group>
  );
}

export function FactoryHall() {
  const columns = useMemo(
    () => [-12, -8, -4, 0, 4, 8, 12].map((x) => [x, 3.3, -7] as ScenePoint),
    []
  );
  const beams = useMemo(() => columns.map(([x]) => [x, 6.2, -3] as ScenePoint), [columns]);
  const mullions = useMemo(
    () => columns.map(([x]) => [x + 1.9, 3.7, -9.6] as ScenePoint),
    [columns]
  );
  const railPosts = useMemo(
    () => [-10, -6, -2, 2, 6, 10].map((x) => [x, 3.1, -6.4] as ScenePoint),
    []
  );
  return (
    <group>
      <MetalBox size={[40, 7, 0.4]} position={[0, 3.5, -10]} color="#252f3b" />
      <RepeatedParts positions={columns} size={[0.25, 6.5, 0.3]} color="#56616b" />
      <RepeatedParts positions={beams} size={[0.12, 0.1, 12]} />
      <RepeatedParts positions={mullions} size={[0.08, 1.9, 0.1]} color="#566574" />
      <RepeatedParts positions={railPosts} size={[0.035, 1, 0.035]} color="#84919c" />
      {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
        <group key={x}>
          <MetalBox size={[3.6, 1.9, 0.08]} position={[x + 1.9, 3.7, -9.7]} color="#131d29" />
          <mesh position={[x + 1, 5.9, -3]}>
            <boxGeometry args={[1.8, 0.025, 0.25]} />
            <meshBasicMaterial color="#d8e5f5" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <MetalBox size={[28, 0.18, 1.1]} position={[0, 2.6, -7]} dark />
      {[2.9, 3.6].map((y) => (
        <MetalBox key={y} size={[28, 0.035, 0.035]} position={[0, y, -6.4]} color="#7c8791" />
      ))}
      {[-1.3, 1.3].map((x) => (
        <group key={x} position={[x + 2, 3.65, -6.3]}>
          <MetalBox size={[2.45, 1.45, 0.15]} position={[0, 0, 0]} dark />
          <PanelTexture kind="hmi" size={[2.3, 1.3]} position={[0, 0, 0.09]} />
        </group>
      ))}
      {[-8.8, 7.6].map((x) => (
        <group key={x} position={[x, 0, -2.6]}>
          <MetalBox size={[2.2, 1.9, 1.3]} position={[0, 1.05, 0]} color="#747f89" />
          <MetalBox size={[1.9, 1.55, 0.06]} position={[0, 1.1, 0.7]} dark />
          {[-0.6, 0, 0.6].map((y) => (
            <MetalBox
              key={y}
              size={[1.7, 0.07, 0.09]}
              position={[0, y + 1.1, 0.76]}
              color="#727e87"
            />
          ))}
        </group>
      ))}
      <Cable
        points={[
          [-12, 0.1, -4],
          [-6, 0.1, -4.1],
          [2, 0.1, -4.1],
          [10, 0.1, -4],
        ]}
        radius={0.045}
      />
    </group>
  );
}

export function FactoryDetails() {
  const fence = useMemo(() => {
    const points: Vector3[] = [];
    const segment = (a: ScenePoint, b: ScenePoint) =>
      points.push(new Vector3(...a), new Vector3(...b));
    for (let x = -0.2; x <= 4.6; x += 0.15) segment([x, 0.3, -2.2], [x, 2.35, -2.2]);
    for (let z = -2.2; z <= 1.6; z += 0.15) segment([4.6, 0.3, z], [4.6, 2.35, z]);
    for (let y = 0.3; y <= 2.35; y += 0.15) {
      segment([-0.2, y, -2.2], [4.6, y, -2.2]);
      segment([4.6, y, -2.2], [4.6, y, 1.6]);
    }
    return new BufferGeometry().setFromPoints(points);
  }, []);
  const posts = useMemo(
    () =>
      [
        [-0.2, 1.3, -2.2],
        [2.2, 1.3, -2.2],
        [4.6, 1.3, -2.2],
        [4.6, 1.3, 1.6],
      ] as ScenePoint[],
    []
  );
  const rails = useMemo(
    () =>
      [
        [2.2, 0.25, -2.2],
        [2.2, 2.4, -2.2],
      ] as ScenePoint[],
    []
  );
  useEffect(() => () => fence.dispose(), [fence]);
  return (
    <group>
      <lineSegments geometry={fence}>
        <lineBasicMaterial color="#71808d" transparent opacity={0.38} />
      </lineSegments>
      <RepeatedParts positions={posts} size={[0.065, 2.4, 0.065]} color="#83919c" />
      <RepeatedParts positions={rails} size={[4.8, 0.045, 0.045]} color="#83919c" />
      {[0.25, 2.4].map((y) => (
        <MetalBox key={y} size={[0.045, 0.045, 3.8]} position={[4.6, y, -0.3]} color="#83919c" />
      ))}
      {[-4.8, -4.55].map((x, index) => (
        <Cable
          key={x}
          points={[
            [x, 0.2, -1.7],
            [x, 3.5, -1.7],
            [x, 3.8, -2],
            [3.8, 3.8, -2],
          ]}
          radius={0.04}
          color={index ? "#768997" : "#3d4a56"}
        />
      ))}
      <MetalBox size={[13.8, 0.09, 0.3]} position={[0, 0.18, -4.1]} dark />
      <MetalBox size={[0.05, 0.2, 0.3]} position={[-3.3, 0.28, -4.1]} color="#8c9daa" />
    </group>
  );
}

export function EquipmentShadows() {
  const mesh = useRef<InstancedMesh>(null);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
    gradient.addColorStop(0, "rgba(0,0,0,.8)");
    gradient.addColorStop(0.45, "rgba(0,0,0,.48)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useLayoutEffect(() => {
    const instance = mesh.current;
    if (!instance) return;
    const shadows = [
      [-5.9, 0.2, 4.8, 2.4],
      [-3.7, -0.15, 1.9, 1.6],
      [-3.3, -3.4, 2, 1.8],
      [-0.8, -3.6, 2, 1.8],
      [1.5, -0.55, 2.5, 2.3],
      [6.6, -0.3, 3.8, 2.2],
      [0, 1.35, 15, 2.5],
    ];
    const matrix = new Matrix4();
    shadows.forEach(([x, z, width, depth], i) => {
      matrix
        .makeRotationX(-Math.PI / 2)
        .scale(new Vector3(width, depth, 1))
        .setPosition(x, 0.07, z);
      instance.setMatrixAt(i, matrix);
    });
    instance.instanceMatrix.needsUpdate = true;
    instance.computeBoundingSphere();
  }, []);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 7]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        opacity={0.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export function FactoryFloor({ low }: { low: boolean }) {
  const texture = useMemo(() => {
    const data = new Uint8Array(128 * 128 * 4);
    for (let i = 0; i < 128 * 128; i++) {
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const value = 185 + (seed - Math.floor(seed)) * 24;
      data[i * 4] = value;
      data[i * 4 + 1] = value;
      data[i * 4 + 2] = value;
      data[i * 4 + 3] = 255;
    }
    const map = new DataTexture(data, 128, 128);
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.set(16, 16);
    map.magFilter = map.minFilter = LinearFilter;
    map.needsUpdate = true;
    return map;
  }, []);
  const grid = useMemo(() => {
    const points: Vector3[] = [];
    for (let i = -20; i <= 20; i++) {
      points.push(
        new Vector3(i * 1.5, 0.063, -30),
        new Vector3(i * 1.5, 0.063, 30),
        new Vector3(-30, 0.063, i * 1.5),
        new Vector3(30, 0.063, i * 1.5)
      );
    }
    return new BufferGeometry().setFromPoints(points);
  }, []);
  useEffect(
    () => () => {
      texture.dispose();
      grid.dispose();
    },
    [texture, grid]
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.058, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        {low ? (
          <meshStandardMaterial
            color="#1c252e"
            metalness={0.4}
            roughness={0.42}
            roughnessMap={texture}
          />
        ) : (
          <MeshReflectorMaterial
            color="#202b35"
            roughness={0.45}
            roughnessMap={texture}
            metalness={0.48}
            resolution={256}
            blur={[120, 40]}
            mixBlur={0.8}
            mixStrength={0.7}
            mirror={0.28}
            depthScale={0.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
          />
        )}
      </mesh>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#101922" transparent opacity={0.25} />
      </lineSegments>
      {[-3.8, 3.8].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.064, z]}>
          <planeGeometry args={[19, 0.028]} />
          <meshStandardMaterial color="#8a7855" />
        </mesh>
      ))}
    </group>
  );
}
