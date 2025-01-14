import React from 'react';
import IoTLanding from '../components/LandingComponent';
import DepartmentSection from '../components/DepartmentSection';

const LandingPage = () => {
  return (
    <main className="relative">
      <section className="relative z-10">
        <IoTLanding />
      </section>
      <section className="relative z-[50]">
  <DepartmentSection />
</section>

    </main>
  );
};

export default LandingPage;