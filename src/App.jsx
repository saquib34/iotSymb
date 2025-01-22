// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventDetailsPage from './pages/EventDetailsPage';
import RocketLaunch from './pages/lauch'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/event-details/:name" element={<EventDetailsPage />} />
        <Route path="/launch" element={<RocketLaunch/>} />
      </Routes>
    </Router>
  );
};

export default App;