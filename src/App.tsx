import React, { useState, memo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimation, useTransform, animate } from 'motion/react';
import { Play, Feather, ArrowRight, Loader2, Camera, Mic, BookOpen, Lock, X, Check } from 'lucide-react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

const screenVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 450, damping: 30, mass: 1 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.1, ease: 'easeOut' } }
};

const triggerHaptics = (col: number, row: number) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const gravityLevel = col + row;
    switch (gravityLevel) {
      case 0: navigator.vibrate(10); break;
      case 1: navigator.vibrate([15, 20, 20]); break;
      case 2: navigator.vibrate([25, 30, 45]); break;
      case 3: navigator.vibrate([32, 30, 70]); break;
      case 4: navigator.vibrate([40, 30, 100]); break;
    }
  }
};

const AURA_COLORS = [
  '#00f0ff', // 0: Electric Cyan (Light)
  '#00ffcc', // 1: Glowing Aqua (Light)
  '#ff007f', // 2: Neon Pink (Light)
  '#00d4ff', // 3: Cyan (Mid)
  '#8a2be2', // 4: Blue Violet (Mid)
  '#ff1493', // 5: Deep Pink (Mid)
  '#4b0082', // 6: Dark Indigo (Heavy)
  '#800080', // 7: Deep Violet (Heavy)
  '#dc143c'  // 8: Crimson/Magenta (Heavy)
];

const AURA_PULSES = [
  'animate-[pulse_1.5s_ease-in-out_infinite]',
  'animate-[pulse_1.6s_ease-in-out_infinite]',
  'animate-[pulse_1.7s_ease-in-out_infinite]',
  'animate-[pulse_2s_ease-in-out_infinite]',
  'animate-[pulse_2.2s_ease-in-out_infinite]',
  'animate-[pulse_2.5s_ease-in-out_infinite]',
  'animate-[pulse_3s_ease-in-out_infinite]',
  'animate-[pulse_3.5s_ease-in-out_infinite]',
  'animate-[pulse_4s_ease-in-out_infinite]'
];

const RECORDING_DURATION_MS = 5000;

const PEARL_STYLES = `
  @keyframes pearl-breathe {
    0% { transform: scale(1); filter: hue-rotate(0deg) brightness(1); }
    50% { transform: scale(1.03); filter: hue-rotate(5deg) brightness(1.1); }
    100% { transform: scale(1); filter: hue-rotate(0deg) brightness(1); }
  }
  @keyframes pearl-heartbeat {
    0% { transform: scale(1); filter: saturate(1.5) brightness(1.2); }
    15% { transform: scale(1.12); filter: saturate(2) brightness(1.4); }
    30% { transform: scale(1); filter: saturate(1.5) brightness(1.2); }
    100% { transform: scale(1); filter: saturate(1.5) brightness(1.2); }
  }
  .living-pearl-idle {
    animation: pearl-breathe 6s infinite ease-in-out;
  }
  .living-pearl-recording {
    animation: pearl-heartbeat 1s infinite ease-in-out;
  }
`;

const AuraNode = memo(({ i, activeAura, setActiveAura }: { i: number, activeAura: number, setActiveAura: (i: number) => void }) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const isActive = activeAura === i;

  const handlePointerDown = useCallback(() => triggerHaptics(col, row), [col, row]);
  const handleClick = useCallback(() => setActiveAura(i), [i, setActiveAura]);

  return (
    <motion.button 
      key={i} 
      onPointerDown={handlePointerDown} 
      onClick={handleClick}
      className="relative flex flex-col items-center justify-center w-full h-full outline-none group"
      whileTap="held"
      initial={false}
      animate={isActive ? "active" : "inactive"}
      variants={{
        inactive: { scale: 0.9, opacity: 0.4 },
        active: { scale: 1.1, opacity: 1 },
        held: { scale: 0.95, opacity: 0.8 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div 
        className={`relative w-[60%] aspect-square rounded-full flex items-center justify-center transform-gpu mb-4 transition-colors duration-500
          ${isActive ? 'bg-[#0d0221] shadow-xl' : 'bg-[#1a0b2e]/30'}`}
        style={{
          boxShadow: isActive ? `0 0 35px ${AURA_COLORS[i]}80, 0 0 60px ${AURA_COLORS[i]}40, inset 0 0 15px ${AURA_COLORS[i]}60` : 'none',
          border: isActive ? `1px solid ${AURA_COLORS[i]}80` : '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div 
          className={`rounded-full transition-all duration-700 z-10 transform-gpu
            ${isActive ? `w-5 h-5 bg-white ${AURA_PULSES[i]}` : 'w-2.5 h-2.5 bg-white/40'}`}
          style={{
            boxShadow: isActive ? `0 0 20px #fff, 0 0 40px ${AURA_COLORS[i]}` : 'none'
          }}
        />
        {isActive && (
          <motion.div 
             layoutId="activeAuraCore"
             className="absolute inset-0 rounded-full border border-white/20 scale-110 pointer-events-none"
             style={{ borderColor: `${AURA_COLORS[i]}50` }}
             transition={{ type: "spring", stiffness: 100, damping: 30 }}
          />
        )}
      </div>
    </motion.button>
  );
});

export default function App() {
  const [activeAura, setActiveAura] = useState(4);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'INITIAL' | 'PROCESSING' | 'PAID'>('INITIAL');
  
  const [primaryMedia, setPrimaryMedia] = useState<File[]>([]);
  const [linerMedia, setLinerMedia] = useState<File[]>([]);
  const [audioUrl, setAudioUrl] = useState('');
  
  const [isGiftShopOpen, setIsGiftShopOpen] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false);
  const [pearlKey, setPearlKey] = useState(0);
  const [pearlState, setPearlState] = useState<'IDLE' | 'RECORDING' | 'REVIEW' | 'RETHINK' | 'SEALED' | 'INFUSED'>('IDLE');
  const [flickDir, setFlickDir] = useState(1);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const hasMatter = primaryMedia.length > 0 || pearlState === 'INFUSED';
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pearlControls = useAnimation();
  
  const accumulatedTimeRef = useRef(0);
  const startTimeRef = useRef(0);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaZoneRef = useRef<HTMLDivElement>(null);
  
  const originRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      let step = 1;
      
      if (messageRef.current && scrollPos >= messageRef.current.offsetTop - 100) {
        step = 3;
      } else if (auraRef.current && scrollPos >= auraRef.current.offsetTop - 100) {
        step = 2;
      }
      
      setActiveStep(step);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { getRootProps: primaryProps, getInputProps: primaryInputProps } = useDropzone(
    {
      onDrop: (files: any) => setPrimaryMedia(prev => [...prev, ...files]),
      accept: { 'image/*': [], 'video/*': [] },
      noClick: hasMatter
    } as unknown as DropzoneOptions
  );

  const { getRootProps: linerProps, getInputProps: linerInputProps } = useDropzone(
    {
      onDrop: (files: any) => setLinerMedia(files),
      accept: { 'image/*': [] }
    } as unknown as DropzoneOptions
  );

  useEffect(() => {
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, []);

  const discardPearl = useCallback((dir: number = 1) => {
    if (window.navigator?.vibrate) navigator.vibrate([40, 40]);
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    accumulatedTimeRef.current = 0;
    setRecordedTime(0);
    setPearlState('IDLE');
    setFlickDir(dir);
    setPearlKey(prev => prev + 1);
  }, []);

  const startRecording = useCallback((e: React.PointerEvent) => {
    if (pearlState !== 'IDLE') return;
    
    if (window.navigator && window.navigator.vibrate) navigator.vibrate([20, 30, 20]);
    
    setPearlState('RECORDING');
    startTimeRef.current = Date.now();
    
    recordIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const sessionTime = now - startTimeRef.current;
      const totalTime = accumulatedTimeRef.current + sessionTime;
      setRecordedTime(Math.floor(totalTime / 1000));
      
      if (totalTime >= 1000) {
        setHasRecordedOnce(true);
      }
    }, 100);
  }, [pearlState]);

  const stopRecording = useCallback(() => {
    setPearlState(prev => {
      if (prev === 'RECORDING') {
        if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
        const now = Date.now();
        const sessionTime = now - startTimeRef.current;
        accumulatedTimeRef.current += sessionTime;
        
        if (accumulatedTimeRef.current >= 1000) {
          setHasRecordedOnce(true);
          return 'REVIEW';
        } else {
          return 'IDLE';
        }
      }
      return prev;
    });
  }, []);

  const handlePayment = () => {
    setPaymentStatus('PROCESSING');
    setTimeout(() => {
      setPaymentStatus('PAID');
    }, 2500); 
  };

  return (
    <div className="flex bg-[#0d0221] min-h-screen items-start justify-center selection:bg-[#2dd4bf]/30 font-serif touch-manipulation">
      <style>{PEARL_STYLES}</style>
      
      {/* Tech-Noir Crisp Background */}
      <div className="fixed inset-0 w-full min-h-[100dvh] bg-gradient-to-b from-[#0d0221] via-[#110328] to-[#160430] pointer-events-none -z-20">
        {/* Subtle CSS Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-screen -z-10" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      <div className="relative w-full flex flex-col items-center pb-40 z-10 pt-10">
        
        {/* STICKY HEADER -> FIXED HEADER changes back to sticky */}
        <div className="sticky inset-x-0 top-0 z-[100] pt-6 pb-14 flex flex-col items-center bg-gradient-to-b from-[#0d0221] via-[#0d0221] to-transparent pointer-events-none w-full">
           <div className="pointer-events-auto px-6 w-full max-w-2xl flex flex-col items-center">
             <h1 className="text-white text-2xl md:text-3xl font-serif leading-tight tracking-widest text-center">
               CRAFT AN EXSO
             </h1>
             <div className="w-full max-w-[min(65vw,350px)] mt-6 relative flex justify-between items-center text-center">
               <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -z-10" />
               <div className="absolute top-1/2 left-0 h-[1px] bg-white transition-all duration-700 ease-out -z-10 shadow-[0_0_10px_#fff]" 
                    style={{ width: `${(((paymentStatus !== 'INITIAL' ? 4 : activeStep) - 1) / 3) * 100}%` }} />
               
               {['ORIGIN', 'AURA', 'MESSAGE', 'SEAL'].map((step, idx) => {
                 const displayStep = paymentStatus !== 'INITIAL' ? 4 : activeStep;
                 const isActive = displayStep >= idx + 1;
                 return (
                   <div key={idx} className="flex flex-col items-center gap-2 bg-[#0d0221] px-3 py-1 rounded-full relative z-10">
                     <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]' : 'bg-white/30'}`} />
                     <span className={`text-[7px] tracking-[0.2em] font-sans transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {idx + 1}.<br className="md:hidden" />{step}
                     </span>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>

        {/* Global Vertical Stardust Trail - Minimalist */}
        <div className="absolute top-0 bottom-48 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent -z-10 pointer-events-none" />

        <div className="w-full max-w-2xl flex flex-col items-center px-6">
          
          {/* STEP 1: ORIGIN (Media & Voice) */}
          <div ref={originRef} className="w-full flex flex-col items-center relative gap-32">
            <div className="absolute top-0 right-0 text-white/20 text-[10px] font-mono tracking-widest">01 / ORIGIN</div>
            
            {/* Media Block */}
            <div 
              {...primaryProps()}
              onClick={(e) => {
                if (primaryProps().onClick && !hasMatter) primaryProps().onClick(e);
                if (hasMatter) setIsInventoryOpen(true);
              }}
              ref={(node) => {
                mediaZoneRef.current = node;
                if (typeof primaryProps().ref === 'function') {
                  primaryProps().ref(node);
                } else if (primaryProps().ref) {
                  (primaryProps().ref as any).current = node;
                }
              }}
              className={`w-full max-w-[min(65vw,350px)] aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                ${hasMatter ? 'border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(0,240,255,0.3)] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] animate-[pulse_3s_ease-in-out_infinite]' : 'bg-[#0a0514]/40 border border-white/10 border-dashed hover:border-white/30'}`}
            >
              <input {...primaryInputProps()} />
              
              <div className="relative z-10 flex flex-col items-center pointer-events-none text-center px-4">
                {hasMatter ? (
                   <>
                      <div className="w-12 h-12 bg-cyan-400/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-cyan-400/50">
                         <BookOpen className="w-5 h-5 text-cyan-400" />
                      </div>
                      <span className="text-[10px] tracking-widest uppercase font-sans text-cyan-400 font-bold mb-2">MATTER INFUSED</span>
                      <span className="text-[8px] tracking-[0.2em] font-sans text-white/50">TAP TO VIEW INVENTORY</span>
                   </>
                ) : (
                   <>
                     <Camera className="w-6 h-6 mb-4 outline-none font-light text-white/30 group-hover:text-white/50 transition-colors" strokeWidth={1} />
                     <span className="text-[9px] tracking-[0.3em] font-sans uppercase transition-colors text-white/40 group-hover:text-white/60">
                       ATTACH PRIMARY VISUALS
                     </span>
                   </>
                )}
              </div>
            </div>

            {/* Voice Block */}
            <div className="w-full flex flex-col items-center relative group">
              <motion.h2 animate={{ opacity: isDragging ? 0 : 1 }} className="text-white/60 text-xs tracking-[0.3em] font-sans mb-4">VOICING THE VOID</motion.h2>
              
              <motion.div animate={{ opacity: isDragging ? 0 : 1 }} className="text-[9px] text-gray-300 text-center mb-16 tracking-[0.3em] leading-relaxed max-w-[280px]">
                 {pearlState === 'INFUSED' ? (
                   <span className="text-gray-500">AUDIO INFUSED.</span>
                 ) : (
                   "CAPTURE A PERSONAL THOUGHT. IT WILL DUCK THE BACKGROUND MUSIC."
                 )}
              </motion.div>

              <div className="relative flex justify-center items-center w-40 h-40">
                {/* Volumetric Emission Lighting behind the pearl */}
                <AnimatePresence>
                  {(pearlState === 'RECORDING') && pearlState !== 'INFUSED' && (
                    <motion.div 
                      key="glow"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-white/10 blur-[40px] rounded-full mix-blend-screen pointer-events-none`}
                      style={{ backgroundColor: AURA_COLORS[activeAura] }}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                {pearlState !== 'INFUSED' && (
                  <motion.div 
                    layoutId="living-pearl"
                    key={`pearl-core-${pearlKey}`} 
                    
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3, ease: "easeOut" } }}
                    
                    drag={pearlState === 'SEALED' ? true : pearlState === 'RETHINK' ? 'x' : false}
                    dragConstraints={pearlState === 'RETHINK' ? { left: 0, right: 0 } : undefined}
                    dragElastic={pearlState === 'RETHINK' ? 0.8 : undefined}
                    dragMomentum={pearlState === 'SEALED' ? false : true}
                    
                    whileDrag={{ scale: 1.1, zIndex: 9999 }}
                    onDragStart={(e, info) => {
                       setIsDragging(true);
                    }}
                    
                    onDrag={(e: any, info: any) => {
                       if (pearlState === 'SEALED') {
                           const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
                           if (clientY !== undefined) {
                             const vh = window.innerHeight;
                             if (clientY < 100) window.scrollBy({ top: -10, behavior: 'auto' });
                             else if (clientY > vh - 100) window.scrollBy({ top: 10, behavior: 'auto' });
                           }
                       }
                    }}
                    
                    onDragEnd={async (e: any, info: any) => {
                       setIsDragging(false);
                       if (pearlState === 'SEALED') {
                           const rect = mediaZoneRef.current?.getBoundingClientRect();
                           if (rect && info.point.x >= rect.left && info.point.x <= rect.right &&
                               info.point.y >= rect.top && info.point.y <= rect.bottom) {
                               
                               // Calculate movement completely unaffected by drag internals
                               const dx = (rect.left + rect.right) / 2 - info.point.x;
                               const dy = (rect.top + rect.bottom) / 2 - info.point.y;
                               
                               await Promise.all([
                                   animate(x, x.get() + dx, { duration: 0.4, ease: [0.16, 1, 0.3, 1] }),
                                   animate(y, y.get() + dy, { duration: 0.4, ease: [0.16, 1, 0.3, 1] })
                               ]);
                               
                               setPearlState('INFUSED');
                               if (window.navigator && window.navigator.vibrate) navigator.vibrate([100, 50, 100]);
                           } else {
                               animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
                               animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
                           }
                       } else if (pearlState === 'RETHINK') {
                           if (info.offset.x > 150 || info.velocity.x > 800) {
                               await animate(x, window.innerWidth, { duration: 0.4, ease: "easeOut" });
                               discardPearl(1);
                           } else if (info.offset.x < -150 || info.velocity.x < -800) {
                               await animate(x, -window.innerWidth, { duration: 0.4, ease: "easeOut" });
                               discardPearl(-1);
                           }
                       }
                    }}
                    onPointerDown={(e) => {
                       if (pearlState === 'IDLE') startRecording(e);
                    }}
                    onPointerUp={() => {
                       if (pearlState === 'RECORDING') stopRecording();
                    }}
                    onPointerLeave={() => {
                       if (pearlState === 'RECORDING') stopRecording();
                    }}
                    className={`relative z-50 w-32 h-32 rounded-full touch-none ${pearlState === 'SEALED' || pearlState === 'RETHINK' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} flex flex-col items-center justify-center transition-all duration-300
                       ${pearlState === 'RECORDING' ? 'scale-105 living-pearl-recording shadow-[0_0_50px_rgba(0,240,255,0.4)]' : 'living-pearl-idle hover:scale-105'}`}
                    style={{
                      x: pearlState === 'SEALED' || pearlState === 'RETHINK' ? x : 0,
                      y: pearlState === 'SEALED' || pearlState === 'RETHINK' ? y : 0,
                      touchAction: 'none',
                      background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, rgba(200, 220, 255, 0.4) 15%, ${AURA_COLORS[activeAura]}50 45%, #05000a 85%, #000 100%)`,
                      boxShadow: `
                        inset -15px -15px 30px rgba(0,0,0,0.9), 
                        inset 10px 10px 25px rgba(255,255,255,0.7), 
                        0 0 ${pearlState === 'RECORDING' ? '40px' : '15px'} ${AURA_COLORS[activeAura]}40
                      `,
                    }}
                  >
                    <div className="absolute top-[10%] left-[15%] w-[40%] h-[20%] rounded-full bg-gradient-to-b from-white/90 to-transparent blur-[2px] rotate-[-20deg] pointer-events-none mix-blend-overlay" />
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                 {pearlState === 'RECORDING' && (
                   <motion.div 
                     key="rec-status"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0 }}
                     className="absolute -bottom-8 w-[150%] left-1/2 -translate-x-1/2 text-center text-[8px] font-sans tracking-[0.3em] text-cyan-400 pointer-events-none"
                   >
                     [{Math.floor(recordedTime / 60).toString().padStart(2, '0')}:{(recordedTime % 60).toString().padStart(2, '0')}]
                   </motion.div>
                 )}
                 {pearlState === 'RETHINK' && (
                   <motion.div 
                     key="rec-tip"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: isDragging ? 0 : 1, y: 0 }}
                     exit={{ opacity: 0 }}
                     className="absolute -bottom-8 w-[200%] left-1/2 -translate-x-1/2 text-center text-[8px] font-sans tracking-[0.25em] text-[#ff007f]/90 pointer-events-none uppercase font-bold"
                   >
                     SLIDE TO DISCARD
                   </motion.div>
                 )}
              </AnimatePresence>

              {/* Action Buttons */}
              <AnimatePresence>
                 {pearlState === 'REVIEW' && (
                    <motion.div
                       key="review-actions"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0 }}
                       className="absolute -bottom-24 w-[200%] flex items-center justify-center gap-4 left-1/2 -translate-x-1/2"
                    >
                       <button
                         onClick={() => {
                            x.set(0);
                            y.set(0);
                            setPearlState('RETHINK');
                         }}
                         className="w-10 h-10 rounded-full border border-[#ff007f]/50 text-[#ff007f] flex items-center justify-center hover:bg-[#ff007f]/10 transition-colors"
                       >
                          <X className="w-5 h-5 pointer-events-none" />
                       </button>
                       <button
                         onClick={() => {
                            x.set(0);
                            y.set(0);
                            setPearlState('SEALED');
                            if (window.navigator?.vibrate) navigator.vibrate([30, 30]);
                         }}
                         className="px-8 py-3 uppercase tracking-[0.4em] text-[8px] text-cyan-400 border border-cyan-400/30 rounded-full hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all font-sans active:scale-95 whitespace-nowrap"
                       >
                          SEAL EXSO
                       </button>
                    </motion.div>
                 )}
              </AnimatePresence>

              <motion.div animate={{ opacity: isDragging ? 0 : 1 }} className="mt-20 text-[8px] tracking-[0.3em] font-sans text-gray-400 uppercase">
                 STATUS / <span className={`font-bold tracking-widest ${pearlState === 'RECORDING' ? 'text-cyan-400 animate-pulse' : pearlState === 'INFUSED' ? 'text-[#8a2be2]' : pearlState === 'SEALED' ? 'text-white' : pearlState === 'REVIEW' ? 'text-cyan-300' : 'text-gray-300'}`}>
                   {pearlState === 'RECORDING' ? 'RECORDING' : pearlState === 'INFUSED' ? 'INFUSED' : pearlState === 'SEALED' ? 'DRAG TO ORIGIN TO ALCHEMIZE' : pearlState === 'REVIEW' ? 'READY TO SEAL' : pearlState === 'RETHINK' ? 'RETHINK' : 'READY'}
                 </span>
              </motion.div>
            </div>
          </div>

          {/* STEP 2: AURA & CROSSROADS (Crisp Tech/Noir Grid) */}
          <div ref={auraRef} className="w-full flex flex-col items-center relative mt-32">
            <div className="absolute top-0 right-0 text-white/20 text-[10px] font-mono tracking-widest mb-8">02 / AURA</div>
            <p className="text-gray-300 text-[9px] md:text-[10px] font-sans tracking-[0.3em] uppercase text-center max-w-xs mx-auto leading-relaxed mt-8 mb-10">
              DETERMINE THE EXSO’S AURA SPECTRUM: FROM LIGHT TO HEAVY RESONANCE
            </p>
            
            <div className="relative w-full max-w-[min(65vw,350px)] aspect-square shrink-0 flex items-center justify-center">
               <div className="relative w-full h-full z-20 grid grid-cols-3 gap-6 bg-gradient-to-br from-[#1a0b2e]/60 to-[#0d0221]/60 border border-[#8a2be2]/30 p-6 shadow-[0_0_40px_rgba(138,43,226,0.15),inset_0_0_20px_rgba(138,43,226,0.1)] rounded-xl">
                  <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center text-white/20 z-30"><Feather className="w-4 h-4" strokeWidth={1} /></div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 flex items-center justify-center z-30 opacity-50">
                    <div className="relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <div className="absolute w-5 h-[1px] border-b border-white/40 -rotate-[25deg]" />
                    </div>
                  </div>
                  {[...Array(9)].map((_, i) => (
                    <AuraNode key={i} i={i} activeAura={activeAura} setActiveAura={setActiveAura} />
                  ))}
               </div>
            </div>

            <div className="w-full max-w-[min(65vw,350px)] flex flex-col items-center mt-12">
              <div className="flex w-full justify-between items-center text-[8px] md:text-[9px] tracking-widest font-sans text-white/30 px-2 mt-2">
                 <button className="flex items-center gap-2 hover:text-white transition-colors active:scale-95 group">
                    <div className="w-1 h-1 rounded-full border border-white/40 group-hover:bg-white transition-colors" /> HOLD TO KEEP
                 </button>
                 <button className="flex items-center gap-2 hover:text-white transition-colors active:scale-95 group">
                    SLIDE TO ABYSS <ArrowRight className="w-3 h-3 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                 </button>
              </div>
            </div>

            <div ref={messageRef} className="w-full flex flex-col items-center relative mt-32 pt-20 border-t border-[#8a2be2]/10">
              <div className="absolute top-0 right-0 text-white/20 text-[10px] font-mono tracking-widest mt-8">03 / MESSAGE</div>
              {/* GUIDED GIFT SHOP COMPONENT (Sleek organic bordered button) */}
              <button 
                onClick={() => setIsGiftShopOpen(true)}
                className="px-8 py-5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all tracking-[0.2em] uppercase font-sans text-[9px] flex flex-col items-center gap-1 active:scale-95"
              >
                 <span>STEP 3: TUCK A FINAL THOUGHT</span>
                 <span className="opacity-50 text-[7px] text-white/30 tracking-widest">(Guided Addition)</span>
              </button>
            </div>
          </div>

          {/* ACTIONS / PAYMENT FLOW (No bulky pills) */}
          <div className="mt-32 w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              {paymentStatus === 'PAID' ? (
                 <motion.div 
                   key="generate-link"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="w-full flex flex-col items-center gap-6"
                 >
                   <button className="px-10 py-5 border border-white/20 hover:border-white text-white/90 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] bg-[#0a0514] font-sans hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] flex justify-center items-center">
                      GENERATE XSO LINK
                   </button>
                   <div className="flex items-center gap-3 text-[8px] tracking-widest text-white/40 uppercase">
                      <Lock className="w-3 h-3 opacity-50" /> Single-Use Only, Expires after opening.
                   </div>
                 </motion.div>
              ) : (
                 <motion.button 
                   key="commit"
                   onClick={handlePayment}
                   disabled={paymentStatus === 'PROCESSING'}
                   className="px-8 py-5 border border-white/10 hover:border-white/50 text-white/60 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] bg-transparent font-sans flex items-center justify-center w-full max-w-[280px] disabled:opacity-50"
                 >
                   {paymentStatus === 'PROCESSING' ? (
                     <><Loader2 className="w-4 h-4 animate-spin mr-3 opacity-50" /> PROCESSING...</>
                   ) : (
                     'PROCEED TO PAYMENT'
                   )}
                 </motion.button>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* OVERLAY: GUIDED GIFT SHOP (Tech-noir adaptation) */}
      <AnimatePresence>
        {isGiftShopOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0221]/95 px-4 py-10 overflow-y-auto"
          >
             <div className="relative w-full max-w-sm min-h-[450px] bg-[#160430] border border-[#8a2be2]/30 flex flex-col p-8 text-white items-center text-center shadow-[0_0_50px_rgba(138,43,226,0.2)]">
                
                <button onClick={() => setIsGiftShopOpen(false)} className="absolute top-4 right-4 z-20 p-2 hover:bg-white/5 transition-colors">
                   <X className="w-4 h-4 opacity-30" />
                </button>

                <h3 className="font-sans text-[10px] tracking-[0.4em] uppercase border-b border-white/10 pb-6 w-full relative z-10 mb-10 mt-4 text-white/60">
                  Curated Attachments
                </h3>

                {/* Liner Note Inner Area */}
                <div {...linerProps()} className="relative z-10 w-full mb-10 py-10 border border-dashed border-white/10 cursor-pointer hover:border-white/30 bg-black/20 transition-colors flex flex-col items-center group">
                   <input {...linerInputProps()} />
                   {linerMedia.length > 0 ? (
                      <>
                        <Check className="w-6 h-6 mb-3 opacity-60" strokeWidth={1} />
                        <span className="text-[9px] tracking-widest uppercase font-sans text-white/60">Note Secured</span>
                      </>
                   ) : (
                      <>
                        <BookOpen className="w-6 h-6 opacity-30 mb-4 group-hover:-translate-y-1 transition-transform" strokeWidth={1} />
                        <div className="text-[8px] tracking-[0.3em] font-sans opacity-40 px-6 leading-relaxed uppercase">
                           ATTACH A SECONDARY PHOTO—A HANDWRITTEN LETTER, ANOTHER MEMORY.
                        </div>
                      </>
                   )}
                </div>

                <div className="w-full relative z-10 mb-10 flex flex-col gap-4">
                   <span className="text-[9px] tracking-[0.3em] uppercase text-white/40 border-t border-white/10 pt-8">ATTACH A SONG</span>
                   <input 
                     type="text" 
                     placeholder="Spotify / Apple Music URL"
                     value={audioUrl}
                     onChange={(e) => setAudioUrl(e.target.value)}
                     className="w-full bg-transparent text-white placeholder-white/20 px-4 py-4 border-b border-white/10 outline-none text-[10px] font-sans tracking-widest text-center focus:border-white/50 transition-colors"
                   />
                </div>

                <button 
                  onClick={() => setIsGiftShopOpen(false)}
                  className="mt-auto relative z-10 font-sans text-[9px] tracking-[0.4em] uppercase bg-white text-black px-10 py-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-white/90 transition-all"
                >
                  Seal Attachments
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY: INVENTORY VAULT */}
      <AnimatePresence>
        {isInventoryOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0d0221]/90 backdrop-blur-md"
             onClick={() => setIsInventoryOpen(false)}
           >
             <motion.div
               initial={{ y: 50, opacity: 0, scale: 0.95 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               exit={{ y: 50, opacity: 0, scale: 0.95 }}
               className="w-full max-w-sm bg-[#160430] border border-[#8a2be2]/30 rounded-2xl shadow-[0_0_50px_rgba(138,43,226,0.2)] overflow-hidden flex flex-col max-h-[80vh]"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                 <h3 className="text-[10px] font-sans tracking-[0.4em] uppercase text-white/60">Inventory Vault</h3>
                 <button onClick={() => setIsInventoryOpen(false)} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
               </div>
               <div className="p-6 overflow-y-auto flex flex-col gap-4">
                  {pearlState === 'INFUSED' && (
                    <div className="flex items-center justify-between p-4 bg-[#8a2be2]/10 border border-[#8a2be2]/30 rounded-xl">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, rgba(200, 220, 255, 0.4) 15%, ${AURA_COLORS[activeAura]}80 45%, #05000a 85%, #000 100%)` }}>
                             <Mic className="w-4 h-4 text-white mix-blend-overlay" />
                          </div>
                          <div>
                            <div className="text-[9px] font-sans tracking-widest text-cyan-400 font-bold mb-1">EXSO PEARL</div>
                            <div className="text-[8px] font-sans tracking-wider text-gray-500 uppercase">Audio Infused Matter</div>
                          </div>
                       </div>
                       <button onClick={() => {
                          setPearlState('IDLE');
                          setPearlKey(k => k + 1);
                          if (primaryMedia.length === 0) setIsInventoryOpen(false);
                       }} className="p-2 text-white/40 hover:text-red-400 bg-white/5 rounded-lg hover:bg-red-400/20 transition-colors">
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  )}
                  
                  {primaryMedia.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black/50 rounded flex items-center justify-center overflow-hidden">
                             {file.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-80" />
                             ) : (
                                <Camera className="w-4 h-4 text-white/30" />
                             )}
                          </div>
                          <div>
                            <div className="text-[9px] font-sans tracking-widest text-white/80 line-clamp-1 w-32 md:w-48 mb-1">{file.name}</div>
                            <div className="text-[8px] font-sans tracking-wider text-gray-500 uppercase">Visual Matter</div>
                          </div>
                       </div>
                       <button onClick={() => {
                          setPrimaryMedia(prev => prev.filter((_, i) => i !== idx));
                          if (primaryMedia.length === 1 && pearlState !== 'INFUSED') setIsInventoryOpen(false);
                       }} className="p-2 text-white/40 hover:text-red-400 bg-white/5 rounded-lg hover:bg-red-400/20 transition-colors">
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  ))}

                  {primaryMedia.length === 0 && pearlState !== 'INFUSED' && (
                     <div className="py-12 text-center text-[9px] font-sans tracking-widest text-white/30 uppercase">
                        Vault Is Empty
                     </div>
                  )}
               </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
