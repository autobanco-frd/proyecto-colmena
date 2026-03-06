import React from 'react';

const SplashScreen = ({ onEnter }) => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Grid ciberpunk de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Efectos de glitch */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-purple-500/10 animate-pulse"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Logo/Título con efecto glitch */}
        <div className="mb-12 text-center">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4 animate-pulse"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)',
                  animation: 'glitch 3s infinite'
                }}>
              PROYECTO
            </h1>
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600"
                style={{
                  textShadow: '0 0 20px rgba(255, 255, 0, 0.5), 0 0 40px rgba(255, 255, 0, 0.3)',
                  animation: 'glitch 3s infinite 0.1s'
                }}>
              COLMENA
            </h1>
          </div>
          
          {/* Subtítulo */}
          <div className="mt-8 text-2xl md:text-3xl text-cyan-300 font-mono tracking-wider">
            ACCESO ANÓNIMO
          </div>
        </div>

        {/* Mensaje de privacidad */}
        <div className="max-w-md mx-auto mb-12 text-center">
          <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/50 backdrop-blur-sm"
               style={{
                 boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.05)'
               }}>
            <div className="space-y-4 text-cyan-100 font-mono text-sm">
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✓</span>
                <span>No rastreamos tu GPS</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✓</span>
                <span>No guardamos tus datos</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✓</span>
                <span>Sin registros de actividad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de entrada */}
        <button
          onClick={onEnter}
          className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold text-xl rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)',
            animation: 'pulse-border 2s infinite'
          }}
        >
          <span className="relative z-10 font-mono tracking-wider">ENTRAR</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Footer */}
        <div className="absolute bottom-6 text-center">
          <p className="text-cyan-500/50 font-mono text-xs">
            v1.0.0 • PRIVACIDAD ANTE TODO
          </p>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.4); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
