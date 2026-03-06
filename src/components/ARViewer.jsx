import React, { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ARViewer = ({ onTargetFound, onTargetLost }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const mindarThreeRef = useRef(null);

  const startAR = async () => {
    if (isStarted) return;
    
    try {
      setIsLoading(true);
      window.logger?.addLog('Iniciando proceso AR...', 'info');
      
      // Cargar MindAR desde CDN dinámicamente
      window.logger?.addLog('Cargando MindAR desde CDN...', 'info');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mind-ar-three@latest/dist/mindar-image-three.prod.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = () => {
          window.logger?.addLog('MindAR cargado exitosamente', 'success');
          resolve();
        };
        script.onerror = (error) => {
          window.logger?.addLog(`Error cargando MindAR: ${error.message}`, 'error');
          reject(error);
        };
        document.head.appendChild(script);
      });

      // Ahora MindAR está disponible globalmente
      const { MindARThree } = window;
      
      const videoElement = videoRef.current;
      if (!videoElement) {
        const error = 'Elemento de video no encontrado';
        window.logger?.addLog(error, 'error');
        throw new Error(error);
      }

      // Cargar targets.mind
      window.logger?.addLog('Cargando targets.mind...', 'info');
      const targetsPath = './targets.mind';
      window.logger?.addLog(`Ruta de marcadores: ${targetsPath}`, 'info');

      // Configurar MindAR con optimización de tracking
      window.logger?.addLog('Configurando MindAR con parámetros optimizados...', 'info');
      const mindarThree = new MindARThree.MindARThree({
        container: document.body,
        imageTargetSrc: targetsPath,
        missTolerance: 0.8,
        filterMinCF: 0.0001,
        filterBeta: 0.001,
      });

      mindarThreeRef.current = mindarThree;
      window.logger?.addLog('MindAR configurado exitosamente', 'success');

      const { renderer, scene, camera } = mindarThree;

      // Cargar video bee.mp4
      window.logger?.addLog('Cargando video bee.mp4...', 'info');
      const videoPath = './bee.mp4';
      videoElement.src = videoPath;
      window.logger?.addLog(`Ruta de video: ${videoPath}`, 'info');

      // Esperar a que el video esté listo
      await new Promise((resolve, reject) => {
        videoElement.onloadeddata = () => {
          window.logger?.addLog('Video cargado exitosamente', 'success');
          resolve();
        };
        videoElement.onerror = (error) => {
          window.logger?.addLog(`Error cargando video: ${error.message}`, 'error');
          reject(error);
        };
      });

      // Crear material con shader para Chroma Key optimizado
      window.logger?.addLog('Creando shader Chroma Key...', 'info');
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `;

      const fragmentShader = `
        uniform sampler2D uVideo;
        uniform float uThreshold;
        uniform float uSmoothing;
        varying vec2 vUv;
        
        void main() {
          vec4 color = texture2D(uVideo, vUv);
          
          // Chroma Key para verde (#00ff00) con suavizado
          float green = color.g;
          float red = color.r;
          float blue = color.b;
          
          // Calcular distancia del color verde puro
          float dist = length(vec3(red, green - 1.0, blue));
          
          // Suavizar bordes con uSmoothing
          float alpha = 1.0 - smoothstep(uThreshold - uSmoothing, uThreshold + uSmoothing, dist);
          
          // Descartar píxeles completamente transparentes
          if (alpha < 0.01) discard;
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `;

      // Crear plano para video con shader
      const videoTexture = new THREE.VideoTexture(videoElement);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      
      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uVideo: { value: videoTexture },
          uThreshold: { value: 0.3 },
          uSmoothing: { value: 0.05 }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });

      const geometry = new THREE.PlaneGeometry(1, 1);
      const videoPlane = new THREE.Mesh(geometry, shaderMaterial);

      // Añadir a la escena
      scene.add(videoPlane);
      window.logger?.addLog('Shader y plano de video creados', 'success');

      // Eventos de detección
      mindarThree.addVideo(videoElement);
      
      mindarThree.onTargetFound = (target) => {
        window.logger?.addLog(`Target encontrado: ${target.id || 'desconocido'}`, 'success');
        onTargetFound?.(target);
        videoPlane.visible = true;
      };

      mindarThree.onTargetLost = () => {
        window.logger?.addLog('Target perdido', 'warning');
        onTargetLost?.();
        videoPlane.visible = false;
      };

      // Iniciar AR y video simultáneamente (requiere acción del usuario)
      window.logger?.addLog('Iniciando cámara y motor AR...', 'info');
      await Promise.all([
        mindarThree.start(),
        videoElement.play()
      ]);
      
      videoPlane.visible = false;
      setIsStarted(true);
      setIsLoading(false);
      window.logger?.addLog('AR iniciado exitosamente', 'success');

      // Loop de renderizado
      const animate = () => {
        if (mindarThreeRef.current) {
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }
      };
      animate();

    } catch (err) {
      console.error('Error inicializando AR:', err);
      const errorMessage = `Error AR: ${err.message}`;
      window.logger?.addLog(errorMessage, 'error');
      alert(errorMessage); // Alert con error técnico exacto
      setError(err.message);
      setIsLoading(false);
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
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="./bee.mp4"
        playsInline
        muted
        loop
        crossOrigin="anonymous"
      />
      
      {isLoading && isStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p>Iniciando cámara AR...</p>
          </div>
        </div>
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
