import React, { Suspense, useRef, useEffect, useState } from 'react';

const ARViewer = ({ onTargetFound, onTargetLost }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const sceneRef = useRef(null);

  const startAR = async () => {
    if (isStarted) return;
    
    try {
      setIsLoading(true);
      window.logger?.addLog('Iniciando AR con A-Frame...', 'info');
      
      // Ocultar React UI y mostrar escena AR
      const rootElement = document.getElementById('root');
      const arScene = document.getElementById('ar-scene');
      
      if (!arScene) {
        throw new Error('Escena AR no encontrada en el DOM');
      }
      
      window.logger?.addLog('Mostrando escena A-Frame...', 'info');
      arScene.style.display = 'block';
      
      // Iniciar MindAR
      const mindARInstance = arScene.components['mindar-image'];
      if (!mindARInstance) {
        throw new Error('Componente MindAR no encontrado');
      }
      
      window.logger?.addLog('Iniciando motor MindAR...', 'info');
      await mindARInstance.start();
      
      setIsStarted(true);
      setIsLoading(false);
      window.logger?.addLog('AR iniciado exitosamente con A-Frame', 'success');
      
      // Eventos de detección
      arScene.addEventListener('targetFound', (event) => {
        window.logger?.addLog('Target encontrado con A-Frame', 'success');
        onTargetFound?.({ id: 'target-0' });
      });
      
      arScene.addEventListener('targetLost', (event) => {
        window.logger?.addLog('Target perdido con A-Frame', 'warning');
        onTargetLost?.();
      });
      
    } catch (err) {
      console.error('Error inicializando AR:', err);
      const errorMessage = `Error AR: ${err.message}`;
      window.logger?.addLog(errorMessage, 'error');
      alert(errorMessage);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const stopAR = () => {
    if (!isStarted) return;
    
    try {
      const arScene = document.getElementById('ar-scene');
      if (arScene) {
        const mindARInstance = arScene.components['mindar-image'];
        if (mindARInstance) {
          mindARInstance.stop();
        }
        arScene.style.display = 'none';
      }
      
      setIsStarted(false);
      window.logger?.addLog('AR detenido', 'info');
    } catch (err) {
      window.logger?.addLog(`Error deteniendo AR: ${err.message}`, 'error');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <p>Verifica que tu dispositivo soporta WebRTC</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {!isStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🍯</div>
              <h2 className="text-white text-2xl font-bold mb-2">Proyecto Colmena</h2>
              <p className="text-gray-300">Apunta a los marcadores hexagonales</p>
            </div>
            <button
              onClick={startAR}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              🚀 Start AR
            </button>
          </div>
        </div>
      )}
      
      {isLoading && isStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p>Iniciando cámara AR...</p>
          </div>
        </div>
      )}
      
      {isStarted && (
        <button
          onClick={stopAR}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold z-50"
        >
          🛑 Stop AR
        </button>
      )}
    </div>
  );
};

const ARViewerWrapper = (props) => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
    </div>
  }>
    <ARViewer {...props} />
  </Suspense>
);

export default ARViewerWrapper;
