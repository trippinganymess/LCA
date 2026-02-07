import React, { useEffect, useState } from 'react';
import './Hero.css';
import heroImage from '../../assets/hero-bg.png';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scale from 1 to 3 based on scroll
  const scale = 1 + (scrollY / 400);
  // Fade out as we scroll down
  const opacity = Math.max(0, 1 - scrollY / 600);
  // Transform the text separately for a "moving away" effect
  const textTransform = `translateY(${scrollY * 0.4}px)`;

  return (
    <div className="hero-section">
      <div 
        className="hero-image" 
        style={{ 
          backgroundImage: `url(${heroImage})`,
          transform: `scale(${scale})`,
          opacity: opacity,
          visibility: opacity === 0 ? 'hidden' : 'visible'
        }}
      />
      <div className="hero-overlay" style={{ 
        opacity: opacity * 0.5,
        visibility: opacity === 0 ? 'hidden' : 'visible'
      }} />
      <div className="hero-content" style={{ 
        opacity, 
        transform: textTransform,
        visibility: opacity === 0 ? 'hidden' : 'visible'
      }}>
        <h1>LCA</h1>
        <div className="hero-divider" />
        <p>SCROLL TO EXPLORE</p>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel" />
          </div>
          <div className="arrow" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
