"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

interface ScrollLottieProps {
  src: string;
  /** Text shown over the Lottie */
  text: React.ReactNode;
  /** Scroll distance multiplier — e.g. 3 means 300vh per section */
  scrollMultiplier?: number;
}

export function ScrollLottie({
  src,
  text,
  scrollMultiplier = 3,
}: ScrollLottieProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animData, setAnimData] = useState<object | null>(null);
  const [totalFrames, setTotalFrames] = useState(0);

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        setAnimData(data);
        // Lottie JSON stores total frames in `op` (out-point)
        setTotalFrames((data as { op?: number }).op ?? 60);
      })
      .catch(console.error);
  }, [src]);

  useEffect(() => {
    if (!animData || !totalFrames) return;

    function onScroll() {
      if (!wrapperRef.current || !lottieRef.current) return;
      const { top, height } = wrapperRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // progress 0 → 1 as section scrolls through viewport
      const progress = Math.min(1, Math.max(0, -top / (height - windowH)));
      const frame = Math.round(progress * (totalFrames - 1));
      lottieRef.current.goToAndStop(frame, true);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [animData, totalFrames]);

  return (
    /* Tall wrapper defines scroll distance — all sections same height */
    <div
      ref={wrapperRef}
      style={{ height: `${scrollMultiplier * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport-height container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {animData && (
          <Lottie
            lottieRef={lottieRef}
            animationData={animData}
            autoplay={false}
            loop={false}
            style={{ width: "100%", height: "100%" }}
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
          />
        )}

        {/* Text overlay — bottom-center */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center px-6 pointer-events-none">
          <p className="text-xl text-center max-w-2xl leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
