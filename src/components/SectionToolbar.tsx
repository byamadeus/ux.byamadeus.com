"use client";

interface Props {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function SectionToolbar({
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown,
}: Props) {
  return (
    <div
      className="absolute top-3 right-3 z-50 flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-black/90 text-white shadow-lg
                 opacity-0 group-hover/section:opacity-100 transition-opacity duration-150 pointer-events-none group-hover/section:pointer-events-auto"
    >
      <ToolBtn
        onClick={onMoveUp}
        disabled={!canMoveUp}
        title="Move up"
      >
        ↑
      </ToolBtn>
      <ToolBtn
        onClick={onMoveDown}
        disabled={!canMoveDown}
        title="Move down"
      >
        ↓
      </ToolBtn>
      <Sep />
      <ToolBtn onClick={onDuplicate} title="Duplicate">
        ⎘
      </ToolBtn>
      <Sep />
      <ToolBtn
        onClick={onDelete}
        title="Delete section"
        className="hover:!bg-red-500/80"
      >
        ✕
      </ToolBtn>
    </div>
  );
}

function ToolBtn({
  onClick,
  disabled,
  title,
  children,
  className = "",
}: {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs hover:bg-white/20 disabled:opacity-25 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-3 bg-white/25 mx-0.5" />;
}
