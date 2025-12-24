import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-gray-200 py-8 md:py-10 mt-auto shadow-lg relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
      
      <Container className="relative z-10">
        <div className="text-center py-2 md:py-3 px-2 md:px-0">
          <p className="m-0 text-black text-sm md:text-base font-normal tracking-wide md:tracking-[0.3px] leading-relaxed md:leading-normal">
            <span className="font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent text-lg md:text-xl tracking-wide md:tracking-[0.5px] hover:scale-110 inline-flex items-center gap-3 transition-transform duration-300">
              <img src="/LEARN.jpg" alt="Learnlytics Logo" className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200" />
              Learnlytics
            </span>
            <span className="mx-2 md:mx-3 text-black font-light">©</span>
            <span className="text-black font-semibold">2025</span>
            <span className="mx-3 md:mx-5 text-black font-light">|</span>
            <span className="text-black italic text-xs md:text-sm">
              A Power BI–Integrated Academic Analytics Platform
            </span>
            <span className="mx-3 md:mx-5 text-black font-light">|</span>
            <span className="text-accent font-semibold hover:text-accent-light transition-colors duration-300 inline-flex items-center gap-1">
              <span>by</span>
              <span className="font-bold">Heshan Jayaweera</span>
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

