import React from 'react';
import IoTLanding from '../components/LandingComponent';
import DepartmentSection from '../components/DepartmentSection';
import EventComponent from '../components/EventComponent';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import WorkShopComponent from '../components/WorkshopComponent'
const LandingPage = () => {
  return (
    <main className="relative">
      <Navbar />
      <section className="relative z-10">
        <IoTLanding />
      </section>
      <section className="relative z-20" id="events">
        <EventComponent />
      </section>
      <section className="relative z-20" id="workshops">
        <WorkShopComponent />
      </section>
      <section className="relative z-[50]" id="about">
        <DepartmentSection />
      </section>


      <section className="relative min-h-screen" id="contactus">
      <ContactForm />
      </section>
      <section className="relative z-[40] ">
        <Footer  />
      </section>
    </main>
  );
};

export default LandingPage;
