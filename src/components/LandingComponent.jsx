import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Smartphone, Cpu, Home, Camera, Database } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const IoTLanding = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
  const iconConfig = [
    { icon: Cloud, label: 'Cloud Computing' },
    { icon: Smartphone, label: 'Mobile IoT' },
    { icon: Cpu, label: 'Edge Computing' },
    { icon: Home, label: 'Smart Home' },
    { icon: Camera, label: 'Security' },
    { icon: Database, label: 'Big Data' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text animation timeline
      const textTimeline = gsap.timeline();
      textTimeline
        .set('.char-text', {
          opacity: 0,
          y: 100,
          rotateY: -90
        })
        .set('.subtitle-parts', {
          opacity: 0,
          x: -30
        })
        .to('.char-text', {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1,
          stagger: 0.05,
          ease: "back.out(1.7)",
        })
        .fromTo('.gradient-line',
          { width: '0%' },
          { 
            width: '100%',
            duration: 1,
            ease: "power4.out"
          },
          "-=0.5"
        )
        .to('.subtitle-parts', {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.5");

      // SVG Animations
      gsap.to('.pulse-ring', {
        scale: [1, 1.5],
        opacity: [0.8, 0],
        duration: 2,
        repeat: -1,
        ease: "power1.inOut",
        stagger: 0.5
      });

      gsap.to('.circuit-line', {
        strokeDashoffset: [0, 100],
        duration: 2,
        repeat: -1,
        ease: "none"
      });

      gsap.to('.connection-line', {
        stroke: '#00f2fe',
        strokeDasharray: [0, 20],
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.2,
          from: "random"
        }
      });

      // Enhanced device node animations
      gsap.to('.device-node', {
        keyframes: [
          { scale: 1, duration: 0.5 },
          { scale: 1.2, duration: 0.3 },
          { scale: 1, duration: 0.5 }
        ],
        fill: gsap.utils.wrap(['#00f2fe', '#0ea5e9', '#38bdf8']),
        duration: 2,
        repeat: -1,
        stagger: 0.3
      });

      // Floating icon animations
      gsap.to('.floating-icon', {
        y: 'random(-10, 10)',
        x: 'random(-10, 10)',
        rotation: 'random(-10, 10)',
        duration: 'random(2, 4)',
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "random"
        },
        repeat: -1,
        yoyo: true
      });

      // Advanced SVG animations
      gsap.to('.data-paths path', {
        strokeDashoffset: 200,
        duration: 2,
        repeat: -1,
        ease: "none",
        stagger: {
          each: 0.3,
          from: "random"
        }
      });

      gsap.to('.core', {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      gsap.to('.pulse-system circle', {
        scale: 1.2,
        opacity: 0.5,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.5
        }
      });

      // Background particle animations
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => {
        gsap.to(particle, {
          x: 'random(-150, 150)',
          y: 'random(-150, 150)',
          opacity: 'random(0.2, 0.7)',
          scale: 'random(0.8, 1.2)',
          duration: 'random(2, 4)',
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#030712] overflow-hidden">
      {/* Background Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen pt-20">
        {/* Title */}
        <div className="absolute top-24 w-full text-center z-10 px-4">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold relative">
            {Array.from("IntBot 2025").map((char, i) => (
              <span 
                key={i} 
                className="char-text inline-block relative"
              >
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 text-transparent bg-clip-text">
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
            {/* <div className="gradient-line absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" /> */}
          </h1>
          <div className="overflow-hidden">
            <p className="text-lg sm:text-xl lg:text-2xl mt-4 text-cyan-300/80">
              {["February 7, 2025", "•", "Future of Connected Intelligence"].map((text, i) => (
                <span key={i} className="subtitle-parts inline-block mx-2">{text}</span>
              ))}
            </p>
          </div>
        </div>

        {/* SVG Container */}
        <div className="w-full max-w-[800px] h-[400px] sm:h-[500px] lg:h-[600px] relative px-4 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full absolute"
            style={{ zIndex: 1 }}
            ref={svgRef}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
              <defs>
                {/* <!-- Advanced Gradients --> */}
                <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%" stopColor="#00f2fe">
                    <animate attributeName="stop-color" values="#00f2fe;#38bdf8;#00f2fe" dur="4s" repeatCount="indefinite"/>
                  </stop>
                  <stop offset="50%" stopColor="#38bdf8">
                    <animate attributeName="stop-color" values="#38bdf8;#00f2fe;#38bdf8" dur="4s" repeatCount="indefinite"/>
                  </stop>
                  <stop offset="100%" stopColor="#0ea5e9">
                    <animate attributeName="stop-color" values="#0ea5e9;#38bdf8;#0ea5e9" dur="4s" repeatCount="indefinite"/>
                  </stop>
                </linearGradient>

                {/* <!-- Advanced Circuit Pattern --> */}
                <pattern id="techPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M10,30 L50,30 M30,10 L30,50" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.3"/>
                  <rect x="25" y="25" width="10" height="10" fill="none" stroke="#00f2fe" opacity="0.2">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite"/>
                  </rect>
                  <circle cx="30" cy="30" r="2" fill="#00f2fe" opacity="0.3"/>
                </pattern>

                {/* <!-- Particle System --> */}
                <filter id="techGlow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feFlood floodColor="#00f2fe" floodOpacity="0.5" result="color"/>
                  <feComposite operator="in" in="color" in2="blur" result="softGlow"/>
                  <feMerge>
                    <feMergeNode in="softGlow"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                {/* <!-- Data Flow Animation --> */}
                <marker id="flowArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
                  <path d="M0,0 L10,5 L0,10 z" fill="#00f2fe">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                  </path>
                </marker>
              </defs>

              {/* <!-- Backdrop --> */}
              <rect width="800" height="600" fill="url(#techPattern)" opacity="0.1">
                <animate attributeName="opacity" values="0.1;0.2;0.1" dur="5s" repeatCount="indefinite"/>
              </rect>

              {/* <!-- Central Hub --> */}
              <g transform="translate(400,300)" filter="url(#techGlow)">
                {/* <!-- Rotating Outer Ring --> */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="20s"
                    repeatCount="indefinite"
                  />
                  <circle r="180" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="4,6"/>
                  <circle r="160" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="8,8">
                    <animate attributeName="stroke-dashoffset" values="0;100" dur="10s" repeatCount="indefinite"/>
                  </circle>
                </g>

                {/* <!-- Data Flow Paths --> */}
                <g className="data-paths">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <g key={i} transform={`rotate(${angle})`}>
                      <path
                        d={`M0,0 Q50,-80 100,-50`}
                        stroke="url(#techGrad)"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#flowArrow)"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="200;0"
                          dur={`${3 + i * 0.5}s`}
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  ))}
                </g>

                {/* <!-- Pulse Rings --> */}
                <g className="pulse-system">
                  <circle r="50" fill="none" stroke="#00f2fe" strokeWidth="2">
                    <animate
                      attributeName="r"
                      values="50;70;50"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0.5;1"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="80" fill="none" stroke="#0ea5e9" strokeWidth="1.5">
                    <animate
                      attributeName="r"
                      values="80;100;80"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0.3;0.8"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                {/* <!-- Data Points --> */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <g key={i} transform={`rotate(${angle})`}>
                    <circle
                      cx="120"
                      cy="0"
                      r="6"
                      fill="#00f2fe"
                      filter="url(#techGlow)"
                    >
                      <animate
                        attributeName="r"
                        values="6;8;6"
                        dur="2s"
                        begin={`${i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}

                {/* <!-- Central Core --> */}
                <g className="core">
                  <circle r="30" fill="url(#techGrad)" opacity="0.3">
                    <animate
                      attributeName="opacity"
                      values="0.3;0.6;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <path
                    d="M-20,-20 L20,20 M-20,20 L20,-20"
                    stroke="#00f2fe"
                    strokeWidth="2"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="strokeDashoffset"
                      values="0;100"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </g>
            </svg>
          </motion.div>

          {/* Floating Icons */}
          {iconConfig.map(({ icon: Icon, label }, index) => (
            <motion.div
              key={index}
              className="floating-icon absolute z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              style={{
                left: `${45 + 30 * Math.cos(index * Math.PI / 3)}%`,
                top: `${45 + 30 * Math.sin(index * Math.PI / 3)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300" />
                <Icon 
                  className="w-8 sm:w-12 h-8 sm:h-12 text-cyan-400 relative z-10 group-hover:text-blue-400 transition-all duration-300 transform group-hover:rotate-12"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-sm text-cyan-400 whitespace-nowrap">{label}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full scale-0 group-hover:scale-150 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IoTLanding;