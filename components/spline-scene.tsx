"use client";

import dynamic from "next/dynamic";

// Dynamically import Spline with SSR disabled so WebGL loads purely on the client
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

interface SplineSceneProps {
  /** The public URL exported from your Spline scene */
  scene: string;
  className?: string;
}

export function SplineScene({
  scene,
  className = "h-[500px] w-full",
}: SplineSceneProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Spline scene={scene} />
    </div>
  );
}
