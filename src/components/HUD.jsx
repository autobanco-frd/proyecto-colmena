import React from 'react';

const HUD = ({ nectar, onPanic }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-between items-start p-4">
        {/* Contador de Néctar */}
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 pointer-events-auto">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 font-bold text-lg">
              {nectar} Gotas de Néctar
            </span>
          </div>
        </div>

        {/* Botón de Pánico */}
        <button
          onClick={onPanic}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors pointer-events-auto"
        >
          🚨 Pánico
        </button>
      </div>
    </div>
  );
};

export default HUD;
