import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import socket from '../socket/socket';

export default function useLocationTracker(sessionId, projectId) {
  const watchId = useRef(null);

  const startTracking = async (userId) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission denied');
      return;
    }

    socket.connect();

    watchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        socket.emit('sendLocation', {
          latitude,
          longitude,
          userId,
          projectId,
          sessionId,
          timestamp: new Date().toISOString(),
        });
      }
    );
  };

  const stopTracking = async () => {
    if (watchId.current) {
      watchId.current.remove();
      watchId.current = null;
    }
    socket.disconnect();
  };

  return { startTracking, stopTracking };
}
