"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function LottiePlayer({
  src,
  className,
  loop = true,
  autoplay = true,
}: LottiePlayerProps) {
  const [animData, setAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then(setAnimData)
      .catch(console.error);
  }, [src]);

  if (!animData) return <div className={className} />;

  return (
    <Lottie
      animationData={animData}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
}
