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

  // Parallax and animation setup
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for features
      gsap.from('.feature-item', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top bottom-=100',
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: {
          amount: 0.5,
          from: "start"
        },
        ease: "power2.out"
      });

      // Subtle floating animation for icons
      gsap.to('.feature-icon', {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 1,
          from: "random"
        }
      });

      // Text and section reveal animations
      gsap.from('.text-reveal', {
        scrollTrigger: {
          trigger: '.text-reveal',
          start: 'top bottom-=50',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power1.out"
      });

      // Background dot animations
      const dots = document.querySelectorAll('.floating-dot');
      dots.forEach(dot => {
        gsap.to(dot, {
          x: 'random(-15, 15)',
          y: 'random(-15, 15)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-[#030712] overflow-hidden">
      {/* Floating Dots Background */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="floating-dot absolute w-2 h-2 rounded-full bg-blue-500 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 1
          }}
        />
      ))}

      <div className="container mx-auto px-4 space-y-20 relative z-10">
        {/* IoT Department Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="department-card relative rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Background Image with Parallax */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: y1 }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <img
              src={srmMainImage} 
              alt="SRM University Main"
              className="w-full h-full object-cover absolute inset-0"
            />
          </motion.div>

          {/* Content Overlay */}
          <div className="relative z-10 bg-black/70 backdrop-blur-sm p-8 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Department of IoT Innovation
            </h2>
            
            <div className="text-reveal space-y-6 mb-12">
              {["Welcome to the forefront of technological innovation at our IoT Department. Here, we're not just teaching technology—we're shaping the future of connected intelligence.",
                "Through our state-of-the-art laboratories and research centers, students engage with the latest IoT technologies, from smart sensors to advanced data analytics platforms.",
                "Our faculty comprises industry experts and researchers who bring real-world insights into the classroom, fostering a collaborative environment of innovation and discovery."
              ].map((paragraph, index) => (
                <motion.p 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-gray-300 leading-relaxed md:text-lg"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 features-grid">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1
                  }}
                  viewport={{ once: true }}
                  className="feature-item group flex items-start space-x-4 p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <feature.icon className="feature-icon w-8 h-8 text-blue-400 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SRM IST Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="department-card relative rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Background Image with Parallax */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: y2 }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <img
              src={srmBuildingImage} 
              alt="SRM University"
              className="w-full h-full object-cover absolute inset-0"
            />
          </motion.div>

          {/* Content Overlay */}
          <div className="relative z-10 bg-black/70 backdrop-blur-sm p-8 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              SRM Institute of Science and Technology
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6 text-reveal">
                {["SRM Institute of Science and Technology stands as a beacon of academic excellence, fostering innovation and nurturing future leaders.",
                  "Our commitment to excellence is reflected in our NAAC A++ accreditation and consistent rankings among India's top universities."
                ].map((paragraph, index) => (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-gray-300 leading-relaxed md:text-lg"
                  >
                    {paragraph}
                  </motion.p>
                ))}
                
                <div className="flex flex-wrap gap-6 mt-8">
                  {[
                    { label: "NAAC Grade", value: "A++" },
                    { label: "Student Body", value: "20,000+" },
                    { label: "Research Papers", value: "15,000+" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ delay: index * 0.2, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="stat-card bg-white/10 px-6 py-4 rounded-lg border border-white/20"
                    >
                      <span className="text-gray-400 font-semibold block mb-1">{stat.label}</span>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-reveal"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Excellence in Education</h3>
                  <ul className="space-y-4 text-gray-300">
                    {[
                      "Cutting-edge research facilities and innovation centers",
                      "Global collaborations with leading universities",
                      "Industry-aligned curriculum and training programs",
                      "Exceptional placement record with Fortune 500 companies"
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.4 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-reveal bg-white/10 p-6 rounded-xl border border-white/20"
                >
                  <h4 className="text-lg font-semibold text-white mb-3">World-Class Infrastructure</h4>
                  <p className="text-gray-300">
                    Our campus features modern smart classrooms, advanced research laboratories, innovation centers, and comprehensive sports facilities. The digital infrastructure supports seamless learning and research activities across disciplines.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentSection;