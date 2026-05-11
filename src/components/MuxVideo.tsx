"use client";

import MuxPlayer from "@mux/mux-player-react";

interface MuxVideoProps {
  playbackId: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function MuxVideo({
  playbackId,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
}: MuxVideoProps) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      autoPlay={autoPlay ? "muted" : undefined}
      muted={muted}
      loop={loop}
      className={className}
      style={{ width: "100%", display: "block", aspectRatio: "16/9" }}
    />
  );
}
