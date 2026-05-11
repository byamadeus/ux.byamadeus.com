"use client";

import { useState, useEffect } from "react";
import { ProjectStories, type Story } from "./ProjectStories";
import projectsData from "../../content/projects.json";

interface ProjectData {
  label: string;
  url?: string | null;
  tags: string[];
  progress: number;
  milestone: string;
  gradient?: string;
  video?: {
    type: "local" | "youtube" | "vimeo" | "mux" | "iframe";
    src: string;
    fit?: "cover" | "contain";
    aspectRatio?: string;
    thumbnail?: string;
  };
  duration?: number;
}

const STORIES: Story[] = (projectsData.projects as ProjectData[]).map((p) => ({
  id: p.label,
  title: p.label,
  subtitle: p.milestone,
  url: p.url ?? undefined,
  tags: p.tags,
  progress: p.progress,
  gradient: p.gradient,
  video: p.video,
  duration: p.duration ?? 6000,
}));

export function ProjectDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* Trigger pill */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 text-sm font-medium text-black/60 hover:text-black hover:border-black/20 hover:bg-black/4 transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.6)" }}
        aria-label="Open AI-enabled projects"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        {STORIES.length} AI-enabled projects
      </button>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9999]"
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-modal="true"
        role="dialog"
        aria-label="AI projects"
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
          style={{ opacity: open ? 1 : 0 }}
        />

        {/* Story panel — always mounted so iOS autoplay window isn't missed */}
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden"
          style={{
            top: "56px",
            borderRadius: "24px 24px 0 0",
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <ProjectStories
            stories={STORIES}
            defaultDuration={6000}
            onClose={() => setOpen(false)}
            paused={!open}
          />
        </div>
      </div>
    </>
  );
}
