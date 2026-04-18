import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Home, Upload, Grid3X3, Play, Camera, Mic, Check, Feather, Square, Wind, Minus } from 'lucide-react';

const screenVariants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { type: "spring", stiffness: 350, damping: 25 } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(2px)', transition: { duration: 0.15 } }
};

function NavItem({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-14 h-14 relative group outline-none transition-all duration-75">
      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-75 ${
        active ? 'bg-white/10 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] translate-y-[2px]' : 'hover:bg-white/5 active:translate-y-[2px]'
      }`}>
        <Icon
          className={`w-[24px] h-[24px] transition-all duration-200 ${
            active ? 'text-[#FF4E00] drop-shadow-[0_0_8px_rgba(255,78,0,0.8)]' : 'text-white/30 group-hover:text-white/50'
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
          <Play className="w-8 h-8 text-[#FF4F02] translate-x-[3px] drop-shadow-[0_0_10px_#FF4F02]" fill="currentColor" strokeWidth={1} />
        </button>
        <span className="font-pixel text-[20px] text-white/30 uppercase z-10 tracking-widest">Preview Render</span>
      </div>

      <button 
        className="w-full bg-gradient-to-r from-[#FF4F02] to-[#d63100] text-[#0f0502] font-pixel text-2xl py-4 rounded-2xl tracking-widest 
                   border-2 border-[#7c1a00] shadow-[0_8px_0_#7c1a00]
                   active:shadow-[0_0px_0_#7c1a00] active:translate-y-[8px]
                   transition-all duration-75 outline-none"
      >
        CRAFT AN EXSO - $4.99
      </button>
    </motion.div>
  );
}

function UploadView() {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full px-8 pt-16 pb-28 relative z-10"
    >
      <h1 className="text-white/90 text-5xl font-pixel leading-[1.1] mb-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
        Load<br/>Cartridge
      </h1>

      <div className="flex flex-col items-center justify-center gap-10 relative flex-1 mb-8">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-1/2 w-[4px] h-[60%] bg-[#1a1a24] border-x border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 z-0" />

        <button 
          className="w-32 h-32 rounded-[28px] bg-[#1a1a24] flex flex-col items-center justify-center gap-4 relative z-10 
                     border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_8px_0_#0a0a0f] 
                     active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_0px_0_#0a0a0f] active:translate-y-[8px]
                     transition-all duration-75 outline-none group"
        >
          <div className="w-12 h-12 rounded-full bg-[#0a0a0f] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border-b border-white/5">
             <Camera className="w-[20px] h-[20px] text-[#34d399] drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
          <span className="font-pixel text-[18px] text-white/40 uppercase group-hover:text-white/70 transition-colors">Visuals</span>
        </button>

        <button 
          className="w-32 h-32 rounded-[28px] bg-[#1a1a24] flex flex-col items-center justify-center gap-4 relative z-10 
                     border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_8px_0_#0a0a0f] 
                     active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_0px_0_#0a0a0f] active:translate-y-[8px]
                     transition-all duration-75 outline-none group"
        >
          <div className="w-12 h-12 rounded-full bg-[#0a0a0f] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border-b border-white/5">
             <Mic className="w-[20px] h-[20px] text-[#d946ef] drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
          </div>
          <span className="font-pixel text-[18px] text-white/40 uppercase group-hover:text-white/70 transition-colors">Audio</span>
        </button>
      </div>
    </motion.div>
  );
}

function AuraView({ activeAura, setActiveAura, activeColor }: { activeAura: number, setActiveAura: (i: number) => void, activeColor: string }) {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full px-8 pt-16 pb-28 relative z-10"
    >
      <h1 className="text-white/90 text-4xl font-pixel leading-tight mb-8 tracking-wide text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
        Set the Aura
      </h1>

      <div className="relative w-full max-w-[280px] mx-auto mt-4 mb-auto">
        {/* Y-Axis Top (Weight / Light) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Feather 
            className="w-6 h-6 transition-colors duration-700" 
            style={{ color: activeColor, filter: `drop-shadow(0 0 10px ${activeColor}) drop-shadow(0 0 20px ${activeColor})` }} 
          />
        </div>
        
        {/* Y-Axis Bottom (Weight / Heavy) */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Square 
            className="w-5 h-5 transition-colors duration-700" 
            style={{ color: activeColor, filter: `drop-shadow(0 0 10px ${activeColor}) drop-shadow(0 0 20px ${activeColor})` }} 
            fill="currentColor"
          />
        </div>

        {/* X-Axis Left (Tone / Playful) */}
        <div className="absolute top-1/2 -left-12 -translate-y-1/2 flex items-center justify-center">
          <Wind 
            className="w-5 h-5 transition-colors duration-700" 
            style={{ color: activeColor, filter: `drop-shadow(0 0 10px ${activeColor}) drop-shadow(0 0 20px ${activeColor})` }} 
          />
        </div>

        {/* X-Axis Right (Tone / Structured) */}
        <div className="absolute top-1/2 -right-12 -translate-y-1/2 flex items-center justify-center">
          <Minus 
            className="w-6 h-6 transition-colors duration-700 rotate-90" 
            style={{ color: activeColor, filter: `drop-shadow(0 0 10px ${activeColor}) drop-shadow(0 0 20px ${activeColor})` }} 
            strokeWidth={3}
          />
        </div>

        {/* Central Beveled Glass Block (Heavy Machinery Trackpad) */}
        <motion.div 
          className="w-full aspect-square bg-[#1A1A24]/30 backdrop-blur-[50px] rounded-[32px] overflow-hidden 
                     border-[1px] shadow-[0_40px_80px_rgba(0,0,0,0.95),inset_0_2px_1px_rgba(255,255,255,0.25),inset_0_-2px_5px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.05)] relative z-20 transition-colors duration-700"
          style={{ borderColor: `${activeColor}50` }}
        >
          {/* Hardware Decals */}
          <span className="absolute top-4 left-4 text-[6px] text-white/30 tracking-[0.2em] font-pixel pointer-events-none z-30">AXIS:YX</span>
          <span className="absolute bottom-4 right-4 text-[6px] text-white/30 tracking-[0.2em] font-pixel pointer-events-none z-30">HW-REV_1.2</span>

          {/* Texture for frosted glass: microscopic imperfections */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.35] mix-blend-overlay pointer-events-none z-10" />

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

          {/* Interactive Hit Area Grid */}
          <div className="absolute inset-0 grid grid-cols-3 z-20">
            {[...Array(9)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveAura(i)} 
                className="w-full h-full relative flex items-center justify-center outline-none hover:bg-white/[0.04] transition-colors duration-200"
              >
                 {activeAura === i && (
                   <motion.div
                      layoutId="auraGlow"
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                   >
                      <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="absolute w-[200%] h-[200%] rounded-full blur-[28px] opacity-90 mix-blend-screen scale-125"
                        style={{ backgroundColor: activeColor }}
                      />
                      <motion.div 
                        className="w-3.5 h-3.5 bg-white rounded-full relative z-20 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]"
                        style={{ boxShadow: `0 0 15px #fff, 0 0 40px ${activeColor}, 0 0 80px ${activeColor}` }}
                      />
                   </motion.div>
                 )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <button 
        className="w-full bg-[#34d399] text-[#0A2619] font-pixel text-2xl py-5 rounded-2xl tracking-widest mt-6
                   border-2 border-[#095033] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.5),0_6px_0_#095033]
                   active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.5),0_0px_0_#095033] active:translate-y-[6px]
                   transition-all duration-75 outline-none flex items-center justify-center gap-3 relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-3 font-bold"><Check className="w-[20px] h-[20px]" strokeWidth={4} /> CONFIRM - $4.99</span>
      </button>
    </motion.div>
  );
}

const auraThemeColors = [
  '#fde047', '#22d3ee', '#818cf8',
  '#f472b6', '#FF4E00', '#d946ef',
  '#34d399', '#3b82f6', '#bd2ce8' 
];

export default function App() {
  const [tab, setTab] = useState<'home' | 'upload' | 'aura'>('aura');
  const [activeAura, setActiveAura] = useState(8);

  const activeColor = tab === 'aura' ? auraThemeColors[activeAura] : '#FF4E00';

  return (
    <div className="flex bg-[#020202] min-h-screen items-center justify-center p-4 selection:bg-[#FF4E00]/30 selection:text-white">
      {/* Phone Envelope (Obsidian Matte Plastic) */}
      <div className="relative w-full max-w-[370px] h-[800px] bg-[#09090b] rounded-[44px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border-[4px] border-[#18181b] ring-1 ring-white/5">
        
        {/* Dynamic Abstract Matrix Background & Refractive Underglow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Base darkening gradient and physical radial depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffffff]/[0.02] via-transparent to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/30 to-[#000000]/70 z-0" />

          {/* Organic floating aura underglows directly driven by the activeColor */}
          <motion.div 
            animate={{ 
              x: tab === 'home' ? 0 : tab === 'upload' ? -20 : 20,
              y: tab === 'home' ? 0 : tab === 'upload' ? 20 : -20,
              backgroundColor: activeColor
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[-20%] w-[120%] h-[45%] rounded-[100%] mix-blend-screen opacity-40 blur-[80px] z-10" 
          />
          <motion.div 
            animate={{ 
              scale: tab === 'aura' ? 1.15 : 1,
              opacity: tab === 'upload' ? 0.4 : 0.6,
              backgroundColor: activeColor
            }}
            transition={{ duration: 1.5, ease: 'easeInOut', opacity: { repeat: Infinity, duration: 4, ease: 'easeInOut', repeatType: 'mirror' } }}
            className="absolute bottom-[5%] right-[-15%] w-[110%] h-[60%] rounded-[100%] mix-blend-screen blur-[100px] z-10" 
          />
          <motion.div 
            animate={{ backgroundColor: activeColor }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute bottom-[-15%] left-[-10%] w-[90%] h-[45%] rounded-[100%] mix-blend-screen opacity-20 blur-[70px] z-10" 
          />
          
          {/* Subtle Heavy Grain Overlay for Matte Plastic / Retro Feel */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-color-dodge z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay z-20 pointer-events-none" />
        </div>

        {/* Top Status Bar Mock */}
        <div className="absolute top-0 left-0 right-0 h-12 z-50 flex justify-between items-center px-8 pointer-events-none">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full shadow-[0_1px_3px_rgba(255,255,255,0.05)_inset]" />
        </div>

        {/* Screen Content Wrapper */}
        <div className="relative z-10 w-full h-full">
          <AnimatePresence mode="popLayout">
            {tab === 'home' && <HomeView key="home" />}
            {tab === 'upload' && <UploadView key="upload" />}
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
