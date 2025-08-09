import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './scroll-to-top.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button 
          className="scroll-to-top focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
          onClick={scrollToTop}
          aria-label="Volver al inicio"
          title="Volver al inicio"
        >
          <FaArrowUp className="pointer-events-none" />
          <span className="visually-hidden">Volver al inicio</span>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton; 