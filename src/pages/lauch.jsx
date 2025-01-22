import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
 { 
   text: "Preparing Launch Sequence...",
   color: "#4CAF50",
   pathColor: "linear-gradient(90deg, #4CAF50, #81C784)",
   time: 2,
   path: "M 400,500 Q 350,400 300,350 T 200,250"
 },
 { 
   text: "Igniting Engines...",
   color: "#2196F3",
   pathColor: "linear-gradient(90deg, #2196F3, #64B5F6)", 
   time: 2,
   path: "M 200,250 Q 150,200 100,100 T 50,0"
 },
 {
   text: "Breaking Atmosphere...",
   color: "#9C27B0",
   pathColor: "linear-gradient(90deg, #9C27B0, #BA68C8)",
   time: 2,
   path: "M 50,0 Q 0,-100 -50,-200 T -100,-300"
 },
 {
   text: "Reaching Orbit!",
   color: "#f44336",
   pathColor: "linear-gradient(90deg, #f44336, #ef9a9a)",
   time: 2,
   path: "M -100,-300 Q -150,-400 -200,-450 T -250,-500"
 }
];

const RocketLaunch = () => {
 const [stage, setStage] = useState(-1);
 const [showConfetti, setShowConfetti] = useState(false);
 const [path, setPath] = useState([]);
 const [timer, setTimer] = useState(stages[0]?.time || 5);
 const [rocketPosition, setRocketPosition] = useState({ x: 0, y: 0, rotate: 0 });
 const svgRef = useRef(null);

 const getFullPath = () => stages.map(s => s.path).join(' ');

 const calculateRocketPosition = (currentStage, progress) => {
   if (!svgRef.current || currentStage < 0) return { x: 0, y: 0, rotate: 0 };

   const pathElement = svgRef.current.querySelector(`#path-${currentStage}`);
   if (!pathElement) return { x: 0, y: 0, rotate: 0 };

   const length = pathElement.getTotalLength();
   const point = pathElement.getPointAtLength(length * progress);
   const nextPoint = pathElement.getPointAtLength(Math.min(length, length * progress + 1));
   
   const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
   
   return {
     x: point.x,
     y: point.y,
     rotate: angle
   };
 };

 useEffect(() => {
   const sequence = async () => {
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
         await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
       }

       setPath(prev => [...prev, stages[i].path]);
     }
     
     setShowConfetti(true);
     setTimeout(() => window.location.href = '/', 2000);
   };
   sequence();
 }, []);

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
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="-500 -500 1000 1000">
        <defs>
          {stages.map((_, i) => (
            <linearGradient key={i} id={`pathGrad${i}`}>
              <stop offset="0%" stopColor={stages[i].color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={stages[i].color} stopOpacity="0.2" />
            </linearGradient>
          ))}
        </defs>
 
        {/* Full path preview */}
        <path
          d={getFullPath()}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />
 
        {/* Active path segments */}
        {stages.map((s, i) => (
          <path
            key={i}
            id={`path-${i}`}
            d={s.path}
            stroke={i <= stage ? `url(#pathGrad${i})` : 'transparent'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{
              filter: i <= stage ? 'url(#glow)' : 'none'
            }}
          />
        ))}
      </svg>

     {/* Stage Text and Timer */}
     <AnimatePresence mode="wait">
       {stage >= 0 && (
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
       )}
     </AnimatePresence>

     {/* Rocket */}
     <motion.div
       style={{
         position: 'absolute',
         left: `${rocketPosition.x}px`,
         top: `${rocketPosition.y}px`,
         transform: `rotate(${rocketPosition.rotate}deg)`
       }}
       className="origin-center"
     >
       <svg width="100" height="200" viewBox="0 0 100 200">
         <path
           d="M50 0 L80 120 L50 150 L20 120 Z"
           fill="url(#rocketGrad)"
           stroke="#fff"
           strokeWidth="2"
         />
         <motion.circle
           cx="50"
           cy="70"
           r="10"
           fill="#00f2fe"
           animate={{ opacity: [0.5, 1] }}
           transition={{ duration: 1, repeat: Infinity }}
         />
         <path d="M20 120 L0 160 L20 140 Z" fill="#fff"/>
         <path d="M80 120 L100 160 L80 140 Z" fill="#fff"/>
         <motion.path
           d="M35 170 Q50 220 65 170"
           fill="url(#flameGrad)"
           animate={{ scaleY: [1, 1.5, 1] }}
           transition={{ duration: 0.2, repeat: Infinity }}
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
         {Array.from({ length: 100 }).map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-2 h-2 rounded-full"
             initial={{ 
               top: '50%',
               left: '50%',
               scale: 0
             }}
             animate={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               scale: 1,
               opacity: [1, 0]
             }}
             transition={{
               duration: 1 + Math.random(),
               ease: "easeOut"
             }}
             style={{
               backgroundColor: [
                 '#ff0000', '#00ff00', '#0000ff', '#ffff00',
                 '#ff00ff', '#00ffff'
               ][Math.floor(Math.random() * 6)]
             }}
           />
         ))}
       </div>
     )}
   </div>
 );
};

export default RocketLaunch;