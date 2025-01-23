import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
 { 
   text: "Preparing Launch Sequence...",
   color: "#4CAF50",
   pathColor: "linear-gradient(90deg, #4CAF50, #81C784)",
   time: 2,
   path: "M 0,400 L 0,300"
 },
 { 
   text: "Igniting Engines...",
   color: "#2196F3",
   pathColor: "linear-gradient(90deg, #2196F3, #64B5F6)", 
   time: 2,
   path: "M 0,300 L 0,200"
 },
 {
   text: "Breaking Iot Atmosphere...",
   color: "#9C27B0",
   pathColor: "linear-gradient(90deg, #9C27B0, #BA68C8)",
   time: 2,
   path: "M 0,200 L 0,100"
 },
 {
   text: "Reaching Orbit",
   color: "#f44336",
   pathColor: "linear-gradient(90deg, #f44336, #ef9a9a)",
   time: 2,
   path: "M 0,100 L 0,0"
 },
 {
  text: "Landing SRM RAMAPURAM",
  color: "#f44336",
  pathColor: "linear-gradient(90deg, #f44336, #ef9a9a)",
  time: 2,
  path: "M 0,100 L 0,0"
}
];

const RocketLaunch = () => {
 const [stage, setStage] = useState(-1);
 const [showConfetti, setShowConfetti] = useState(false);
 const [path, setPath] = useState([]);
 const [timer, setTimer] = useState(3);
 const [isCountingDown, setIsCountingDown] = useState(false);
 const [hasStarted, setHasStarted] = useState(false);
 const [rocketPosition, setRocketPosition] = useState({ x: 0, y: 400 });
 const svgRef = useRef(null);
 const audioContextRef = useRef(null);
 const goSoundRef = useRef(null);
 const successSoundRef = useRef(null);

 const getFullPath = () => stages.map(s => s.path).join(' ');

 const calculateRocketPosition = (currentStage, progress) => {
   if (currentStage < 0) return { x: 0, y: 400 };
   const startY = 400 - (currentStage * 100);
   const endY = startY - 100;
   const currentY = startY - (progress * 100);
   return { x: 0, y: currentY };
 };

 const createBeep = (frequency = 440, duration = 0.1, volume = 0.5) => {
   if (!audioContextRef.current) return;
   
   const oscillator = audioContextRef.current.createOscillator();
   const gainNode = audioContextRef.current.createGain();
   
   oscillator.connect(gainNode);
   gainNode.connect(audioContextRef.current.destination);
   
   oscillator.frequency.value = frequency;
   gainNode.gain.value = volume;
   
   oscillator.start(audioContextRef.current.currentTime);
   oscillator.stop(audioContextRef.current.currentTime + duration);
 };

 const playSound = async (audioRef) => {
   try {
     if (!audioRef.current) return;
     
     if (audioRef.current.readyState < 4) {
       await new Promise((resolve) => {
         audioRef.current.addEventListener('canplaythrough', resolve, { once: true });
       });
     }
     
     audioRef.current.currentTime = 0;
     await audioRef.current.play();
   } catch (error) {
     console.error('Error playing sound:', error);
   }
 };

 useEffect(() => {
   const initAudio = async () => {
     audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
     
     goSoundRef.current = new Audio('/321go.wav');
     successSoundRef.current = new Audio('/success.wav');

     await Promise.all([
       goSoundRef.current.load(),
       successSoundRef.current.load()
     ]);
   };

   initAudio();
   
   return () => {
     if (audioContextRef.current) {
       audioContextRef.current.close();
     }
   };
 }, []);

 const startSequence = async () => {
   if (hasStarted) return;
   setHasStarted(true);
   setIsCountingDown(true);
   
   try {
     if (audioContextRef.current?.state === 'suspended') {
       await audioContextRef.current.resume();
     }

     // Initial countdown with beeps
     for (let i = 3; i > 0; i--) {
       setTimer(i);
       createBeep(440 + (i * 100), 0.15, 0.3);
       await new Promise(resolve => setTimeout(resolve, 1000));
     }
     
     setIsCountingDown(false);
     await playSound(goSoundRef);
     setTimer(stages[0]?.time || 2);

     // Launch sequence
     for (let i = 0; i < stages.length; i++) {
       setStage(i);
       setTimer(stages[i].time);
       
       const startTime = Date.now();
       const duration = stages[i].time * 1000;

       while (Date.now() - startTime < duration) {
         const progress = (Date.now() - startTime) / duration;
         const position = calculateRocketPosition(i, progress);
         setRocketPosition(position);
         setTimer(Math.ceil((duration - (Date.now() - startTime)) / 1000));
         await new Promise(resolve => setTimeout(resolve, 16));
       }

       setPath(prev => [...prev, stages[i].path]);
       if (i < stages.length - 1) {
         createBeep(880, 0.1, 0.2);
       }
     }
     
     setShowConfetti(true);
     await playSound(successSoundRef);
     setTimeout(() => {
       window.location.href = '/';
     }, 2000);
   } catch (error) {
     console.error('Error in sequence:', error);
   }
 };

 return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
 
      {/* SVG Paths */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="-200 -100 400 600">
        <defs>
          {stages.map((_, i) => (
            <linearGradient key={i} id={`pathGrad${i}`}>
              <stop offset="0%" stopColor={stages[i].color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={stages[i].color} stopOpacity="0.2" />
            </linearGradient>
          ))}
        </defs>
 
        <path
          d={getFullPath()}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />
 
        {stages.map((s, i) => (
          <path
            key={i}
            id={`path-${i}`}
            d={s.path}
            stroke={i <= stage ? `url(#pathGrad${i})` : 'transparent'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Start Button or Countdown/Stage Text */}
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.button
            onClick={startSequence}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white text-black px-8 py-4 rounded-lg text-2xl font-bold
                     hover:bg-gray-200 transition-colors"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Start Launch
          </motion.button>
        ) : isCountingDown ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              key="countdown"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-8xl font-bold text-white"
            >
              {timer}
            </motion.div>
          </div>
        ) : stage >= 0 ? (
          <div className="absolute top-20 flex flex-col items-center gap-4">
            <motion.div
              key={`stage-${stage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-3xl font-bold"
              style={{ color: stages[stage].color }}
            >
              {stages[stage].text}
            </motion.div>
            <motion.div
              key={`timer-${stage}`}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-2xl font-mono"
              style={{ color: stages[stage].color }}
            >
              {timer}s
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Rocket */}
      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${rocketPosition.x}px, ${rocketPosition.y}px)`
        }}
        className="origin-center"
      >
       <svg width="40" height="120" viewBox="0 0 40 120">
         {/* Main rocket body - vertical design */}
         <path
           d="M20 0 L30 40 L30 90 L10 90 L10 40 Z"
           fill="url(#rocketGrad)"
           stroke="#fff"
           strokeWidth="1"
         />
         {/* Window */}
         <motion.circle
           cx="20"
           cy="30"
           r="5"
           fill="#00f2fe"
           animate={{ opacity: [0.5, 1] }}
           transition={{ duration: 1, repeat: Infinity }}
         />
         {/* Side fins - straight */}
         <path d="M10 90 L5 105 L10 95 Z" fill="#fff"/>
         <path d="M30 90 L35 105 L30 95 Z" fill="#fff"/>
         {/* Rocket flames - vertical */}
         <motion.path
           d="M15 105 Q20 120 25 105"
           fill="url(#flameGrad)"
           animate={{ scaleY: [1, 1.3, 1] }}
           transition={{ duration: 0.15, repeat: Infinity }}
         />
         <defs>
           <linearGradient id="rocketGrad" x1="0" y1="0" x2="1" y2="1">
             <stop offset="0%" stopColor="#fff"/>
             <stop offset="100%" stopColor="#ddd"/>
           </linearGradient>
           <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#f83600"/>
             <stop offset="100%" stopColor="#fee140"/>
           </linearGradient>
         </defs>
       </svg>

        {/* Smoke */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-gray-500/50"
              animate={{
                y: -200 - Math.random() * 100,
                x: (Math.random() - 0.5) * 100,
                opacity: [0, 0.5, 0],
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                left: `${Math.random() * 40 - 20}px`,
                bottom: `${Math.random() * 20}px`
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                top: '50%',
                left: '50%',
                scale: 0
              }}
              animate={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: [1, 0.5],
                opacity: [1, 0],
                rotate: [0, Math.random() * 360]
              }}
              transition={{
                duration: 2 + Math.random(),
                ease: "easeOut"
              }}
              style={{
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 10 + 5 + 'px',
                backgroundColor: [
                  '#FF69B4', '#FFD700', '#00CED1', '#FF6347',
                  '#98FB98', '#DDA0DD', '#87CEEB', '#F0E68C'
                ][Math.floor(Math.random() * 8)],
                clipPath: [
                  'circle(50%)',
                  'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  'polygon(50% 0%, 100% 100%, 0% 100%)'
                ][Math.floor(Math.random() * 3)]
              }}
            />
          ))}
        </div>
      )}
    </div>
 );
};

export default RocketLaunch;