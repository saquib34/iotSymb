import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Server, Database, Cpu, Shield, Globe, Code } from 'lucide-react';
import srmMainImage from '../assets/srm-main.png';
import srmBuildingImage from '../assets/srm-building.png';

gsap.registerPlugin(ScrollTrigger);

const DepartmentSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const features = [
    { 
      icon: Server, 
      title: "Advanced IoT Infrastructure", 
      desc: "State-of-the-art hardware labs and testing facilities" 
    },
    { 
      icon: Shield, 
      title: "Cybersecurity Excellence", 
      desc: "Cutting-edge security protocols and implementations" 
    },
    { 
      icon: Cpu, 
      title: "Edge Computing Innovation", 
      desc: "Next-generation processing solutions and research" 
    },
    { 
      icon: Database, 
      title: "Data Analytics Hub", 
      desc: "Advanced big data processing and analytics systems" 
    },
    { 
      icon: Globe, 
      title: "Global Connectivity", 
      desc: "Seamless integration across IoT ecosystems" 
    },
    { 
      icon: Code, 
      title: "Smart Development", 
      desc: "Modern development environments and tools" 
    }
  ];

  // Parallax effect for images
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced department card animations
      gsap.from('.department-card', {
        scrollTrigger: {
          trigger: '.department-card',
          start: 'top bottom-=200',
          end: 'top center',
          scrub: true, 
        },
        y: 50, // Less dramatic movement
        opacity: 1, // Start with opacity visible
        scale: 1, // Keep scale normal
        duration: 1,
        stagger: 0.2
      });
      
      // Ensure the department section remains visible
      gsap.to('.department-card', {
        scrollTrigger: {
          trigger: '.department-card',
          start: 'top center',
          end: 'bottom top',
          scrub: true,
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        duration: 1,
      });

      // Feature animations with stagger and scale
      gsap.from('.feature-item', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top bottom-=100',
        },
        y: 60,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        stagger: {
          amount: 1,
          from: "random"
        },
        ease: "elastic.out(1, 0.8)"
      });

      // Continuous floating animation for icons
      gsap.to('.feature-icon', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          amount: 2,
          from: "random"
        }
      });

      // Text reveal animations
      gsap.from('.text-reveal', {
        scrollTrigger: {
          trigger: '.text-reveal',
          start: 'top bottom-=50',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2
      });

      // Floating dots animation
      const dots = document.querySelectorAll('.floating-dot');
      dots.forEach(dot => {
        gsap.to(dot, {
          y: 'random(-20, 20)',
          x: 'random(-20, 20)',
          duration: 'random(1, 2)',
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-black py-20 z-20">
      {/* Floating Dots */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="floating-dot absolute w-2 h-2 rounded-full bg-blue-500 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      <div className="container mx-auto px-4 space-y-20">
        {/* IoT Department */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="department-card relative bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/20"
        >
          <motion.div
            className="absolute -z-10 top-0 right-0 w-full h-full opacity-10"
            style={{ y: y1 }}
          >
            <img
              src={srmMainImage} 
              alt="SRM University Main"
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-500 text-transparent bg-clip-text">
            Department of IoT Innovation
          </h2>
          
          <div className="text-reveal space-y-6 mb-12">
            <p className="text-gray-300 leading-relaxed md:text-lg">
              Welcome to the forefront of technological innovation at our IoT Department. Here, we're not just teaching technology—we're shaping the future of connected intelligence. Our department stands as a beacon of innovation, where cutting-edge research meets practical implementation.
            </p>
            <p className="text-gray-300 leading-relaxed md:text-lg">
              Through our state-of-the-art laboratories and research centers, students engage with the latest IoT technologies, from smart sensors to advanced data analytics platforms. Our curriculum integrates theoretical knowledge with hands-on experience, preparing students for the challenges of tomorrow's connected world.
            </p>
            <p className="text-gray-300 leading-relaxed md:text-lg">
              Our faculty comprises industry experts and researchers who bring real-world insights into the classroom. We foster a collaborative environment where students can work on innovative projects, participate in hackathons, and contribute to groundbreaking research.
            </p>
            <p className="text-gray-300 leading-relaxed md:text-lg">
              Join us at the Department of IoT Innovation and be part of a community that's driving the future of technology. Together, we'll explore the limitless possibilities of the Internet of Things and shape a smarter, more connected world.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="feature-item group flex items-start space-x-4 p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/10 hover:border-gray-700/30 transition-all duration-300"
              >
                <feature.icon className="feature-icon w-8 h-8 text-gray-400 flex-shrink-0 transition-transform group-hover:scale-110" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SRM IST Overview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="department-card relative bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/20"
        >
          <motion.div
            className="absolute -z-10 top-0 right-0 w-full h-full opacity-10"
            style={{ y: y2 }}
          >
            <img
              src={srmBuildingImage} 
              alt="SRM University"
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-500 text-transparent bg-clip-text">
            SRM Institute of Science and Technology
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-reveal">
              <p className="text-gray-300 leading-relaxed md:text-lg">
                SRM Institute of Science and Technology stands as a beacon of academic excellence, fostering innovation and nurturing future leaders. With over two decades of transformative education, we've established ourselves as one of India's premier educational institutions.
              </p>
              <p className="text-gray-300 leading-relaxed md:text-lg">
                Our commitment to excellence is reflected in our NAAC A++ accreditation and consistent rankings among India's top universities. Our sprawling campus hosts state-of-the-art facilities, research centers, and innovation labs that cater to over 20,000 students from across the globe.
              </p>
              
              <div className="flex flex-wrap gap-6 mt-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="stat-card bg-gray-800/50 px-6 py-4 rounded-lg border border-gray-700/20"
                >
                  <span className="text-gray-400 font-semibold">NAAC Grade</span>
                  <p className="text-3xl font-bold text-white mt-1">A++</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="stat-card bg-gray-800/50 px-6 py-4 rounded-lg border border-gray-700/20"
                >
                  <span className="text-gray-400 font-semibold">Student Body</span>
                  <p className="text-3xl font-bold text-white mt-1">20,000+</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="stat-card bg-gray-800/50 px-6 py-4 rounded-lg border border-gray-700/20"
                >
                  <span className="text-gray-400 font-semibold">Research Papers</span>
                  <p className="text-3xl font-bold text-white mt-1">15,000+</p>
                </motion.div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-reveal">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">Excellence in Education</h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Cutting-edge research facilities and innovation centers</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Global collaborations with leading universities</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Industry-aligned curriculum and training programs</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Exceptional placement record with Fortune 500 companies</span>
                  </li>
                </ul>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-reveal bg-gradient-to-r from-gray-800/30 to-gray-900/30 p-6 rounded-xl border border-gray-700/20"
              >
                <h4 className="text-lg font-semibold text-gray-300 mb-3">World-Class Infrastructure</h4>
                <p className="text-gray-300">
                  Our campus features modern smart classrooms, advanced research laboratories, innovation centers, and comprehensive sports facilities. The digital infrastructure supports seamless learning and research activities across disciplines.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentSection;