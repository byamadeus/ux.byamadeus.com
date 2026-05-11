"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MuxVideo } from "@/components/MuxVideo";
import { LottiePlayer } from "@/components/LottiePlayer";
import { EditableText } from "@/components/EditableText";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { useEditContext } from "@/lib/edit-context";
import { FilmIcon } from "lucide-react";
import { type CaseStudySection } from "@/lib/content";

interface Props {
  section: CaseStudySection;
  file: string;
  basePath: string;
  slug?: string;
  onFieldChange?: (field: string, value: string) => void;
  onAddImage?: (src: string) => void;
  onRemoveImage?: (itemIdx: number) => void;
  onUpdateItem?: (itemIdx: number, field: string, value: string) => void;
  onAddVideoSlot?: () => void;
}

export function SectionRenderer({
  section,
  file,
  basePath,
  slug,
  onFieldChange,
  onAddImage,
  onRemoveImage,
  onUpdateItem,
  onAddVideoSlot,
}: Props) {
  const { editing } = useEditContext();

  if (section.type === "text") {
    return (
      <section className="w-full max-w-[800px] mx-auto flex flex-col gap-4">
        {section.heading !== undefined && (
          <EditableText
            file={file}
            contentPath={`${basePath}.heading`}
            tag="h2"
            className="text-xl font-semibold text-black/80"
            onChange={(v) => onFieldChange?.("heading", v)}
          >
            {section.heading}
          </EditableText>
        )}
        {section.body !== undefined && (
          <EditableText
            file={file}
            contentPath={`${basePath}.body`}
            tag="p"
            className="text-lg text-black/70 leading-relaxed"
            onChange={(v) => onFieldChange?.("body", v)}
          >
            {section.body}
          </EditableText>
        )}
      </section>
    );
  }

  if (section.type === "text-image") {
    return (
      <section className="w-full flex flex-col gap-10">
        <div className="w-full max-w-[1200px] mx-auto">
          {section.image ? (
            <img
              src={section.image}
              alt=""
              className="w-full aspect-[16/9] object-cover rounded-2xl"
              style={{ objectPosition: section.imagePosition ?? "center" }}
            />
          ) : (
            <div className="w-full aspect-[16/9] rounded-2xl bg-black/5" />
          )}
        </div>
        <div className="w-full max-w-[800px] mx-auto flex flex-col gap-3">
          {section.heading !== undefined && (
            <EditableText
              file={file}
              contentPath={`${basePath}.heading`}
              tag="h2"
              className="text-xl font-semibold text-black/80"
              onChange={(v) => onFieldChange?.("heading", v)}
            >
              {section.heading}
            </EditableText>
          )}
          {section.body !== undefined && (
            <EditableText
              file={file}
              contentPath={`${basePath}.body`}
              tag="p"
              className="text-lg text-black/70 leading-relaxed"
              onChange={(v) => onFieldChange?.("body", v)}
            >
              {section.body}
            </EditableText>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "metrics" && section.items) {
    return (
      <section className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
        {section.heading !== undefined && (
          <EditableText
            file={file}
            contentPath={`${basePath}.heading`}
            tag="h2"
            className="text-base font-semibold text-black/80"
            onChange={(v) => onFieldChange?.("heading", v)}
          >
            {section.heading}
          </EditableText>
        )}
        <div className="flex flex-col gap-8">
          {section.items.map((item, j) => (
            <div key={j} className="flex flex-col gap-2">
              <EditableText
                file={file}
                contentPath={`${basePath}.items.${j}.label`}
                tag="p"
                className="text-base font-semibold text-black/80"
                onChange={(v) => onFieldChange?.(`items.${j}.label`, v)}
              >
                {item.label ?? ""}
              </EditableText>
              <EditableText
                file={file}
                contentPath={`${basePath}.items.${j}.body`}
                tag="p"
                className="text-lg text-black/50 leading-relaxed"
                onChange={(v) => onFieldChange?.(`items.${j}.body`, v)}
              >
                {item.body ?? ""}
              </EditableText>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "image") {
    const visibleItems = section.items?.filter((i) => i.src) ?? [];
    return (
      <section className="w-full max-w-[1200px] mx-auto flex flex-col gap-4">
        {section.heading !== undefined && (
          <EditableText
            file={file}
            contentPath={`${basePath}.heading`}
            tag="h2"
            className="text-base font-semibold text-black/80"
            onChange={(v) => onFieldChange?.("heading", v)}
          >
            {section.heading}
          </EditableText>
        )}
        {visibleItems.length > 0 && (
          <div className={`grid gap-4 ${visibleItems.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            {section.items?.map((item, j) =>
              item.src ? (
                <div key={j} className="flex flex-col gap-2">
                  <div className={`relative rounded-xl overflow-hidden bg-black/4 group/img ${
                    visibleItems.length === 1 ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}>
                    <Image src={item.src} alt={item.caption ?? ""} fill className="object-cover" />
                    {editing && onRemoveImage && (
                      <button
                        onClick={() => onRemoveImage(j)}
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/70 text-white text-xs
                                   opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {(item.caption || editing) && (
                    <EditableText
                      file={file}
                      contentPath={`${basePath}.items.${j}.caption`}
                      tag="p"
                      className="text-xs text-black/40"
                      onChange={(v) => onFieldChange?.(`items.${j}.caption`, v)}
                    >
                      {item.caption ?? ""}
                    </EditableText>
                  )}
                </div>
              ) : null
            )}
          </div>
        )}
        {editing && onAddImage && slug && (
          <ImageUploadZone slug={slug} onUploaded={onAddImage} />
        )}
      </section>
    );
  }

  if (section.type === "video" && section.items) {
    return (
      <section className="w-full max-w-[1200px] mx-auto flex flex-col gap-4">
        {section.heading !== undefined && (
          <EditableText
            file={file}
            contentPath={`${basePath}.heading`}
            tag="h2"
            className="text-base font-semibold text-black/80"
            onChange={(v) => onFieldChange?.("heading", v)}
          >
            {section.heading}
          </EditableText>
        )}
        {section.items.map((item, j) => (
          <div key={j} className="flex flex-col gap-2">
            {item.muxId && (
              <div className="rounded-xl overflow-hidden shadow-sm">
                <MuxVideo playbackId={item.muxId} />
              </div>
            )}
            {item.lottieFile && (
              <div className="rounded-xl overflow-hidden bg-black/4">
                <LottiePlayer src={item.lottieFile} className="w-full" />
              </div>
            )}
            {editing && onUpdateItem && (
              <div className="flex flex-col gap-2 p-3 rounded-lg border border-black/10 bg-black/2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={item.muxId ?? ""}
                    placeholder="MUX playback ID"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-black/15 bg-white text-black/70 font-mono
                               focus:outline-none focus:border-black/30 placeholder:text-black/25"
                    onBlur={(e) => onUpdateItem(j, "muxId", e.target.value.trim())}
                  />
                  <span className="text-xs text-black/30 shrink-0">MUX ID</span>
                </div>
                <LottieFilePicker
                  currentPath={item.lottieFile}
                  onPicked={(path) => onUpdateItem(j, "lottieFile", path)}
                />
              </div>
            )}
            {(item.caption || editing) && (
              <EditableText
                file={file}
                contentPath={`${basePath}.items.${j}.caption`}
                tag="p"
                className="text-xs text-black/40"
                onChange={(v) => onFieldChange?.(`items.${j}.caption`, v)}
              >
                {item.caption ?? ""}
              </EditableText>
            )}
          </div>
        ))}
        {editing && onAddVideoSlot && (
          <button
            onClick={onAddVideoSlot}
            className="self-start text-xs text-black/40 hover:text-black/70 border border-dashed border-black/15 hover:border-black/30 px-3 py-1.5 rounded-lg transition-all"
          >
            + Add video slot
          </button>
        )}
      </section>
    );
  }

  return null;
}

function LottieFilePicker({
  currentPath,
  onPicked,
}: {
  currentPath?: string;
  onPicked: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-lottie", { method: "POST", body: fd });
      const { path } = await res.json();
      if (path) onPicked(path);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept=".json" className="hidden" onChange={handleChange} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-black/15 bg-white text-black/60
                   hover:border-black/30 hover:text-black/80 transition-all disabled:opacity-40"
      >
        <FilmIcon size={12} strokeWidth={2} />
        {uploading ? "Uploading…" : currentPath ? "Replace Lottie" : "Browse Lottie (.json)"}
      </button>
      {currentPath && (
        <span className="text-xs text-black/30 truncate font-mono">{currentPath.split("/").pop()}</span>
      )}
    </div>
  );
}
