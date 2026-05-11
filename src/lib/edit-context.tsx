"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface EditContextValue {
  editing: boolean;
  dirty: boolean;
  saving: boolean;
  markDirty: () => void;
}

const EditContext = createContext<EditContextValue>({
  editing: false,
  dirty: false,
  saving: false,
  markDirty: () => {},
});

export function useEditContext() {
  return useContext(EditContext);
}

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const markDirty = useCallback(() => setDirty(true), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "e") {
        e.preventDefault();
        setEditing((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <EditContext.Provider value={{ editing, dirty, saving, markDirty }}>
      {children}
      {editing && (
        <EditBar
          dirty={dirty}
          saving={saving}
          setSaving={setSaving}
          setDirty={setDirty}
        />
      )}
    </EditContext.Provider>
  );
}

interface EditBarProps {
  dirty: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setDirty: (v: boolean) => void;
}

function EditBar({ dirty, saving, setSaving, setDirty }: EditBarProps) {
  async function deploy() {
    setSaving(true);
    try {
      await fetch("/api/deploy", { method: "POST" });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-2.5 rounded-full bg-black text-white text-sm font-medium shadow-xl">
      <span className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dirty ? "bg-amber-400" : "bg-emerald-400"}`} />
        {dirty ? "Unsaved changes" : "All saved"}
      </span>
      <div className="w-px h-4 bg-white/20" />
      <span className="text-white/50 text-xs">⌘⇧E to exit</span>
      <div className="w-px h-4 bg-white/20" />
      <button
        onClick={deploy}
        disabled={saving || !dirty}
        className="px-3 py-1 rounded-full bg-white text-black text-xs font-semibold disabled:opacity-40 hover:bg-white/90 transition-colors"
      >
        {saving ? "Deploying…" : "Commit + Deploy"}
      </button>
    </div>
  );
}
