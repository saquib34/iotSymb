import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Anime from 'react-anime';

const LandingPage = () => {
  const matrixCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataNodes, setDataNodes] = useState([]);
  const [pulsePoints, setPulsePoints] = useState([]);

  useEffect(() => {
    // Matrix Rain Setup
    const setupMatrixRain = () => {
      const canvas = matrixCanvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();

      const matrix = "10ABCDEF";
      const drops = [];
      const fontSize = window.innerWidth < 768 ? 10 : 14;
      const columns = canvas.width / fontSize;

      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }

      const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < drops.length; i++) {
          const text = matrix[Math.floor(Math.random() * matrix.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          const gradient = ctx.createLinearGradient(x, y - fontSize, x, y);
          gradient.addColorStop(0, '#00ff00');
          gradient.addColorStop(1, '#00ffff');
          ctx.fillStyle = gradient;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(text, x, y);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };

      const matrixInterval = setInterval(drawMatrix, 33);
      return () => {
        clearInterval(matrixInterval);
        window.removeEventListener('resize', handleResize);
      };
    };

    // Initialize animated elements
    const initializeAnimations = () => {
      // Create grid of data nodes
      const nodeCount = window.innerWidth < 768 ? 20 : 40;
      const nodes = [];
      const gridSize = Math.sqrt(nodeCount);
      const spacingX = window.innerWidth / (gridSize + 1);
      const spacingY = window.innerHeight / (gridSize + 1);

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          nodes.push({
            id: i * gridSize + j,
            x: spacingX * (j + 1) + (Math.random() - 0.5) * 50,
            y: spacingY * (i + 1) + (Math.random() - 0.5) * 50,
            size: Math.random() * 10 + 5
          });
        }
      }
      setDataNodes(nodes);

      // Create pulse points
      const points = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5
      }));
      setPulsePoints(points);
    };

    setupMatrixRain();
    initializeAnimations();
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden" ref={containerRef}>
      <canvas ref={matrixCanvasRef} className="absolute inset-0 opacity-20" />
      
      <AnimatePresence>
        {isLoaded && (
          <>
            {/* Data Node Grid */}
            <Anime
              targets=".data-node"
              translateX={function(el) {
                const range = window.innerWidth < 768 ? 20 : 40;
                return [range * -1, range];
              }}
              translateY={function(el) {
                const range = window.innerWidth < 768 ? 20 : 40;
                return [range * -1, range];
              }}
              scale={[1, 1.2]}
              opacity={[0.3, 0.8]}
              duration={4000}
              loop={true}
              delay={(el, i) => i * 100}
              direction="alternate"
              easing="easeInOutSine"
            >
              {dataNodes.map(node => (
                <div
                  key={node.id}
                  className="data-node absolute rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.size,
                    height: node.size,
                    filter: 'blur(1px)',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                  }}
                />
              ))}
            </Anime>

            {/* Pulse Points */}
            <Anime
              targets=".pulse-point"
              scale={[1, 4]}
              opacity={[0.5, 0]}
              duration={3000}
              loop={true}
              delay={(el, i) => i * 200}
              easing="easeOutExpo"
            >
              {pulsePoints.map(point => (
                <div
                  key={point.id}
                  className="pulse-point absolute rounded-full bg-cyan-400/30"
                  style={{
                    left: point.x,
                    top: point.y,
                    width: '8px',
                    height: '8px',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </Anime>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 min-h-screen flex items-center justify-center px-4"
            >
              <div className="text-center max-w-4xl mx-auto">
                <Anime
                  targets=".title-text"
                  translateY={[-30, 0]}
                  opacity={[0, 1]}
                  delay={(el, i) => i * 300}
                  duration={1500}
                  easing="easeOutExpo"
                >
                  <h1 className="title-text text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-8">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">
                      IoT Symposium 2025
                    </span>
                  </h1>
                  <p className="title-text text-lg md:text-2xl lg:text-3xl mb-8 md:mb-12">
                    <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                      Connecting Tomorrow • Innovating Today
                    </span>
                  </p>
                </Anime>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <Anime
                    targets=".btn-anime"
                    translateY={[50, 0]}
                    opacity={[0, 1]}
                    delay={(el, i) => 800 + i * 200}
                    duration={1000}
                    easing="easeOutExpo"
                  >
                    <motion.button
                      className="btn-anime px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-blue-500/20 
                               border border-cyan-400/30 rounded-full text-lg md:text-xl font-semibold relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 text-cyan-400">Register Now</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-cyan-500/30 to-blue-500/30"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.button>
                    
                    <motion.button
                      className="btn-anime px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
                               border border-purple-400/30 rounded-full text-lg md:text-xl font-semibold relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 text-purple-400">View Schedule</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.button>
                  </Anime>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;