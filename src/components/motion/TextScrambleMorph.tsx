import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleMorphProps {
  className?: string;
}

const WORDS = [
  'REELS BROZZ',
  'CREATE. EDIT. GO VIRAL',
  'EDIT FASTER',
  'GO VIRAL',
  'AI POWERED',
  '10-MIN ON-SITE',
];

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトABCDEF0123456789!<>-_\\/[]{}—=+*^?#________';

export const TextScrambleMorph: React.FC<TextScrambleMorphProps> = ({ className = '' }) => {
  const [displayText, setDisplayText] = useState('REELS BROZZ');
  const [wordIndex, setWordIndex] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let iteration = 0;
    const targetWord = WORDS[wordIndex];
    const maxIterations = 24;

    const scramble = () => {
      iteration++;
      const current = targetWord
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < Math.floor((iteration / maxIterations) * targetWord.length)) {
            return targetWord[index];
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplayText(current);

      if (iteration < maxIterations) {
        frameRef.current = requestAnimationFrame(() => {
          setTimeout(scramble, 30);
        });
      } else {
        setDisplayText(targetWord);
      }
    };

    scramble();

    const interval = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 3200);

    return () => {
      clearTimeout(interval);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [wordIndex]);

  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-full font-black tracking-tight text-center ${className}`}>
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
        <span>Next-Gen Creator Velocity</span>
      </span>

      <span className="relative w-full max-w-full min-h-[2.4em] sm:min-h-[1.25em] flex items-center justify-center px-1 text-2xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold uppercase select-none transition-all duration-300 break-words">
        {/* Soft background glow */}
        <span 
          aria-hidden="true" 
          className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-r from-cyan-500 via-[#ff2d2d] to-purple-600 pointer-events-none"
        />
        {/* Foreground text with cyan and red gradient */}
        <span className="relative bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent font-display tracking-tight drop-shadow-[0_4px_24px_rgba(255,45,45,0.35)]">
          {displayText}
        </span>
      </span>
    </div>
  );
};
