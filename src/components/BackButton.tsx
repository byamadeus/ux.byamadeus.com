"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

const SCROLL_THRESHOLD = 80;
const HIDE_DELAY = 1500;

export function BackButton({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onScroll() {
      if (hideTimer.current) clearTimeout(hideTimer.current);

      if (window.scrollY > SCROLL_THRESHOLD) {
        setVisible(true);
      } else {
        hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <a
      href={href}
      aria-label="Back"
      className="fixed z-[9998] flex items-center justify-center w-9 h-9 rounded-full border border-black/10 text-black/60 hover:text-black hover:border-black/20 transition-colors"
      style={{
        top: "48px",
        left: "24px",
        background: "rgba(255,255,255,0.36)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
    >
      <ArrowLeft size={16} />
    </a>
  );
}
