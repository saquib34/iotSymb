import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Award, Info, Star, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import eventData from '../assets/eventData.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import config from '../config/config';

gsap.registerPlugin(ScrollTrigger);

const EventDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state;
  
  // Initialize participant number based on event
  const initialParticipants = event.name === "Intellect Summit" ? 2 : 1;
  
  // Form state
  const [formStep, setFormStep] = useState(1);
  const [numParticipants, setNumParticipants] = useState(initialParticipants);
  const [formData, setFormData] = useState([
    {
      name: '',
      email: '',
      phone: '',
      college: '',
      collegeId: '',
    },
  ]);

  // File upload and payment state
  const [files, setFiles] = useState({
    idCards: [],
    transactionScreenshot: null
  });
  const [transactionId, setTransactionId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showWhatsAppLink, setShowWhatsAppLink] = useState(false);
  const whatsappLink = "https://chat.whatsapp.com/JAlIQaAJRBF0Bo50yvXO6F"; // Replace with actual link

  // Filter other events
  const otherEvents = useMemo(() => {
    return eventData.filter(e => e.name !== event.name);
  }, [event.name]);

  // Refs for animations
  const headerRef = useRef(null);
  const detailsRef = useRef(null);
  const formRef = useRef(null);
  const cardsRef = useRef(null);
  const cardElements = useRef([]);

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

  // Handle form input changes
  const handleInputChange = (index, e) => {
    const updatedFormData = [...formData];
    updatedFormData[index][e.target.name] = e.target.value;
    setFormData(updatedFormData);
  };

  // Handle participant number changes
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
    // Reset files array for new number of participants
    setFiles(prev => ({
      ...prev,
      idCards: Array(num).fill(null)
    }));
  };

  // Handle file uploads
  const handleFileChange = (e, index, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'idCard') {
        const newIdCards = [...files.idCards];
        newIdCards[index] = file;
        setFiles(prev => ({
          ...prev,
          idCards: newIdCards
        }));
      } else if (type === 'transaction') {
        setFiles(prev => ({
          ...prev,
          transactionScreenshot: file
        }));
      }
    }
  };

  // Form submission

// Add this helper function at the top level of your component
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Replace your existing handleSubmit with this version
const handleSubmit = async (e) => {
  e.preventDefault();
  setUploading(true);

  const SCRIPT_URL = config.GOOGLE_SCRIPT_URL;

  try {
    // First convert all files to base64
    const idCardPromises = files.idCards.map(file => 
      file ? convertFileToBase64(file) : Promise.resolve('')
    );
    
    const transactionPromise = files.transactionScreenshot 
      ? convertFileToBase64(files.transactionScreenshot)
      : Promise.resolve('');

    // Wait for all file conversions to complete
    const [idCardImages, transactionImage] = await Promise.all([
      Promise.all(idCardPromises),
      transactionPromise
    ]);

    // Prepare submission data
    const submissionData = {
      participants: formData.map((participant, index) => ({
        ...participant,
        eventName: event.name,
        registrationDate: new Date().toISOString(),
        idCardImage: idCardImages[index],
      })),
      transactionId: transactionId,
      transactionImage: transactionImage,
      totalAmount: event.registrationFee * numParticipants
    };

    console.log('Submitting data:', submissionData); // Debug log

    // Make the fetch request
    const response = await fetch(SCRIPT_URL, {
      redirect: 'follow',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      mode: 'cors',
      body: JSON.stringify(submissionData)
    });

    // Since we're using no-cors, assume success if we get here
    setShowWhatsAppLink(true);
    alert('Registration successful! Please join the WhatsApp group for further updates.');
    
    // Reset form
    setFormStep(1);
    setNumParticipants(initialParticipants);
    setFormData([{
      name: '',
      email: '',
      phone: '',
      college: '',
      collegeId: '',
    }]);
    setFiles({
      idCards: [],
      transactionScreenshot: null
    });
    setTransactionId('');

  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed. Please try again: ' + error.message);
  } finally {
    setUploading(false);
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
                {/*<div className="flex items-center text-gray-300">
                  <Award className="w-5 h-5 mr-3 text-purple-400" />
                  <span>Prize Pool: ₹{event.prizePool}</span>
                </div>*/}
              </div>

              {/* Event details sections */}
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-colors">
                  <h3 className="flex items-center text-lg font-semibold mb-3">
                    <Info className="w-5 h-5 mr-2 text-purple-400" />
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{event.about}</p>
                </div>

                {/* Event Fee Info */}
                <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-4">Registration Fee</h3>
                  <div className="flex items-center text-gray-300">
                    <span className="font-medium">Per Team:</span>
                    <span className="ml-2 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                      ₹{event.registrationFee}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-300">
                      <span className="font-medium">Student Coordinator:</span> {event.studentCoordinator}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Faculty Coordinator:</span> {event.facultyCoordinator}
                    </p>
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
                        
                        <>
  {event.teamSize === "1" ? (
    <option key={1} value={1}>
      1 Member
    </option>
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
</>

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
                    {/* Payment Instructions Section */}
                    <div className="bg-gray-700/30 rounded-xl p-6">
                      <h3 className="font-semibold text-lg text-gray-200 mb-4">
                        Payment Details
                      </h3>
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          Total Amount: ₹{event.registrationFee }
                        </p>
                        
                        {/* QR Code Container */}
                        <div className="bg-white p-4 rounded-lg w-48 mx-auto">
                          <img
                            src="/qr-code.jpg" // Replace with your QR code image path
                            alt="Payment QR Code"
                            className="w-full"
                          />
                        </div>
                        
                        <div className="text-sm text-gray-400 space-y-2">
                          <p>1. Scan the QR code above to make the payment</p>
                          <p>2. Save the screenshot of successful payment</p>
                          <p>3. Enter the transaction ID below</p>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details Section */}
                    <div className="bg-gray-700/30 rounded-xl p-6">
                      <h3 className="font-semibold text-lg text-gray-200 mb-4">
                        Transaction Details
                      </h3>
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter Transaction ID/UPI Reference"
                          className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Upload Payment Screenshot
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, null, 'transaction')}
                            className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            required
                          />
                          {files.transactionScreenshot && (
                            <p className="text-sm text-gray-400">
                              Selected: {files.transactionScreenshot.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Participant Forms */}
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

                        {/* ID Card Upload */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Upload College ID Card
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, index, 'idCard')}
                            className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            required
                          />
                          {files.idCards[index] && (
                            <p className="text-sm text-gray-400">
                              Selected: {files.idCards[index].name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Form Navigation */}
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
                        disabled={uploading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
                      >
                        {uploading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="animate-spin mr-2" />
                            Processing...
                          </span>
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>

              {/* WhatsApp Link After Success */}
              {showWhatsAppLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-500/30"
                >
                  <h3 className="font-semibold text-green-400 mb-2">Registration Successful!</h3>
                  <p className="text-gray-300 mb-4">
                    Please join our WhatsApp group for further updates and information.
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Join WhatsApp Group
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"></path>
                    </svg>
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Other Events Section */}
        
      </div>
      <Footer/>
   
    </div>
  );
};

export default EventDetailsPage;