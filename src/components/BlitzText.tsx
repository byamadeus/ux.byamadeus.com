'use client';

import { useEffect, useRef } from 'react';

interface BlitzTextProps {
  text?: string;
  className?: string;
}

export default function BlitzText({ text = 'AMADEUS', className = '' }: BlitzTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const fonts = ['Satoshi', 'Cabinet Grotesk', 'Switzer', 'Stardom', 'Boska', 'Melodrama', 'Pencerio'];
    const spans = containerRef.current.querySelectorAll('span');
    const intervals: NodeJS.Timeout[] = [];

    spans.forEach((span, index) => {
      const startDelay = index * (16 * (index * 0.7));
      const maxChanges = 50;
      let changeCount = 0;

      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          if (changeCount < maxChanges) {
            const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
            const randomWeight = (Math.floor(Math.random() * 6) * 100) + 100;
            const randomStyle = Math.random() < 0.4 ? 'italic' : 'normal';
            const randomCase = Math.random() < 0.5 ? 'uppercase' : 'lowercase';

            (span as HTMLSpanElement).style.fontFamily = randomFont;
            (span as HTMLSpanElement).style.fontWeight = String(randomWeight);
            (span as HTMLSpanElement).style.fontStyle = randomStyle;
            (span as HTMLSpanElement).style.textTransform = randomCase;

            changeCount++;
          } else {
            clearInterval(interval);
            (span as HTMLSpanElement).style.fontWeight = 'normal';
          }
        }, 1200);
        intervals.push(interval);
      }, startDelay);
      intervals.push(timeout);
    });

    return () => intervals.forEach(clearInterval);
  }, [text]);

  const letters = text.split('');
  const fonts = ['Satoshi', 'Cabinet Grotesk', 'Switzer', 'Stardom', 'Boska', 'Melodrama', 'Pencerio'];

  return (
    <>
      <link
        href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2&f[]=cabinet-grotesk@1&f[]=switzer@2,1&f[]=stardom@400&f[]=boska@2,1&f[]=melodrama@1&f[]=comico@400&f[]=pencerio@50&display=swap"
        rel="stylesheet"
      />
      <div className={`blitz-container ${className}`}>
        <div className="blitz-text" ref={containerRef}>
          {letters.map((letter, i) => (
            <span key={i} style={{ fontFamily: fonts[i % fonts.length] }}>
              {letter}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blitz-container {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }
        .blitz-text {
          font-size: clamp(3rem, 15vw, 12rem);
          line-height: 1;
          font-weight: normal;
          letter-spacing: -0.02em;
          color: #0a0a0a;
        }
        .blitz-text span {
          display: inline-block;
          transition: font-family 0.1s ease-in-out;
        }
        @media (max-width: 768px) {
          .blitz-text {
            font-size: clamp(2rem, 12vw, 8rem);
          }
        }
      `}</style>
    </>
  );
}
