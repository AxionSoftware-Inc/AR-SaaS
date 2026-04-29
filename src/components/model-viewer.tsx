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

  useEffect(() => {
    import("@google/model-viewer").then(() => setIsReady(true));
  }, []);

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
