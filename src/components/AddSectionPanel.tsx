"use client";

import { Type, ImageIcon, Play, BarChart3, X } from "lucide-react";
import { CaseStudySection } from "@/lib/content";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (section: CaseStudySection) => void;
}

const TEMPLATES: Array<{
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  section: CaseStudySection;
}> = [
  {
    type: "text",
    label: "Text",
    description: "Heading + body copy",
    icon: <Type size={18} strokeWidth={1.75} />,
    section: {
      type: "text",
      heading: "New Section",
      body: "Add your content here.",
    },
  },
  {
    type: "image",
    label: "Image",
    description: "Image grid — drag in WebP/PNG/JPG",
    icon: <ImageIcon size={18} strokeWidth={1.75} />,
    section: {
      type: "image",
      heading: "",
      items: [],
    },
  },
  {
    type: "video",
    label: "Video / Lottie",
    description: "MUX video or Lottie animation",
    icon: <Play size={18} strokeWidth={1.75} />,
    section: {
      type: "video",
      heading: "",
      items: [{ muxId: "", caption: "" }],
    },
  },
  {
    type: "metrics",
    label: "Metrics",
    description: "Impact items — label + body",
    icon: <BarChart3 size={18} strokeWidth={1.75} />,
    section: {
      type: "metrics",
      heading: "Impact",
      items: [
        { label: "Metric", body: "Description of this outcome." },
        { label: "Metric", body: "Description of this outcome." },
        { label: "Metric", body: "Description of this outcome." },
      ],
    },
  },
];

export function AddSectionPanel({ open, onClose, onAdd }: Props) {
  function handleAdd(section: CaseStudySection) {
    onAdd(JSON.parse(JSON.stringify(section)));
    onClose();
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-[10000] transition-transform duration-300 ease-out"
        style={{ transform: open ? "translateY(0)" : "translateY(100%)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Add section"
      >
        <div
          className="mx-auto max-w-lg rounded-t-2xl border border-black/8 p-6 pb-10"
          style={{ background: "#f8f8f6" }}
        >
          {/* Handle */}
          <div className="flex justify-center mb-5">
            <div className="w-10 h-1 rounded-full bg-black/15" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-black/30 mb-0.5">
                Web builder
              </p>
              <h2 className="text-lg font-semibold text-black/90">
                Add Section
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/8 text-black/40 hover:text-black/70 transition-all"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Templates */}
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.type}
                onClick={() => handleAdd(t.section)}
                className="flex flex-col gap-3 p-4 rounded-xl border border-black/8 bg-white hover:border-black/20 hover:shadow-sm text-left transition-all"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/4 text-black/50">
                  {t.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-black/80">
                    {t.label}
                  </p>
                  <p className="text-xs text-black/45 leading-relaxed mt-0.5">
                    {t.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
