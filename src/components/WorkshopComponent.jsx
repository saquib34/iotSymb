import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Award } from 'lucide-react';
import gsap from 'gsap';
import WorkShopData from '../assets/workshopData.json';

const WorkShopComponent = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

  const handleEventClick = (event) => {
    if (React.startTransition) {
      React.startTransition(() => navigate(`/event-details/${event.name}`, { state: event }));
    } else {
      navigate(`/event-details/${event.name}`, { state: event });
    }
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#030712] overflow-hidden text-white relative">
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
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Upcoming Workshop
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover and participate in our exciting upcoming technical Workshop
          </p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {WorkShopData.map((event, index) => (
            <motion.div
              key={index}
              className="group bg-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-700 transform transition-all hover:scale-[1.02]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleEventClick(event)}
            >
              <div className="relative h-56">
                <img
                  src={`/${event.image}`}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                
                {/* Event Registration Fee Badge */}
                <div className="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  ₹{event.registrationFee}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-purple-400 transition-all">
                  {event.name}
                </h3>

                <p className="text-gray-300 line-clamp-2 text-sm">
                  {event.details}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="truncate">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="truncate">SRM Ramapuram</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Users className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="truncate">Team: {event.teamSize}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Award className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="truncate">{event.naacGrade || 'A+'}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-700/50 text-sm">
                  <p className="text-gray-400 truncate">
                    <span className="text-gray-300">Coordinator:</span> {event.studentCoordinator}
                  </p>
                </div>

                {/* View Details Button */}
                <motion.button
                  className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WorkShopComponent;
