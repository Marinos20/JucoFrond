// Header.jsx
import React, { useState, useEffect, useRef } from 'react';

const AnimatedNavLink = ({ targetId, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="group relative inline-block overflow-hidden h-5 flex items-center text-sm"
    >
      <div className="flex flex-col transition-transform duration-500 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-gray-400 font-medium">{children}</span>
        <span className="text-white font-medium">{children}</span>
      </div>
    </a>
  );
};

export const Header = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef(null);

  const toggleMenu = () => setIsOpen((v) => !v);

  useEffect(() => {
    if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    if (isOpen) setHeaderShapeClass('rounded-2xl');
    else {
      shapeTimeoutRef.current = setTimeout(() => setHeaderShapeClass('rounded-full'), 300);
    }
    return () => shapeTimeoutRef.current && clearTimeout(shapeTimeoutRef.current);
  }, [isOpen]);

  const navLinksData = [
    { label: 'Fonctionnalités', targetId: 'features' },
    { label: 'Solution', targetId: 'solution' },
    { label: 'Contact', targetId: 'contact' },
  ];

  const logoElement = (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 -translate-x-1/2" />
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 -translate-x-1/2" />
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 -translate-y-1/2" />
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 -translate-y-1/2" />
    </div>
  );

  return (
    <>
      {/* Desktop Header */}
      <header className={`hidden lg:flex fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex-col items-center px-6 py-3 backdrop-blur-md border border-white/10 bg-black/80 ${headerShapeClass} transition-all duration-300`}>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            {logoElement}
            <span className="text-white font-black tracking-tighter text-sm">European Solidarity</span>
          </div>

          <nav className="flex items-center space-x-8">
            {navLinksData.map((link) => (
              <AnimatedNavLink key={link.targetId} targetId={link.targetId}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          <button onClick={onLoginClick} className="px-5 py-2 cursor-pointer text-xs font-black text-black bg-white rounded-full hover:bg-gray-100 transition">
            Connexion
          </button>
        </div>
      </header>

      {/* Mobile Hamburger */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-6 right-6 z-[110] w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-200"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-24 right-6 left-6 z-[105] transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'} bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6`}>
        <nav className="flex flex-col items-center space-y-6 mb-6">
          {navLinksData.map((link) => (
            <a key={link.targetId} href={`#${link.targetId}`} onClick={() => { setIsOpen(false); const el = document.getElementById(link.targetId); if(el) el.scrollIntoView({behavior: 'smooth'}); }} className="text-gray-300 font-bold hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <button onClick={onLoginClick} className="w-full py-3 text-sm font-black text-black bg-white rounded-xl">
          Connexion
        </button>
      </div>
    </>
  );
};
