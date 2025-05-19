import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import socket from '../socket/socket';

const LiveTrackingScreen = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.on('locationUpdate', (data) => {
      setLocations((prev) => {
        const filtered = prev.filter(loc => loc.userId !== data.userId);
        return [...filtered, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!locations.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-500 mt-4">Waiting for location updates...</Text>
      </View>
    );
  }

  return (
    <MapView
      className="flex-1"
      initialRegion={{
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {locations.map((loc, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
          title={`User ID: ${loc.userId}`}
          description={`Updated: ${new Date(loc.timestamp).toLocaleTimeString()}`}
        />
      ))}
    </MapView>
  );
};

export default LiveTrackingScreen;
