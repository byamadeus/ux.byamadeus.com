"use client";

import { useState, useCallback, useRef } from "react";
import { SectionRenderer } from "@/components/SectionRenderer";
import { SectionToolbar } from "@/components/SectionToolbar";
import { AddSectionPanel } from "@/components/AddSectionPanel";
import { useEditContext } from "@/lib/edit-context";
import { FilmIcon } from "lucide-react";
import { type CaseStudySection } from "@/lib/content";

/** Immutably set a dotPath field on an object */
function setNestedField<T extends object>(obj: T, dotPath: string, value: string): T {
  const keys = dotPath.split(".");
  const clone = Array.isArray(obj) ? ([...obj] as unknown as T) : { ...obj };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

interface Props {
  slug: string;
  initialSections: CaseStudySection[];
}

export function CaseStudyEditor({ slug, initialSections }: Props) {
  const { editing, markDirty } = useEditContext();
  const [sections, setSections] = useState<CaseStudySection[]>(initialSections);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const file = `work/${slug}`;

  const persistSections = useCallback(
    (next: CaseStudySection[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await fetch("/api/update-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file, sections: next }),
        });
      }, 400);
    },
    [file]
  );

  function update(next: CaseStudySection[]) {
    setSections(next);
    markDirty();
    persistSections(next);
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...sections];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    update(next);
  }

  function moveDown(i: number) {
    if (i === sections.length - 1) return;
    const next = [...sections];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    update(next);
  }

  function duplicate(i: number) {
    const next = [...sections];
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(sections[i])));
    update(next);
  }

  function remove(i: number) {
    const next = sections.filter((_, idx) => idx !== i);
    update(next);
  }

  function addSection(section: CaseStudySection) {
    update([...sections, section]);
  }

  /** Update a single field on a section's item (used for MUX ID inline edit) */
  function updateSectionItem(
    sectionIdx: number,
    itemIdx: number,
    field: string,
    value: string
  ) {
    const next = sections.map((s, si) => {
      if (si !== sectionIdx) return s;
      const items = (s.items ?? []).map((item, ii) => {
        if (ii !== itemIdx) return item;
        return { ...item, [field]: value };
      });
      return { ...s, items };
    });
    update(next);
  }

  /**
   * Sync a text field edit back into sections state (no persist — EditableText
   * already saved via /api/save-content). Prevents structural ops from
   * overwriting typed text with stale state.
   */
  function syncTextField(sectionIdx: number, field: string, value: string) {
    setSections((prev) =>
      prev.map((s, si) => {
        if (si !== sectionIdx) return s;
        return setNestedField(s, field, value);
      })
    );
  }

  /** Add an image to an image section */
  function addImageToSection(sectionIdx: number, src: string) {
    const next = sections.map((s, si) => {
      if (si !== sectionIdx) return s;
      return { ...s, items: [...(s.items ?? []), { src, caption: "" }] };
    });
    update(next);
  }

  /** Remove an image from an image section */
  function removeImageFromSection(sectionIdx: number, itemIdx: number) {
    const next = sections.map((s, si) => {
      if (si !== sectionIdx) return s;
      const items = (s.items ?? []).filter((_, ii) => ii !== itemIdx);
      return { ...s, items };
    });
    update(next);
  }

  return (
    <>
      <div className="flex flex-col gap-16">
        {sections.map((section, i) => (
          <div
            key={`${section.type}-${i}`}
            className={`relative ${editing ? "group/section" : ""}`}
          >
            {/* Edit ring in edit mode */}
            {editing && (
              <div className="absolute -inset-3 rounded-xl border border-dashed border-black/10 pointer-events-none group-hover/section:border-black/25 transition-colors" />
            )}

            {editing && (
              <SectionToolbar
                onMoveUp={() => moveUp(i)}
                onMoveDown={() => moveDown(i)}
                onDuplicate={() => duplicate(i)}
                onDelete={() => remove(i)}
                canMoveUp={i > 0}
                canMoveDown={i < sections.length - 1}
              />
            )}

            <SectionRenderer
              section={section}
              file={`work/${slug}`}
              basePath={`sections.${i}`}
              slug={slug}
              onFieldChange={(field, value) => syncTextField(i, field, value)}
              onAddImage={(src) => addImageToSection(i, src)}
              onRemoveImage={(itemIdx) => removeImageFromSection(i, itemIdx)}
              onUpdateItem={(itemIdx, field, value) =>
                updateSectionItem(i, itemIdx, field, value)
              }
              onAddVideoSlot={() => {
                const next = sections.map((s, si) => {
                  if (si !== i) return s;
                  return { ...s, items: [...(s.items ?? []), { muxId: "", caption: "" }] };
                });
                update(next);
              }}
            />
          </div>
        ))}
      </div>

      {/* Add section button — only in edit mode */}
      {editing && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setAddPanelOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-dashed border-black/20 text-sm font-medium text-black/40
                       hover:border-black/40 hover:text-black/70 hover:bg-black/3 transition-all"
          >
            <span className="text-base">+</span>
            Add section
          </button>
        </div>
      )}

      <AddSectionPanel
        open={addPanelOpen}
        onClose={() => setAddPanelOpen(false)}
        onAdd={addSection}
      />
    </>
  );
}

