import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, Phone, MessageSquare, Loader } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
  
    try {
      // Create form data object
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        formDataObj.append(key, formData[key]);
      });
  
      // Submit using fetch with no-cors mode
      const response = await fetch(import.meta.env.VITE_GOOGLE_SHEET_API, {
        method: 'POST',
        mode: 'no-cors',
        body: formDataObj
      });
  
      // Since no-cors mode doesn't return readable response,
      // we'll assume success if we get here
      setStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
  
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient circles */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen"
            style={{
              background: `radial-gradient(circle, ${i === 0 ? '#06b6d4' : i === 1 ? '#3b82f6' : '#6366f1'}1a, transparent)`,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              filter: 'blur(60px)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Get in Touch
            </h2>
            <p className="text-gray-400 md:text-lg">
              Have questions about IoT Symposium? We'd love to hear from you.
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-cyan-900/10 to-blue-900/10 rounded-2xl p-8 backdrop-blur-md border border-cyan-500/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label className="block text-cyan-400 mb-2 text-sm font-medium">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-lg py-3 px-10 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-cyan-400 mb-2 text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-lg py-3 px-10 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-cyan-400 mb-2 text-sm font-medium">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-lg py-3 px-10 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Your Phone Number"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-cyan-400 mb-2 text-sm font-medium">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-lg py-3 px-10 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Your Message"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:from-cyan-600 hover:to-blue-600 transition-colors disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {isSubmitting ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </motion.button>
              </div>

              {/* Status Message */}
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center p-4 rounded-lg ${
                    status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {status.message}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;