"use client";

import { useState, useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

export interface StoryVideo {
  type: "local" | "youtube" | "vimeo" | "mux" | "iframe";
  src: string;
  fit?: "cover" | "contain";
  aspectRatio?: string;
  thumbnail?: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle?: string;
  url?: string;
  tags?: string[];
  progress?: number;
  gradient?: string;
  video?: StoryVideo;
  duration?: number;
}

interface ProjectStoriesProps {
  stories: Story[];
  defaultDuration?: number;
  onClose?: () => void;
  paused?: boolean;
}

function deriveThumbnail(video: StoryVideo): string | null {
  if (video.thumbnail) return video.thumbnail;
  if (video.type === "mux") return `https://image.mux.com/${video.src}/thumbnail.jpg`;
  if (video.type === "youtube") return `https://img.youtube.com/vi/${video.src}/maxresdefault.jpg`;
  return null;
}

function VideoPlayer({
  video,
  gradient,
  onLoaded,
}: {
  video: StoryVideo;
  gradient?: string;
  onLoaded?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // iOS Safari: React's muted prop doesn't always set the HTML attribute.
    // Find the underlying <video> and set it imperatively.
    const vid = containerRef.current?.querySelector("video");
    if (vid) vid.muted = true;

    fallbackRef.current = setTimeout(() => onLoaded?.(), 3000);
    return () => { if (fallbackRef.current) clearTimeout(fallbackRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const contain = video.fit === "contain";
  const aspectRatio = video.aspectRatio ?? (contain ? "9/16" : "16/9");
  const thumbnail = contain ? deriveThumbnail(video) : null;

  const abs: React.CSSProperties = {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    border: "none", pointerEvents: "none", display: "block",
  };

  const blurredBg = contain ? (
    <div style={{ ...abs, overflow: "hidden" }}>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          style={{
            width: "110%", height: "110%", objectFit: "cover",
            marginLeft: "-5%", marginTop: "-5%",
            filter: "blur(28px) brightness(0.42) saturate(1.4)",
          }}
        />
      ) : (
        <div style={{ ...abs, background: gradient, filter: "brightness(0.5)" }} />
      )}
    </div>
  ) : null;

  const mediaStyle: React.CSSProperties = {
    width: "100%", height: "100%", border: "none", pointerEvents: "none", display: "block",
  };

  function markLoaded() {
    if (fallbackRef.current) { clearTimeout(fallbackRef.current); fallbackRef.current = null; }
    onLoaded?.();
  }

  function renderMedia() {
    if (video.type === "local") {
      return (
        <video
          src={video.src}
          autoPlay muted loop playsInline
          preload="auto"
          onLoadedMetadata={markLoaded}
          onCanPlay={markLoaded}
          style={{ ...mediaStyle, objectFit: "cover" }}
        />
      );
    }
    if (video.type === "mux") {
      return (
        <div ref={containerRef} className="story-mux" style={{ width: "100%", height: "100%", display: "flex" }}>
          <MuxPlayer
            playbackId={video.src}
            streamType="on-demand"
            autoPlay="muted"
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={markLoaded}
            onCanPlay={markLoaded}
            style={{
              width: "100%", height: "100%",
              display: "block", border: "none", pointerEvents: "none", flexShrink: 0,
            } as React.CSSProperties & Record<string, string>}
          />
        </div>
      );
    }
    let src = video.src;
    if (video.type === "youtube") {
      src = `https://www.youtube.com/embed/${video.src}?autoplay=1&mute=1&loop=1&playlist=${video.src}&controls=0&rel=0&modestbranding=1`;
    } else if (video.type === "vimeo") {
      src = `https://player.vimeo.com/video/${video.src}?autoplay=1&muted=1&loop=1&background=1`;
    }
    return (
      <iframe
        src={src}
        allow="autoplay; encrypted-media"
        onLoad={markLoaded}
        style={mediaStyle}
      />
    );
  }

  if (contain) {
    return (
      <>
        {blurredBg}
        <div style={{ ...abs, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto",
            aspectRatio, position: "relative", overflow: "hidden", flexShrink: 0,
          }}>
            {renderMedia()}
          </div>
        </div>
      </>
    );
  }
  return <div style={abs}>{renderMedia()}</div>;
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex items-center w-full font-mono text-xs leading-none gap-0.5 select-none">
      <span style={{ color: "rgba(255,255,255,0.25)" }}>[</span>
      <div className="flex flex-1 overflow-hidden">
        <div className="overflow-hidden whitespace-nowrap" style={{ width: `${progress}%`, color: "rgba(255,255,255,0.65)" }}>
          {"#".repeat(500)}
        </div>
        <div className="overflow-hidden whitespace-nowrap" style={{ width: `${100 - progress}%`, color: "rgba(255,255,255,0.18)" }}>
          {"-".repeat(500)}
        </div>
      </div>
      <span style={{ color: "rgba(255,255,255,0.25)" }}>]</span>
      <span className="ml-2 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{progress}%</span>
    </div>
  );
}

export function ProjectStories({
  stories,
  defaultDuration = 5000,
  onClose,
  paused: externalPaused = false,
}: ProjectStoriesProps) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [videoReady, setVideoReady] = useState(!stories[0]?.video);

  const idxRef = useRef(0);
  idxRef.current = idx;

  const remainingRef = useRef(defaultDuration);
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const downTimeRef = useRef<number | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const story = stories[idx];
  const duration = story?.duration ?? defaultDuration;

  function clearTimer() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  function goTo(newIdx: number) {
    if (newIdx >= stories.length) { onClose?.(); return; }
    if (newIdx < 0) return;
    clearTimer();
    const hasVideo = !!stories[newIdx].video;
    setVideoReady(!hasVideo);
    setIdx(newIdx);
    setAnimKey((k) => k + 1);
  }

  function startTimer(remaining: number) {
    clearTimer();
    if (externalPaused) return;
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => { goTo(idxRef.current + 1); }, remaining);
  }

  // Start timer only when video is ready
  useEffect(() => {
    if (!videoReady || externalPaused) return;
    remainingRef.current = duration;
    startTimer(duration);
    return clearTimer;
  }, [videoReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (externalPaused) {
      clearTimer();
    } else if (videoReady) {
      startTimer(remainingRef.current);
    }
  }, [externalPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  function pauseStory() {
    if (pausedRef.current) return;
    pausedRef.current = true;
    setPaused(true);
    const elapsed = Date.now() - startRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    clearTimer();
  }

  function resumeStory() {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    setPaused(false);
    startTimer(remainingRef.current);
  }

  function handlePointerDown() {
    downTimeRef.current = Date.now();
    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      pauseStory();
    }, 150);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
    const downTime = downTimeRef.current ?? Date.now();
    const held = Date.now() - downTime > 150;
    downTimeRef.current = null;
    if (held) {
      resumeStory();
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      if (e.clientX - rect.left < rect.width / 3) goTo(idxRef.current - 1);
      else goTo(idxRef.current + 1);
    }
  }

  function handlePointerLeave() {
    if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
    resumeStory();
  }

  if (!story) return null;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ borderRadius: "inherit" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: story.gradient ?? "linear-gradient(150deg, #1a1a2e 0%, #16213e 100%)" }}
      />

      {/* Video layer — always opacity 1, gradient shows through until video fires onLoaded */}
      {story.video && (
        <div className="absolute inset-0" style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.5s ease" }}>
          <VideoPlayer
            key={story.video.src}
            video={story.video}
            gradient={story.gradient}
            onLoaded={() => setVideoReady(true)}
          />
        </div>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 22%, transparent 50%, rgba(0,0,0,0.8) 100%)" }}
      />

      {/* Story progress bars + close */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="flex flex-1 items-center gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.28)" }}>
              {i < idx && <div className="h-full w-full rounded-full bg-white" />}
              {/* Only animate when video is ready */}
              {i === idx && videoReady && !externalPaused && (
                <div
                  key={animKey}
                  className="h-full rounded-full bg-white"
                  style={{
                    animation: `storyProgress ${duration}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={() => onClose?.()}
          className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 z-30"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
          aria-label="Close"
        >
          <X size={16} strokeWidth={2.5} className="text-white" />
        </button>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-10 pt-20 flex flex-col gap-2.5 items-start">
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-0.5">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(4px)", color: "rgba(255,255,255,0.75)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-4xl font-semibold text-white leading-tight tracking-tight text-left w-full">
          {story.title}
        </h2>

        {(story.subtitle || story.url) && (
          <div className="flex items-start justify-between gap-4 w-full">
            {story.subtitle && (
              <p className="text-sm leading-relaxed text-left" style={{ color: "rgba(255,255,255,0.55)" }}>
                <span
                  className="font-mono tracking-widest mr-2"
                  style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}
                >
                  LOG:
                </span>
                {story.subtitle}
              </p>
            )}
            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Visit <ExternalLink size={11} strokeWidth={2.5} />
              </a>
            )}
          </div>
        )}

        {story.progress !== undefined && (
          <div className="mt-1 w-full">
            <ProgressBar progress={story.progress} />
          </div>
        )}
      </div>

      {/* Pause indicator */}
      {paused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
          >
            <div className="flex gap-1.5">
              <div className="w-[3px] h-6 bg-white rounded-full" />
              <div className="w-[3px] h-6 bg-white rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
