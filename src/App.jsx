import { BrowserRouter, Routes, Route } from "react-router-dom";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, Blog, Leadership, Certificates, Achievements, SocialLinks } from "./components";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Preloader from "./components/Preloader";

const Portfolio = () => (
  <div className='relative z-0 bg-primary'>
    <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
      <Navbar />
      <Hero />
    </div>
    <About />
    <Experience />
    <Tech />
    <Works />
    <Blog />
    <Leadership />
    <Certificates />
    <Achievements />
    <SocialLinks />
    <Feedbacks />
    <div className='relative z-0'>
      <Contact />
      <StarsCanvas />
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Preloader />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
