"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/about#resume" },
];

const SCROLL_THRESHOLD = 80; // px before nav appears
const HIDE_DELAY = 1500;     // ms after returning to top before fading out

export function LocalNav() {
  const pathname = usePathname();
  const isCaseStudy = pathname.startsWith("/work/");
  const [visible, setVisible] = useState(!isCaseStudy);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isCaseStudy) {
      setVisible(true);
      return;
    }

    // Start hidden on case study pages
    setVisible(false);

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
  }, [isCaseStudy]);

  return (
    <nav
      className="fixed z-[9998]"
      style={{
        top: "48px",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
      aria-label="Site navigation"
    >
      <div
        className="flex items-center gap-1 p-1.5 rounded-full border border-black/10"
        style={{
          background: "rgba(255,255,255,0.36)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="px-4 py-2 rounded-full text-sm font-medium tracking-wide text-black/80 hover:bg-[rgba(209,209,209,0.57)] hover:text-black transition-all duration-200 whitespace-nowrap"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
