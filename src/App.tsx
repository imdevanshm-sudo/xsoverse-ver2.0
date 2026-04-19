import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Home, Upload, Grid3X3, Play, Camera, Mic, Check, Feather, Anchor, Wind, Minus } from 'lucide-react';
import LoadCartridge from './components/LoadCartridge';

const screenVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 450, damping: 30, mass: 1 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.1, ease: 'easeOut' } }
};

function NavItem({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-14 h-14 relative group outline-none transition-all duration-75">
      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-75 ${
        active ? 'bg-white/10 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] translate-y-[2px]' : 'hover:bg-white/5 active:translate-y-[2px]'
      }`}>
        <Icon
          className={`w-[24px] h-[24px] transition-all duration-200 ${
            active ? 'text-[#34d399] drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-white/30 group-hover:text-white/50'
          }`}
          strokeWidth={active ? 2.5 : 2}
        />
      </div>
      {active && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-[#FF4E00] shadow-[0_0_8px_#FF4E00]"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

function HomeView() {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full px-6 pt-12 pb-28 relative z-10"
    >
      <div className="text-center font-pixel text-xl tracking-[0.3em] text-white/50 mb-8 mt-2 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        xsoverse
      </div>

      <div className="flex-1 w-full border-4 border-[#14141a] rounded-[32px] bg-[#0a0a0f] backdrop-blur-[2px] flex flex-col items-center justify-center mb-8 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Subtle inner top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <button className="w-20 h-20 rounded-full bg-[#1e1e26] flex items-center justify-center mb-6 
                           border border-white/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_0_#0a0a0e]
                           active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_0px_0_#0a0a0e] active:translate-y-[8px]
                           transition-all duration-75 relative z-10 outline-none">
          <Play className="w-8 h-8 text-[#a855f7] translate-x-[3px] drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" fill="currentColor" strokeWidth={1} />
        </button>
        <span className="font-pixel text-[20px] text-white/30 uppercase z-10 tracking-widest">Preview Render</span>
      </div>

      <button 
        className="w-full bg-gradient-to-r from-[#a855f7] to-[#7e22ce] text-[#0f0502] font-pixel text-2xl py-4 rounded-2xl tracking-widest 
                   border-2 border-[#581c87] shadow-[0_8px_0_#581c87]
                   active:shadow-[0_0px_0_#581c87] active:translate-y-[8px]
                   transition-all duration-75 outline-none"
      >
        CRAFT AN EXSO - $4.99
      </button>
    </motion.div>
  );
}



function AuraView({ activeAura, setActiveAura, activeColor }: { activeAura: number, setActiveAura: (i: number) => void, activeColor: string }) {
  const triggerHaptics = (col: number, row: number) => {
    // Fail gracefully if the Vibration API is unsupported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      const gravityLevel = col + row; // 0 to 4 diagonal spectrum
      
      switch (gravityLevel) {
        case 0: // [0,0] Top-Left: Zero Gravity (Crisp Tick)
          // Just a single, tiny point of contact
          navigator.vibrate(10);
          break;
        case 1: // Shallow (Soft click)
          // Introducing the second impact, keeping both light
          navigator.vibrate([15, 20, 20]);
          break;
        case 2: // Center: Balanced (Mechanical Knock)
          // Noticeable wind-up, distinct pause, solid connection
          navigator.vibrate([25, 30, 45]);
          break;
        case 3: // Densifying (Heavy physical register)
          // Heavier wind-up, leading to a much thicker sustained thud
          navigator.vibrate([32, 30, 70]);
          break;
        case 4: // Bottom-Right: Maximum Gravity (Deep Thud / Ka-thunk)
          // Maximum pre-fire jolt, hollow metal pause, massive physical impact
          navigator.vibrate([40, 30, 100]);
          break;
      }
    }
  };

  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full px-6 pt-10 pb-32 relative z-10 md:px-8 md:pt-14 md:pb-36"
    >
      <h1 className="text-white/90 text-3xl md:text-4xl font-pixel leading-tight tracking-wide text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] shrink-0">
        Set the Aura
      </h1>

      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[300px] py-12 md:py-16">
        <div className="relative w-full max-w-[min(55vw,_36dvh,_320px)] mx-auto aspect-square shrink-0">
          {/* Y-Axis Top (Weight / Light) */}
          <motion.div 
            animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <Feather 
              className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-700" 
              style={{ color: '#ffffff', filter: `drop-shadow(0 0 15px rgba(255,255,255,0.8))` }} 
            />
          </motion.div>
          
          {/* Y-Axis Bottom (Weight / Heavy) */}
          <motion.div 
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -bottom-10 md:-bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <Anchor 
              className="w-5 h-5 md:w-7 md:h-7 transition-colors duration-700" 
              style={{ color: '#ffffff', filter: `drop-shadow(0 0 15px rgba(255,255,255,0.8))` }} 
              strokeWidth={3}
            />
          </motion.div>

          {/* X-Axis Left (Tone / Playful) */}
          <motion.div 
            animate={{ rotate: [-8, 8, -8], x: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-1/2 -left-10 md:-left-14 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <Wind 
              className="w-5 h-5 md:w-7 md:h-7 transition-colors duration-700" 
              style={{ color: '#ffffff', filter: `drop-shadow(0 0 15px rgba(255,255,255,0.8))` }} 
            />
          </motion.div>

          {/* X-Axis Right (Tone / Structured) */}
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 2, ease: "circInOut" }}
            className="absolute top-1/2 -right-10 md:-right-14 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <Minus 
              className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-700 rotate-90" 
              style={{ color: '#ffffff', filter: `drop-shadow(0 0 15px rgba(255,255,255,0.8))` }} 
              strokeWidth={3}
            />
          </motion.div>

          {/* Central Beveled Glass Block (Heavy Machinery Trackpad) */}
          <motion.div 
            className="w-full h-full bg-[#1A1A24]/30 backdrop-blur-[50px] rounded-[32px] overflow-hidden 
                       border-[1px] shadow-[0_40px_80px_rgba(0,0,0,0.95),inset_0_2px_1px_rgba(255,255,255,0.25),inset_0_-2px_5px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.05)] relative z-20 transition-colors duration-700"
            style={{ borderColor: `${activeColor}50` }}
          >
          {/* Hardware Decals */}
          <span className="absolute top-4 left-4 text-[6px] text-white/30 tracking-[0.2em] font-pixel pointer-events-none z-30">AXIS:YX</span>
          <span className="absolute bottom-4 right-4 text-[6px] text-white/30 tracking-[0.2em] font-pixel pointer-events-none z-30">HW-REV_1.2</span>

          {/* Texture for frosted glass: microscopic imperfections */}
          <div 
            className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none z-10" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />

          {/* Static diagonal glare mimicking external light hitting a physical surface */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-black/[0.8] pointer-events-none z-10" />

          {/* Laser-Etched Subsurface Grid Lines (illuminated by ambient color) */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
            {/* Horizontals */}
            <div className="absolute top-[33.33%] left-0 w-full h-[1px] bg-white/20 shadow-[0_1px_0_rgba(0,0,0,0.5)]" style={{ boxShadow: `0 0 8px ${activeColor}, 0 0 2px ${activeColor}` }} />
            <div className="absolute top-[66.66%] left-0 w-full h-[1px] bg-white/20 shadow-[0_1px_0_rgba(0,0,0,0.5)]" style={{ boxShadow: `0 0 8px ${activeColor}, 0 0 2px ${activeColor}` }} />
            {/* Verticals */}
            <div className="absolute left-[33.33%] top-0 w-[1px] h-full bg-white/20 shadow-[1px_0_0_rgba(0,0,0,0.5)]" style={{ boxShadow: `0 0 8px ${activeColor}, 0 0 2px ${activeColor}` }} />
            <div className="absolute left-[66.66%] top-0 w-[1px] h-full bg-white/20 shadow-[1px_0_0_rgba(0,0,0,0.5)]" style={{ boxShadow: `0 0 8px ${activeColor}, 0 0 2px ${activeColor}` }} />
          </div>

          {/* Inner glass thickness / smearing refraction effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-10 transition-shadow duration-700" 
            style={{ boxShadow: `inset 0 0 80px ${activeColor}40, inset 0 4px 25px ${activeColor}30` }}
          />

          {/* Interactive Hit Area Grid - Changing Material Properties Diagonally */}
          <div className="absolute inset-x-2 inset-y-2 grid grid-cols-3 z-20 gap-3">
            {[...Array(9)].map((_, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const intensity = col + row; // 0 (Top-Left) to 4 (Bottom-Right)

              let cellClass = "w-full h-full relative flex items-center justify-center outline-none transition-all duration-300 rounded-[20px] overflow-hidden group ";
              let styleObj: React.CSSProperties = {};

              // Diagonal Material Interpolation
              if (intensity === 0) {
                  // [0,0] Top-Left: Thin, translucent, shallow, airy
                  cellClass += "bg-white/[0.04] hover:bg-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-sm border-t border-white/30";
                  styleObj = { boxShadow: `inset 0 10px 40px -10px ${activeColor}50` };
              } else if (intensity === 1) {
                  // Shallow transition
                  cellClass += "bg-white/[0.02] hover:bg-white/[0.08] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] backdrop-blur-md border-t border-white/10";
              } else if (intensity === 2) {
                  // [1,1] Center: Standard thickness, neutral balance
                  cellClass += "bg-transparent hover:bg-white/[0.05] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]";
              } else if (intensity === 3) {
                  // Densifying transition
                  cellClass += "bg-[#030108]/60 hover:bg-[#030108]/50 shadow-[inset_0_8px_16px_rgba(0,0,0,0.8)] border-b border-black border-r/50";
              } else if (intensity === 4) {
                  // [2,2] Bottom-Right: Thick, deep, crystal-milled obsidian mechanics
                  cellClass += "bg-[#030108]/95 hover:bg-[#030108]/85 shadow-[inset_0_25px_50px_rgba(0,0,0,0.98),inset_0_-2px_4px_rgba(255,255,255,0.15)] border-b-[4px] border-r-[2px] border-black";
                  styleObj = { 
                     boxShadow: `inset 0 20px 40px rgba(0,0,0,0.95), inset 0 0 40px -10px ${activeColor}90, inset 0 -2px 1px rgba(255,255,255,0.1)`,
                     backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.9) 3px, rgba(0,0,0,0.9) 6px), linear-gradient(180deg, rgba(0,0,0,0), rgba(20,5,40,0.8))`
                  };
              }

              return (
                <button 
                  key={i} 
                  onPointerDown={() => {
                    setActiveAura(i);
                    triggerHaptics(col, row);
                  }} 
                  className={cellClass}
                  style={styleObj}
                >
                   {/* Bottom right mechanical highlights */}
                   {intensity >= 3 && (
                     <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
                       <div className="absolute top-1.5 left-2 w-[1px] h-3 bg-white" />
                       <div className="absolute bottom-2.5 right-2 w-2 h-[1px] bg-white" />
                     </div>
                   )}

                   {activeAura === i && (
                     <motion.div
                        layoutId="auraGlow"
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                     >
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          className="absolute w-[200%] h-[200%] rounded-full blur-[35px] mix-blend-screen scale-150"
                          style={{ backgroundColor: activeColor, willChange: 'transform, opacity' }}
                        />
                        <motion.div 
                          className="w-4 h-4 bg-white rounded-full relative z-20"
                          style={{ boxShadow: `0 0 20px #fff, 0 0 50px ${activeColor}, 0 0 100px ${activeColor}` }}
                        />
                     </motion.div>
                   )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
     </div>

      <button 
        className="w-full shrink-0 bg-[#34d399] text-[#0A2619] font-pixel text-2xl py-5 rounded-full tracking-widest mt-6
                   border-2 border-[#095033] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.5),0_6px_0_#095033]
                   active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.5),0_0px_0_#095033] active:translate-y-[6px]
                   transition-all duration-75 outline-none flex items-center justify-center gap-3 relative overflow-hidden z-20"
      >
        <span className="relative z-10 flex items-center justify-center gap-3 font-bold"><Check className="w-[20px] h-[20px]" strokeWidth={4} /> CONFIRM ($15.00)</span>
      </button>
    </motion.div>
  );
}

const auraThemeColors = [
  '#34d399', // 0: 0,0 (Mint)
  '#2dd4bf', // 1: 1,0 (Teal)
  '#38bdf8', // 2: 2,0 (Light Blue)
  '#2dd4bf', // 3: 0,1 (Teal)
  '#818cf8', // 4: 1,1 (Indigo/Center)
  '#a855f7', // 5: 2,1 (Purple)
  '#38bdf8', // 6: 0,2 (Light Blue)
  '#a855f7', // 7: 1,2 (Purple)
  '#7e22ce', // 8: 2,2 (Deep Purple)
];

export default function App() {
  const [tab, setTab] = useState<'home' | 'upload' | 'aura'>('aura');
  const [activeAura, setActiveAura] = useState(8); // Bottom-Right max gravity

  const activeColor = tab === 'aura' ? auraThemeColors[activeAura] : '#818cf8';

  return (
    <div className="flex bg-[#020202] min-h-screen items-center justify-center selection:bg-[#FF4E00]/30 selection:text-white">
      {/* App Container (Borderless & Responsive) */}
      <div className="relative w-full min-h-[100dvh] bg-[#09090b] overflow-hidden">
        
        {/* Dynamic Abstract Matrix Background & Refractive Underglow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Base darkening gradient and physical radial depth (deep purple-obsidian mix) */}
          <div className="absolute inset-0 bg-[#080312] z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#200445_0%,_transparent_100%)] opacity-40 z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/30 to-[#000000]/90 z-0" />

          {/* Bioluminescent Dust Particles Layer */}
          <motion.div 
            className="absolute opacity-40 pointer-events-none z-0 mix-blend-screen"
            animate={{ x: [0, -200], y: [0, -200] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            style={{ 
              width: '200%', height: '200%', top: '-50%', left: '-50%',
              willChange: 'transform',
              backgroundImage: `radial-gradient(1.5px 1.5px at 40px 60px, rgba(52, 211, 153, 0.8), rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 20px, rgba(168, 85, 247, 0.6), rgba(0,0,0,0)), radial-gradient(1px 1px at 220px 180px, rgba(126, 34, 206, 0.9), rgba(0,0,0,0)), radial-gradient(2px 2px at 80px 230px, rgba(52, 211, 153, 0.7), rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 300px 110px, rgba(168, 85, 247, 0.8), rgba(0,0,0,0))`,
              backgroundSize: '400px 400px'
            }}
          />

          {/* Organic floating aura underglows directly driven by the activeColor */}
          <motion.div 
            animate={{ 
              x: tab === 'home' ? 0 : tab === 'upload' ? -20 : 20,
              y: tab === 'home' ? 0 : tab === 'upload' ? 20 : -20,
              backgroundColor: activeColor
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[-20%] w-[120%] h-[45%] rounded-[100%] mix-blend-screen opacity-40 blur-[80px] z-10 md:w-[80vw]" 
            style={{ willChange: 'transform, background-color, opacity' }}
          />
          <motion.div 
            animate={{ 
              scale: tab === 'aura' ? 1.15 : 1,
              opacity: tab === 'upload' ? 0.4 : 0.6,
              backgroundColor: activeColor
            }}
            transition={{ duration: 1.5, ease: 'easeInOut', opacity: { repeat: Infinity, duration: 4, ease: 'easeInOut', repeatType: 'mirror' } }}
            className="absolute bottom-[5%] right-[-15%] w-[110%] h-[60%] rounded-[100%] mix-blend-screen blur-[100px] z-10 md:w-[60vw]" 
            style={{ willChange: 'transform, background-color, opacity' }}
          />
          <motion.div 
            animate={{ backgroundColor: activeColor }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute bottom-[-15%] left-[-10%] w-[90%] h-[45%] rounded-[100%] mix-blend-screen opacity-20 blur-[70px] z-10 md:w-[70vw]" 
            style={{ willChange: 'background-color' }}
          />
          
          {/* Subtle Heavy Grain Overlay for Matte Plastic / Retro Feel */}
          <div 
            className="absolute inset-0 opacity-[0.05] mix-blend-color-dodge z-20 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />
          <div 
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay z-20 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />
        </div>

        {/* Screen Content Wrapper */}
        <div className="relative z-10 w-full h-[100dvh] flex flex-col mx-auto max-w-2xl" style={{ willChange: 'transform, opacity' }}>
          <AnimatePresence mode="wait">
            {tab === 'home' && <HomeView key="home" />}
            {tab === 'upload' && <LoadCartridge key="upload" />}
            {tab === 'aura' && <AuraView key="aura" activeAura={activeAura} setActiveAura={setActiveAura} activeColor={activeColor} />}
          </AnimatePresence>
        </div>

        {/* Bottom Floating Navigation (Tactile Physical Base) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[260px] h-[72px] bg-[#1a1a24] rounded-[36px] 
                        border-2 border-white/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,1),0_4px_0_#050508] 
                        flex items-center justify-between px-6 z-50 overflow-hidden">
          {/* Physical indent for tab bar */}
          <div className="absolute inset-0 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] rounded-[36px] pointer-events-none" />
          
          <LayoutGroup>
            <NavItem icon={Home} active={tab === 'home'} onClick={() => setTab('home')} />
            <NavItem icon={Upload} active={tab === 'upload'} onClick={() => setTab('upload')} />
            <NavItem icon={Grid3X3} active={tab === 'aura'} onClick={() => setTab('aura')} />
          </LayoutGroup>
        </div>

      </div>
    </div>
  );
}
