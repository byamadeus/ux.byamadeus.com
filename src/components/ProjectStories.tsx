"use client";

import { useState, useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

export interface StoryVideo {
  type: "local" | "youtube" | "vimeo" | "mux" | "iframe";
  src: string;         // playback ID for mux, video ID for youtube/vimeo, URL for local/iframe
  fit?: "cover" | "contain"; // default: cover. "contain" for portrait/mobile recordings
  aspectRatio?: string;      // e.g. "9/16" (default when contain), "4/3", "16/9"
  thumbnail?: string;        // override blurred bg image URL (auto-derived for mux/youtube)
}

export interface Story {
  id: string;
  title: string;
  subtitle?: string;   // shown with LOG: prefix
  url?: string;        // shown as Visit link
  tags?: string[];
  progress?: number;   // 0-100
  gradient?: string;   // CSS gradient, bg fallback
  video?: StoryVideo;
  duration?: number;   // ms before auto-advance
}

interface ProjectStoriesProps {
  stories: Story[];
  defaultDuration?: number;
  onClose?: () => void;
}

function deriveThumbnail(video: StoryVideo): string | null {
  if (video.thumbnail) return video.thumbnail;
  if (video.type === "mux") return `https://image.mux.com/${video.src}/thumbnail.jpg`;
  if (video.type === "youtube") return `https://img.youtube.com/vi/${video.src}/maxresdefault.jpg`;
  return null;
}

function VideoPlayer({ video, gradient }: { video: StoryVideo; gradient?: string }) {
  const [loaded, setLoaded] = useState(false);

  const contain = video.fit === "contain";
  const aspectRatio = video.aspectRatio ?? (contain ? "9/16" : "16/9");
  const thumbnail = contain ? deriveThumbnail(video) : null;

  const abs: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: "none",
    pointerEvents: "none",
    display: "block",
  };

  const fade: React.CSSProperties = {
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.5s ease",
  };

  // Blurred background — for contain mode, always shown; fades out as video loads
  const blurredBg = contain ? (
    <div style={{ ...abs, overflow: "hidden" }}>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          style={{
            width: "110%",
            height: "110%",
            objectFit: "cover",
            marginLeft: "-5%",
            marginTop: "-5%",
            filter: "blur(28px) brightness(0.42) saturate(1.4)",
          }}
        />
      ) : (
        <div style={{ ...abs, background: gradient, filter: "brightness(0.5)" }} />
      )}
    </div>
  ) : null;

  const mediaStyle: React.CSSProperties = { width: "100%", height: "100%", border: "none", pointerEvents: "none", display: "block" };

  function renderMedia() {
    if (video.type === "local") {
      return (
        <video
          src={video.src}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setLoaded(true)}
          style={{ ...mediaStyle, objectFit: "cover", ...fade }}
        />
      );
    }
    if (video.type === "mux") {
      return (
        <MuxPlayer
          playbackId={video.src}
          autoPlay="muted"
          muted
          loop
          onCanPlay={() => setLoaded(true)}
          style={{ ...mediaStyle, ...fade }}
        />
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
        onLoad={() => setLoaded(true)}
        style={{ ...mediaStyle, ...fade }}
      />
    );
  }

  if (contain) {
    return (
      <>
        {blurredBg}
        <div style={{ ...abs, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", aspectRatio, position: "relative", overflow: "hidden", flexShrink: 0 }}>
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

export function ProjectStories({ stories, defaultDuration = 5000, onClose }: ProjectStoriesProps) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

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
    remainingRef.current = stories[newIdx].duration ?? defaultDuration;
    startRef.current = Date.now();
    setIdx(newIdx);
    setAnimKey((k) => k + 1);
  }

  function startTimer(remaining: number) {
    clearTimer();
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => { goTo(idxRef.current + 1); }, remaining);
  }

  useEffect(() => {
    pausedRef.current = false;
    setPaused(false);
    remainingRef.current = duration;
    startTimer(duration);
    return clearTimer;
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const x = e.clientX - rect.left;
      if (x < rect.width / 3) goTo(idxRef.current - 1);
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

      {/* Video layer */}
      {story.video && (
        <div className="absolute inset-0">
          <VideoPlayer key={story.video.src} video={story.video} gradient={story.gradient} />
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
              {i === idx && (
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
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-10 pt-20 flex flex-col gap-2.5">
        {/* Tags */}
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

        {/* Title */}
        <h2 className="text-4xl font-semibold text-white leading-tight tracking-tight text-left">
          {story.title}
        </h2>

        {/* Log entry + Visit link — same row */}
        {(story.subtitle || story.url) && (
          <div className="flex items-baseline justify-between gap-4">
            {story.subtitle && (
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
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

        {/* Progress bar */}
        {story.progress !== undefined && (
          <div className="mt-1">
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
