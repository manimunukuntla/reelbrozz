import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MagneticButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  strength?: number; // Distance pull multiplier
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  onClick,
  children,
  className = '',
  strength = 0.35,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
    setTrailPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 1.05 : 1})`,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={`relative group overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff2d2d] via-[#e02424] to-[#b91c1c] text-white font-bold text-sm sm:text-base tracking-wide shadow-2xl shadow-[#ff2d2d]/40 border border-white/20 cursor-pointer select-none active:scale-95 ${className}`}
    >
      {/* Interactive dynamic glow trail that follows cursor inside button */}
      {isHovered && (
        <span
          className="pointer-events-none absolute w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-xl transition-opacity duration-300"
          style={{
            left: `${trailPos.x}px`,
            top: `${trailPos.y}px`,
          }}
        />
      )}

      {/* Cybernetic accent outline */}
      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/30 group-hover:ring-cyan-400/60 transition-colors pointer-events-none" />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform duration-300" />
        <span>{children || 'Start Creating'}</span>
        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
      </span>
    </button>
  );
};
