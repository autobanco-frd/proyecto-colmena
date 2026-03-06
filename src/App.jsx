import React, { useState, useCallback } from 'react';
import HUD from './components/HUD';
import ARViewer from './components/ARViewer';
import SuccessAnimation from './components/SuccessAnimation';
import SplashScreen from './components/SplashScreen';
import Logger from './components/Logger';
import { useNectar } from './hooks/useNectar';
import { getMarkerContent } from './utils/supabase';

function App() {
  const { nectar, addNectar, resetSession } = useNectar();
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  const handleEnterApp = useCallback(() => {
    setShowSplash(false);
    window.logger?.addLog('Usuario entró a la app', 'success');
  }, []);

  const handleTargetFound = useCallback(async (target) => {
    console.log('Marcador detectado:', target);
    window.logger?.addLog(`Marcador detectado: ${target.id}`, 'success');
    
    // Obtener contenido desde Supabase
    try {
      const content = await getMarkerContent(target.id);
      setCurrentMarker(content);
      window.logger?.addLog(`Contenido cargado: ${content.title}`, 'success');
    } catch (error) {
      window.logger?.addLog(`Error cargando contenido: ${error.message}`, 'error');
    }
    
    // Verificar si ya fue polinizado y añadir néctar
    const wasAdded = addNectar(target.id);
    if (wasAdded) {
      setShowSuccess(true);
      window.logger?.addLog('Néctar añadido (+1)', 'success');
    } else {
      window.logger?.addLog('Marcador ya polinizado', 'warning');
    }
  }, [addNectar]);

  const handleTargetLost = useCallback(() => {
    console.log('Marcador perdido');
    window.logger?.addLog('Marcador perdido', 'warning');
    setCurrentMarker(null);
  }, []);

  const handlePanic = useCallback(() => {
    window.logger?.addLog('Botón de pánico activado', 'warning');
    // Redirigir a Wikipedia instantáneamente
    window.location.href = 'https://es.wikipedia.org/wiki/Wikipedia:Portada';
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setShowSuccess(false);
  }, []);

  // Mostrar splash screen inicialmente
  if (showSplash) {
    return <SplashScreen onEnter={handleEnterApp} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Visor AR */}
      <ARViewer 
        onTargetFound={handleTargetFound}
        onTargetLost={handleTargetLost}
      />
      
      {/* HUD */}
      <HUD 
        nectar={nectar}
        onPanic={handlePanic}
      />
      
      {/* Animación de éxito */}
      <SuccessAnimation 
        trigger={showSuccess}
        onComplete={handleAnimationComplete}
      />
      
      {/* Información del marcador actual */}
      {currentMarker && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">
            {currentMarker.title}
          </h3>
          <p className="text-sm text-gray-300">
            {currentMarker.message}
          </p>
        </div>
      )}
      
      {/* Logger */}
      <Logger />
    </div>
  );
}

export default App;
