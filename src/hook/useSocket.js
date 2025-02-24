import { startTransition, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Inicjalizacja socketa
    if (!socketInstance) {
      socketInstance = io('https://kickzone-api.onrender.com', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });
    }

    // Natychmiast przypisujemy instancję do referencji
    socketRef.current = socketInstance;

    const onConnect = () => {
      console.log('Connected to server');
      startTransition(() => {
        setIsConnected(true);
      });
    };

    const onDisconnect = () => {
      console.log('Disconnected from server');
      startTransition(() => {
        setIsConnected(false);
      });
    };

    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);

    // Sprawdzamy początkowy stan połączenia
    if (socketRef.current.connected) {
      setIsConnected(true);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('disconnect', onDisconnect);

        if (document.hidden) {
          socketRef.current.disconnect();
          socketInstance = null;
          socketRef.current = null;
        }
      }
    };
  }, []); // Usunąłem socketRef z zależności

  const emit = (eventName, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(eventName, data);
    } else {
      console.warn('Socket is not connected, cannot emit:', eventName);
    }
  };

  const subscribe = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
      return () => {
        socketRef.current?.off(eventName, callback);
      };
    }
  };

  const unsubscribe = (eventName, callback) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(eventName, callback);
      } else {
        socketRef.current.off(eventName);
      }
    }
  };

  return {
    socket: socketRef.current,
    emit,
    subscribe,
    unsubscribe,
    isConnected,
  };
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
