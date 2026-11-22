import React, { useRef, useState } from 'react';
import { Play, Eye, Clock, Volume2, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { ReelItem } from '../../utils/workStore';

interface TiltReelsCardProps {
  reel: ReelItem;
  onClick?: () => void;
  className?: string;
}

export const TiltReelsCard: React.FC<TiltReelsCardProps> = ({ reel, onClick, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 14 degree tilt
    const rY = ((x - centerX) / centerX) * 12;
    const rX = -((y - centerY) / centerY) * 12;

    setRotX(rX);
    setRotY(rY);
    setSpotlight({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={`relative inline-block select-none ${className}`}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
          transition: isHovered
            ? 'transform 0.1s ease-out'
            : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="relative w-64 sm:w-72 aspect-[9/15] rounded-3xl p-4 bg-zinc-950/80 backdrop-blur-2xl border border-white/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] cursor-pointer overflow-hidden flex flex-col justify-between group"
      >
        {/* Dynamic mouse spotlight gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${spotlight.x}% ${spotlight.y}%, rgba(255, 45, 45, 0.28), rgba(56, 189, 248, 0.12), transparent 70%)`,
          }}
        />

        {/* Subtle glass reflection highlight */}
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent rotate-45 transform translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000"
        />

        {/* Reel Background Atmosphere */}
        <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient} opacity-75 -z-10`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 -z-10" />

        {/* Top Bar: Device & Live Speed badge */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
            <Clock className="w-3 h-3 text-[#ff4b4b]" />
            <span>{reel.turnaroundMinutes}m edit</span>
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 text-emerald-400 font-bold">
            <Eye className="w-3 h-3" />
            <span>{reel.views}</span>
          </span>
        </div>

        {/* Center Floating Play Simulator */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff2d2d] to-purple-600 flex items-center justify-center text-white shadow-xl shadow-[#ff2d2d]/40 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
          <span className="mt-3 text-[10px] font-mono uppercase tracking-widest text-zinc-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
            4K 60fps HDR
          </span>
        </div>

        {/* Right side Reels engagement mock */}
        <div className="absolute right-3.5 bottom-20 z-10 flex flex-col items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <span className="text-[10px] font-mono text-zinc-300 mt-0.5">38K</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
              <MessageCircle className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="text-[10px] font-mono text-zinc-300 mt-0.5">1.2K</span>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 pt-2 border-t border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff7171] block">
            {reel.client} · {reel.city}
          </span>
          <h4 className="font-extrabold text-sm text-white line-clamp-1 mt-0.5">
            {reel.title}
          </h4>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2">
            <span className="text-emerald-400 font-semibold">{reel.reachMultiplier}</span>
            <span className="text-zinc-500 font-mono text-[10px]">{reel.device.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
