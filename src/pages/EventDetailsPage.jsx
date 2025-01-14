import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Award, Info, Star } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import eventData from '../assets/eventData.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Import Footer component

gsap.registerPlugin(ScrollTrigger);

const EventDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state;
  console.log('Event:', event);
  var noOfParticipants = 1;
  if(event.name==="Intellect Summit") {
    noOfParticipants = 2;
  }
  const [formStep, setFormStep] = useState(1);
  const [numParticipants, setNumParticipants] = useState(noOfParticipants);
  const [formData, setFormData] = useState([
    {
      name: '',
      email: '',
      phone: '',
      college: '',
      collegeId: '',
    },
  ]);

  // Filter other events using useMemo
  const otherEvents = useMemo(() => {
    return eventData.filter(e => e.name !== event.name);
  }, [event.name]);

  // Initialize refs
  const headerRef = useRef(null);
  const detailsRef = useRef(null);
  const formRef = useRef(null);
  const cardsRef = useRef(null);
  const cardElements = useRef([]);

  // Debug logging
  useEffect(() => {
    console.log('Current event:', event.name);
    console.log('All events:', eventData.map(e => e.name));
    console.log('Filtered events:', otherEvents.map(e => e.name));
  }, [event.name, otherEvents]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Header animation
      if (headerRef.current) {
        tl.from(headerRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      }

      // Details section animation
      if (detailsRef.current?.children) {
        tl.from(detailsRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.4");
      }

      // Form animation
      if (formRef.current) {
        tl.from(formRef.current, {
          x: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.6");
      }

      // Cards animation
      if (cardsRef.current && cardElements.current.length > 0) {
        cardElements.current.forEach((card, index) => {
          if (card) {
            gsap.from(card, {
              y: 50,
              opacity: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top center+=100",
                toggleActions: "play none none reverse"
              }
            });
          }
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [otherEvents.length]);

  const handleInputChange = (index, e) => {
    const updatedFormData = [...formData];
    updatedFormData[index][e.target.name] = e.target.value;
    setFormData(updatedFormData);
  };

  const handleNumParticipantsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumParticipants(num);
    setFormData(
      Array.from({ length: num }, () => ({
        name: '',
        email: '',
        phone: '',
        college: '',
        collegeId: '',
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form submitted:', formData);
      alert('Registration successful!');
      setFormStep(1);
      setNumParticipants(1);
      setFormData([{
        name: '',
        email: '',
        phone: '',
        college: '',
        collegeId: '',
      }]);
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div ref={headerRef} className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-300 hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div ref={detailsRef} className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
                {event.name}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-purple-400" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                  <span>{event.venue}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-3 text-purple-400" />
                  <span>Team: {event.teamSize}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Award className="w-5 h-5 mr-3 text-purple-400" />
                  <span>NAAC: {event.naacGrade}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-colors">
                  <h3 className="flex items-center text-lg font-semibold mb-3">
                    <Info className="w-5 h-5 mr-2 text-purple-400" />
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{event.about}</p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-colors">
                  <h3 className="flex items-center text-lg font-semibold mb-3">
                    <Star className="w-5 h-5 mr-2 text-purple-400" />
                    Highlights
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{event.highlights}</p>
                </div>

                {/* Coordinators Section */}
                <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-300">
                      <span className="font-medium">Convener:</span> {event.convener}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Faculty Coordinator:</span> {event.facultyCoordinator}
                    </p>
                    <div className="flex items-center text-gray-300">
                      <span className="font-medium mr-2">Student Coordinator:</span>
                      <div className="flex items-center">
                        {event.studentCoordinator}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Fee Info */}
                <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-4">Registration Details</h3>
                  <div className="flex items-center text-gray-300">
                    <span className="font-medium">Registration Fee:</span>
                    <span className="ml-2 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                      ₹{event.registrationFee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div ref={formRef} className="lg:sticky lg:top-8 h-fit">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Register for {event.name}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formStep === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <label className="block">
                      <span className="text-gray-300 mb-2 block">Number of Team Members</span>
                      <select
                        value={numParticipants}
                        onChange={handleNumParticipantsChange}
                        className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        {event.name === "Intellect Summit" ? (
                          <>
                            <option value={2}>2 Members</option>
                            <option value={3}>3 Members</option>
                          </>
                        ) : (
                          Array.from(
                            { length: parseInt(event.teamSize.split('-')[1]) },
                            (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} {i === 0 ? 'Member' : 'Members'}
                              </option>
                            )
                          )
                        )}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg"
                    >
                      Next Step
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {formData.map((participant, index) => (
                      <div 
                        key={index} 
                        className="space-y-4 p-6 bg-gray-700/30 rounded-xl hover:bg-gray-700/40 transition-colors"
                      >
                        <h3 className="font-semibold text-lg text-gray-200">
                          Participant {index + 1}
                        </h3>
                        
                        <input
                          type="text"
                          name="name"
                          value={participant.name}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Full Name"
                          className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />
                        
                        <input
                          type="email"
                          name="email"
                          value={participant.email}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Email Address"
                          className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />
                        
                        <input
                          type="tel"
                          name="phone"
                          value={participant.phone}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Phone Number"
                          className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />

                        <input
                          type="text"
                          name="college"
                          value={participant.college}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="College Name"
                          className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />

                        <input
                          type="text"
                          name="collegeId"
                          value={participant.collegeId}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="College ID"
                          className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    ))}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                      >
                        Back
                      </button>
                      
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg"
                      >
                        Register Now
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Other Events Section */}
        <div ref={cardsRef} className="mt-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Other Events
          </h2>
          
          <p className="text-gray-400 mb-4">
            Showing {otherEvents.length} other events
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherEvents.map((otherEvent, index) => (
              <motion.div
                key={otherEvent.name}
                ref={el => cardElements.current[index] = el}
                className="group bg-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-700 transform transition-all hover:scale-[1.02]"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48">
                  <img
                    src="/api/placeholder/400/300"
                    alt={otherEvent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    ₹{otherEvent.registrationFee}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-purple-400">
                    {otherEvent.name}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{otherEvent.details}</p>
                  <div className="space-y-2">
                    <p className="text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      {otherEvent.date}
                    </p>
                    <p className="text-gray-400 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                      {otherEvent.venue}
                    </p>
                    <p className="text-gray-400 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-purple-400" />
                      Team Size: {otherEvent.teamSize}
                    </p>
                  </div>

                  {/* Student Coordinator Info */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-gray-400 text-sm">
                      <span className="text-gray-300">Coordinator:</span> {otherEvent.studentCoordinator}
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate(`/event-details/${otherEvent.name}`, { state: otherEvent })}
                    className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer component */}
    </div>
  );
};

export default EventDetailsPage;