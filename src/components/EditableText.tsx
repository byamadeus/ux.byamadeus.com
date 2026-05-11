"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useEditContext } from "@/lib/edit-context";

interface EditableTextProps {
  /** Dot-path into the content JSON, e.g. "hero.headline" or "sections.0.body" */
  contentPath: string;
  /** Which content file to update: "home" or "work/tfz" etc. */
  file: string;
  tag?: string;
  className?: string;
  children: string;
  /** Optional: called on every input so parent can keep its own state in sync */
  onChange?: (value: string) => void;
}

export function EditableText({
  contentPath,
  file,
  tag: Tag = "span",
  className,
  children,
  onChange,
}: EditableTextProps) {
  const { editing, markDirty } = useEditContext();
  const ref = useRef<HTMLElement>(null);
  // Per-instance timer — not module-level, so instances don't cancel each other
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't overwrite DOM while user is typing — that resets the cursor.
    // Only sync when element is not focused (external update: duplicate, load, etc.)
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = children;
    }
  }, [children]);

  const save = useCallback(
    (value: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await fetch("/api/save-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file, path: contentPath, value }),
        });
      }, 600);
    },
    [file, contentPath]
  );

  function onInput() {
    const value = ref.current?.textContent ?? "";
    markDirty();
    onChange?.(value);
    save(value);
  }

  const props = {
    ref,
    className: `${className ?? ""} ${
      editing
        ? "outline-dashed outline-1 outline-blue-400/60 rounded focus:outline-blue-500 focus:bg-blue-50/40 px-0.5"
        : ""
    }`,
    contentEditable: editing,
    suppressContentEditableWarning: true,
    onInput,
  };

  return React.createElement(Tag, props);
}
