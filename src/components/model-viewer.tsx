"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type ModelViewerProps = {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
};

export function ModelViewer({ src, alt, poster, className, style }: ModelViewerProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setHasTimedOut(true), 5000);

    import("@google/model-viewer")
      .then(() => setIsReady(true))
      .catch(() => setHasTimedOut(true))
      .finally(() => window.clearTimeout(timeoutId));

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (hasTimedOut && !isReady) {
    return (
      <div className={`${className ?? ""} flex items-center justify-center bg-white p-5 text-center`} style={style}>
        <div>
          <p className="text-sm font-semibold text-zinc-950">{alt}</p>
          <p className="mt-2 text-sm text-zinc-500">
            3D viewer bu browserda sekin yuklandi. GLB model fayl ochiq turibdi.
          </p>
          <a
            href={src}
            className="mt-4 inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white"
          >
            Model faylni ochish
          </a>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className={`${className ?? ""} flex items-center justify-center bg-white text-sm text-zinc-500`} style={style}>
        3D viewer loading
      </div>
    );
  }

  return (
    <model-viewer
      src={src}
      poster={poster}
      alt={alt}
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      environment-image="neutral"
      exposure="0.9"
      interaction-prompt="auto"
      touch-action="pan-y"
      className={className}
      style={style}
    />
  );
}
