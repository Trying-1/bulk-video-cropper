'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import * as THREE from 'three';

const ParticleBackground: React.FC<{ quality?: 'low' | 'medium' | 'high' }> = ({ quality = 'medium' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  // Detect if device is low-end (prefer-reduced-motion is a good proxy)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Detect if device is likely low-performance
  const isLowPerformance = useMediaQuery('(max-width: 768px)') || prefersReducedMotion;
  
  // Determine particle count based on quality setting and device capability
  const getParticleCount = () => {
    if (prefersReducedMotion) return 0; // No particles for reduced motion
    if (isLowPerformance) return quality === 'low' ? 500 : 1000; // Reduced for mobile
    
    // For desktop
    switch(quality) {
      case 'low': return 1000;
      case 'high': return 5000;
      default: return 3500; // medium
    }
  };

  useEffect(() => {
    // Skip rendering for users who prefer reduced motion
    if (!containerRef.current || prefersReducedMotion) {
      setIsVisible(false);
      return;
    }
    
    // Set visibility based on performance considerations
    setIsVisible(true);

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Clear container and append renderer
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles with adaptive count based on device capability
    const particlesCount = getParticleCount();
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.5,
      vertexColors: true
    });

    // Create positions and colors for particles
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const tealColor = new THREE.Color(0x0d9488); // Teal color
    const orangeColor = new THREE.Color(0xf97316); // Orange color
    
    for (let i = 0; i < particlesCount; i++) {
      // Position particles in a wider sphere
      const radius = 15 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Interpolate between teal and orange based on position
      const color = new THREE.Color().lerpColors(
        tealColor, 
        orangeColor, 
        Math.random()
      );
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Animation function
    const animate = () => {
      particles.rotation.x += 0.0002;
      particles.rotation.y += 0.0003;
      
      // Make particles move slightly
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.002;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      scene.remove(particles);
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  // Don't render anything if not visible
  if (!isVisible) return null;
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        filter: 'blur(2.5px)',
        opacity: isLowPerformance ? 0.5 : 0.8 // Reduce opacity on low-end devices
      }}
      aria-hidden="true" // For accessibility
    />
  );
};

export default ParticleBackground;
