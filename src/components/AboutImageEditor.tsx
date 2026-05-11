"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useEditContext } from "@/lib/edit-context";

interface Props {
  initialSrc: string | null;
}

export function AboutImageEditor({ initialSrc }: Props) {
  const { editing, markDirty } = useEditContext();
  const [src, setSrc] = useState(initialSrc);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const ts = Date.now();
      const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
      const dest = `images/about/${base}-${ts}`;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("dest", dest);

      const imgRes = await fetch("/api/convert-image", { method: "POST", body: fd });
      const { src: newSrc } = await imgRes.json();
      if (!newSrc) return;

      // Save path back to about.json
      await fetch("/api/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: "about", path: "image", value: newSrc }),
      });

      setSrc(newSrc);
      markDirty();
    } finally {
      setUploading(false);
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) await uploadFile(file);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    e.target.value = "";
  }

  return (
    <div
      className={`relative h-[40vh] aspect-[9/16] mx-auto rounded-2xl overflow-hidden bg-black/6 ${
        editing ? "group/img cursor-pointer" : ""
      }`}
      onDragOver={editing ? (e) => { e.preventDefault(); setDragging(true); } : undefined}
      onDragLeave={editing ? () => setDragging(false) : undefined}
      onDrop={editing ? handleDrop : undefined}
      onClick={editing ? () => inputRef.current?.click() : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Image or placeholder */}
      {src ? (
        <Image
          src={src}
          alt="Amadeus Cameron"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-sm text-black/20 font-medium tracking-wide">
            {editing ? "Drop or click to upload photo" : "Photo coming soon"}
          </p>
        </div>
      )}

      {/* Edit overlay */}
      {editing && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
            dragging
              ? "bg-black/30"
              : "bg-black/0 group-hover/img:bg-black/25"
          }`}
        >
          {uploading ? (
            <Loader2 size={24} className="text-white animate-spin" />
          ) : (
            <>
              <Upload
                size={22}
                className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
              />
              <span className="text-white text-xs font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">
                {src ? "Replace photo" : "Upload photo"}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
