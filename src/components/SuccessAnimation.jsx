import React, { useEffect, useState } from 'react';

const SuccessAnimation = ({ trigger, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="bg-green-500/90 backdrop-blur-sm rounded-2xl p-8 animate-bounce">
        <div className="text-center">
          <div className="text-6xl mb-4">🍯</div>
          <div className="text-white text-2xl font-bold">+1 Néctar!</div>
          <div className="text-green-100 mt-2">Marcador polinizado</div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
