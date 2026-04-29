"use client";

import type { ModelKind } from "@/lib/demo-data";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type ArCanvasProps = {
  kind: ModelKind;
  color: string;
  label?: string;
};

function makeModel(kind: ModelKind, color: string) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: kind === "lamp" ? 0.45 : 0.08,
  });
  const dark = new THREE.MeshStandardMaterial({ color: "#222222", roughness: 0.4 });
  const wood = new THREE.MeshStandardMaterial({ color: "#9a5b2f", roughness: 0.7 });

  if (kind === "chair") {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.28, 1.4), material);
    seat.position.y = 0.2;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 0.24), material);
    back.position.set(0, 1.02, -0.58);
    back.rotation.x = -0.12;
    group.add(seat, back);

    [-0.62, 0.62].forEach((x) => {
      [-0.45, 0.45].forEach((z) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 1.1), wood);
        leg.position.set(x, -0.45, z);
        group.add(leg);
      });
    });
  }

  if (kind === "table") {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.16, 64), wood);
    top.position.y = 0.65;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.15, 32), dark);
    base.position.y = 0.05;
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 48), dark);
    foot.position.y = -0.55;
    group.add(top, base, foot);
  }

  if (kind === "lamp") {
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.8, 0.7, 48), material);
    shade.position.y = 1.05;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.7, 24), dark);
    pole.position.y = 0.05;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.08, 40), dark);
    base.position.y = -0.82;
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: "#fde68a", emissive: "#facc15", emissiveIntensity: 0.7 }),
    );
    bulb.position.y = 0.82;
    group.add(shade, pole, base, bulb);
  }

  group.position.y = 0.05;
  return group;
}

export function ArCanvas({ kind, color, label = "3D preview" }: ArCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8fafc");

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(3, 2.3, 4);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight("#ffffff", "#94a3b8", 2.2);
    const key = new THREE.DirectionalLight("#ffffff", 3.4);
    key.position.set(3, 5, 4);
    scene.add(hemi, key);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 64),
      new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.85 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.88;
    scene.add(floor);

    const model = makeModel(kind, color);
    scene.add(model);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    let frameId = 0;
    const animate = () => {
      model.rotation.y += 0.007;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [kind, color]);

  return (
    <div
      ref={mountRef}
      aria-label={label}
      className="h-full min-h-[320px] w-full overflow-hidden rounded-lg border border-zinc-200 bg-slate-50"
    />
  );
}
