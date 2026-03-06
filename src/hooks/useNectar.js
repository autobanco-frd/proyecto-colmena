import { useState, useEffect } from 'react';

const NECTAR_KEY = 'colmena_nectar';
const POLLINATED_KEY = 'colmena_pollinated';

export const useNectar = () => {
  const [nectar, setNectar] = useState(0);
  const [pollinated, setPollinated] = useState(new Set());

  useEffect(() => {
    const savedNectar = localStorage.getItem(NECTAR_KEY);
    const savedPollinated = localStorage.getItem(POLLINATED_KEY);
    
    if (savedNectar) {
      setNectar(parseInt(savedNectar, 10));
    }
    
    if (savedPollinated) {
      try {
        setPollinated(new Set(JSON.parse(savedPollinated)));
      } catch (e) {
        console.error('Error parsing pollinated data:', e);
      }
    }
  }, []);

  const addNectar = (targetId) => {
    if (!pollinated.has(targetId)) {
      const newNectar = nectar + 1;
      const newPollinated = new Set([...pollinated, targetId]);
      
      setNectar(newNectar);
      setPollinated(newPollinated);
      
      localStorage.setItem(NECTAR_KEY, newNectar.toString());
      localStorage.setItem(POLLINATED_KEY, JSON.stringify([...newPollinated]));
      
      return true; // Successfully added nectar
    }
    return false; // Already pollinated
  };

  const resetSession = () => {
    setPollinated(new Set());
    localStorage.removeItem(POLLINATED_KEY);
  };

  return {
    nectar,
    pollinated: Array.from(pollinated),
    addNectar,
    resetSession
  };
};
