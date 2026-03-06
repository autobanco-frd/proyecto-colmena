import React, { useState, useEffect, useRef } from 'react';

const Logger = () => {
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Exponer función global para logs desde otros componentes
  useEffect(() => {
    window.logger = { addLog, clearLogs };
    return () => {
      delete window.logger;
    };
  }, []);

  // Auto-scroll al último log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-cyan-300';
    }
  };

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-cyan-500/30 z-50">
      <div className="flex items-center justify-between p-2 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-mono text-xs">SYSTEM LOGS</span>
        </div>
        <button
          onClick={clearLogs}
          className="text-red-400 hover:text-red-300 font-mono text-xs px-2 py-1 border border-red-500/30 rounded"
        >
          CLEAR
        </button>
      </div>
      
      <div 
        ref={logContainerRef}
        className="max-h-32 overflow-y-auto p-2 space-y-1"
        style={{ maxHeight: '128px' }}
      >
        {logs.map((log, index) => (
          <div key={index} className="flex items-start space-x-2 text-xs font-mono">
            <span className="text-gray-500 flex-shrink-0">{log.timestamp}</span>
            <span className={`flex-1 ${getLogColor(log.type)}`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logger;
