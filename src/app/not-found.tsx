'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APP_IDENTITY } from '@/config/branding';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  
  // Automatically return to home page after 10 seconds with countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden stars-container">
        {/* Stars */}
        {[...Array(100)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white twinkle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 1}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Shooting stars */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`shooting-${i}`}
            className="absolute shooting-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              animationDelay: `${Math.random() * 15}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-xl w-full border border-white/20">
        <div className="flex flex-col items-center">
          {/* Animated video frame with glitch effect */}
          <div className="relative w-64 h-48 mb-6 bg-black rounded-md overflow-hidden border-4 border-gray-800 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Static TV noise effect */}
              <div className="absolute inset-0 opacity-30 bg-noise animate-noise"></div>
              
              {/* Glitchy 404 text */}
              <div className="text-6xl font-bold text-white glitch-text" data-text="404">404</div>
              
              {/* Video controls at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900 flex items-center px-2">
                <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-2">
            <h2 className="text-6xl font-black tracking-tighter text-center mega-glitch-text" data-text="OOPS!">OOPS!</h2>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mt-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-300">
                Video Not Found
              </span>
            </h1>
          </div>
          
          <p className="text-gray-300 mb-8 text-center max-w-md">
            Oops! Looks like this video was cropped out of existence. The frame you're looking for is missing from our timeline.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to home
            </Link>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Previous frame
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin mr-3"></div>
            <p className="text-gray-300">
              Redirecting in <span className="text-teal-400 font-bold">{countdown}</span> seconds...
            </p>
          </div>
          
          <p className="mt-8 text-gray-400 text-sm text-center">
            {APP_IDENTITY.copyright} | Crafting perfect frames, even for error pages.
          </p>
        </div>
      </div>
      
      {/* Add this style for the noise animation */}
      <style jsx global>{`
        /* Starry background */
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        .stars-container {
          background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
        }
        
        .twinkle {
          animation: twinkle var(--duration, 3s) infinite ease-in-out;
          box-shadow: 0 0 4px 1px white;
        }
        
        /* Shooting star effect */
        @keyframes shootingstar {
          0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(0); opacity: 0; }
          15% { transform: translateX(-150px) translateY(150px) rotate(-45deg) scale(1); opacity: 1; }
          70%, 100% { transform: translateX(-500px) translateY(500px) rotate(-45deg) scale(0.3); opacity: 0; }
        }
        
        .shooting-star {
          width: 100px;
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
          box-shadow: 0 0 10px 2px white;
          border-radius: 100px;
          animation: shootingstar var(--duration, 4s) infinite ease-out;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }
        
        /* TV noise effect */
        @keyframes noise {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        .animate-noise {
          animation: noise 1s infinite;
        }
        
        /* Normal glitch effect */
        @keyframes glitch {
          0% {
            text-shadow: -2px 0 #ff00ea, 2px 0 #00ffff;
            transform: translate(0);
          }
          25% {
            text-shadow: -2px 0 #00ffff, 2px 0 #ff00ea;
            transform: translate(-1px, 1px);
          }
          50% {
            text-shadow: -5px 0 #ff00ea, 3px 0 #00ffff;
            transform: translate(1px, -1px);
          }
          75% {
            text-shadow: 5px 0 #00ffff, -5px 0 #ff00ea;
            transform: translate(-1px, -2px);
          }
          100% {
            text-shadow: -2px 0 #ff00ea, 2px 0 #00ffff;
            transform: translate(0);
          }
        }
        
        .glitch-text {
          position: relative;
          animation: glitch 1.5s infinite alternate-reverse;
        }
        
        .glitch-text:before,
        .glitch-text:after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text:before {
          left: -2px;
          text-shadow: 2px 0 #ff00ea;
          clip-path: inset(0 0 0 0);
          animation: glitch 675ms infinite linear alternate-reverse;
        }
        
        .glitch-text:after {
          left: 2px;
          text-shadow: -2px 0 #00ffff;
          clip-path: inset(0 0 0 0);
          animation: glitch 375ms infinite linear alternate-reverse;
        }
        
        /* Mega glitch effect for OOPS */
        @keyframes mega-glitch {
          0% {
            text-shadow: -3px -3px 0 #ff00ea, 3px 3px 0 #00ffff;
            transform: translate(-2px, 2px) skew(2deg);
          }
          25% {
            text-shadow: 5px -1px 0 #ffcc00, -3px 1px 0 #00ffff;
            transform: translate(2px, -1px) skew(-3deg);
          }
          50% {
            text-shadow: -5px -3px 0 #ff00ea, 5px 3px 0 #9900ff;
            transform: translate(-4px, -2px) skew(4deg);
          }
          75% {
            text-shadow: 2px 2px 0 #ff6600, -2px -2px 0 #00ffcc;
            transform: translate(3px, 3px) skew(-2deg);
          }
          100% {
            text-shadow: -2px 2px 0 #ff00ea, 2px -2px 0 #00ffff;
            transform: translate(-2px, 2px) skew(1deg);
          }
        }
        
        .mega-glitch-text {
          position: relative;
          color: white;
          animation: mega-glitch 0.5s infinite;
          letter-spacing: -2px;
          transform-origin: center;
          text-transform: uppercase;
        }
        
        .mega-glitch-text:before,
        .mega-glitch-text:after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .mega-glitch-text:before {
          left: -4px;
          text-shadow: 4px 0 #ff00ea;
          animation: mega-glitch 750ms infinite;
        }
        
        .mega-glitch-text:after {
          left: 4px;
          text-shadow: -4px 0 #00ffff;
          animation: mega-glitch 375ms infinite;
        }
      `}</style>
    </div>
  );
}
