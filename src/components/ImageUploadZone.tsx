"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

interface Props {
  slug: string;
  /** Called with the returned public src path after upload */
  onUploaded: (src: string) => void;
}

export function ImageUploadZone({ slug, onUploaded }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const ts = Date.now();
      const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
      const dest = `images/work/${slug}/${base}-${ts}`;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("dest", dest);

      const res = await fetch("/api/convert-image", { method: "POST", body: fd });
      const { src } = await res.json();
      if (src) onUploaded(src);
    } finally {
      setUploading(false);
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) await uploadFile(file);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    e.target.value = "";
  }

  return (
    <div
      className={`relative flex items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all
        ${dragging ? "border-black/40 bg-black/4" : "border-black/15 hover:border-black/25 hover:bg-black/2"}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-1.5 text-center pointer-events-none">
        {uploading ? (
          <>
            <Loader2 size={18} className="text-black/30 animate-spin" />
            <p className="text-sm text-black/40">Converting to WebP…</p>
          </>
        ) : (
          <>
            <Upload size={18} className="text-black/30" />
            <p className="text-sm font-medium text-black/50">
              Drop image or click to upload
            </p>
            <p className="text-xs text-black/30">
              PNG, JPG, AVIF → auto WebP
            </p>
          </>
        )}
      </div>
    </div>
  );
}
