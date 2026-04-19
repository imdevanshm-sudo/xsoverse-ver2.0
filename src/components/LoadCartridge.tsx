import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Mic, Check, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const screenVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 450, damping: 30, mass: 1 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.1, ease: 'easeOut' } }
};

export default function LoadCartridge() {
  const [expandedNode, setExpandedNode] = useState<'visuals' | 'audio' | null>(null);
  const [visualFiles, setVisualFiles] = useState<File[]>([]);
  const [audioUrl, setAudioUrl] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setVisualFiles(acceptedFiles);
    setExpandedNode(null); // Collapse after dropping
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [], 'video/*': [] }
  });

  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full px-8 pt-16 pb-28 relative z-10 w-full"
    >
      <h1 className="text-white/90 text-5xl font-pixel leading-[1.1] mb-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
        Load<br/>Cartridge
      </h1>

      <div className="flex flex-col items-center justify-center gap-10 relative flex-1 mb-8">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-1/2 w-[4px] h-[75%] bg-[#1a1a24] border-x border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 z-0" />

        {/* VISUALS NODE */}
        <div className="relative z-10 w-full flex justify-center">
          <motion.div
            layout
            onClick={() => {
              if (expandedNode !== 'visuals') setExpandedNode('visuals');
            }}
            {...(expandedNode === 'visuals' ? getRootProps() : {})}
            className={`
              rounded-[28px] bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-4 cursor-pointer
              border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_8px_0_#0a0a0f]
              transition-all duration-300 outline-none group overflow-hidden
              ${expandedNode === 'visuals' ? 'w-full h-48 active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_8px_0_#0a0a0f]' : 'w-32 h-32 hover:bg-white/10 active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_0px_0_#0a0a0f] active:translate-y-[8px]'}
              ${isDragActive ? 'border-[#34d399]/50 bg-[#34d399]/10' : ''}
            `}
          >
            {expandedNode === 'visuals' && <input {...getInputProps()} />}
            
            <AnimatePresence mode="wait">
              {expandedNode !== 'visuals' ? (
                <motion.div
                  key="collapsed-visuals"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0a0a0f] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border-b border-white/5">
                    {visualFiles.length > 0 ? (
                      <Check className="w-[20px] h-[20px] text-[#34d399] drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" strokeWidth={3} />
                    ) : (
                      <Camera className="w-[20px] h-[20px] text-[#34d399] drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    )}
                  </div>
                  <span className="font-pixel text-[18px] text-white/40 uppercase group-hover:text-white/70 transition-colors">
                    {visualFiles.length > 0 ? 'Loaded' : 'Visuals'}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded-visuals"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center px-4 w-full h-full justify-center"
                >
                  <ImageIcon className={`w-8 h-8 mb-3 ${isDragActive ? 'text-[#34d399]' : 'text-white/30'} transition-colors`} />
                  <span className="font-pixel text-lg text-white/70 uppercase">
                    {isDragActive ? 'Drop It Here' : 'Drop Matter'}
                  </span>
                  <span className="text-white/30 text-sm mt-1 uppercase tracking-widest">(Video or Photo)</span>
                  
                  {/* Close button layered inside */}
                  <div 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedNode(null);
                    }}
                  >
                    <span className="text-white/50 text-xs font-pixel">X</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* AUDIO NODE */}
        <div className="relative z-10 w-full flex justify-center">
          <motion.div
            layout
            onClick={() => {
              if (expandedNode !== 'audio') setExpandedNode('audio');
            }}
            className={`
              rounded-[28px] bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-4 cursor-pointer
              border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_8px_0_#0a0a0f]
              transition-all duration-300 outline-none group overflow-hidden
              ${expandedNode === 'audio' ? 'w-full h-48 px-6 active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_8px_0_#0a0a0f] cursor-default' : 'w-32 h-32 hover:bg-white/10 active:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_0px_0_#0a0a0f] active:translate-y-[8px]'}
            `}
          >
            <AnimatePresence mode="wait">
              {expandedNode !== 'audio' ? (
                <motion.div
                  key="collapsed-audio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0a0a0f] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border-b border-white/5">
                    {audioUrl ? (
                      <Check className="w-[20px] h-[20px] text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" strokeWidth={3} />
                    ) : (
                      <Mic className="w-[20px] h-[20px] text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                    )}
                  </div>
                  <span className="font-pixel text-[18px] text-white/40 uppercase group-hover:text-white/70 transition-colors">
                    {audioUrl ? 'Loaded' : 'Audio'}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded-audio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center w-full justify-center space-y-4"
                >
                  {/* Close button layered inside */}
                  <div 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedNode(null);
                    }}
                  >
                    <span className="text-white/50 text-xs font-pixel">X</span>
                  </div>

                  <input 
                    type="text" 
                    placeholder="Link Spotify/Apple URL"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full bg-[#0a0a0f]/80 text-white placeholder-white/30 rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-[#a855f7]/50 font-pixel text-sm tracking-wide z-10"
                  />
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-pixel">OR</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                  </div>
                  <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-pixel text-xs py-3 rounded-xl uppercase tracking-widest transition-colors z-10">
                    Upload Voice Note (.mp3)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
