import React from 'react';

export const ParticleBackground: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10">
      {/* Cyan and Magenta/Crimson ambient gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#ff2d2d]/15 blur-[150px] rounded-full" />
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-purple-600/10 blur-[140px] rounded-full" />

      {/* Floating geometric particles SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4b4b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff2d2d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cyan-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Scattered glowing diamonds & dots */}
        <circle cx="15%" cy="20%" r="2.5" fill="url(#cyan-glow)" />
        <circle cx="85%" cy="25%" r="3" fill="url(#particle-glow)" />
        <circle cx="45%" cy="15%" r="1.5" fill="#ffffff" opacity="0.4" />
        <circle cx="75%" cy="60%" r="2" fill="url(#cyan-glow)" />
        <circle cx="25%" cy="75%" r="3" fill="url(#particle-glow)" />
        <circle cx="65%" cy="85%" r="2" fill="#38bdf8" opacity="0.6" />
        <circle cx="90%" cy="80%" r="1.5" fill="#ffffff" opacity="0.3" />

        {/* Floating geometric diamond glyphs */}
        <polygon points="120,80 126,86 120,92 114,86" fill="none" stroke="#ff2d2d" strokeWidth="0.8" opacity="0.5" />
        <polygon points="1120,240 1128,248 1120,256 1112,248" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
        <polygon points="400,620 407,627 400,634 393,627" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.4" />
        <polygon points="980,720 986,726 980,732 974,726" fill="none" stroke="#ff2d2d" strokeWidth="0.8" opacity="0.5" />
      </svg>
    </div>
  );
};
