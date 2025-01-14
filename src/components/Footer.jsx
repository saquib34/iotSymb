import React from 'react';

const Footer = () => {
  return (
    <footer className=" bg-[#030712] overflow-hidden text-gray-400 py-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} InBot. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
