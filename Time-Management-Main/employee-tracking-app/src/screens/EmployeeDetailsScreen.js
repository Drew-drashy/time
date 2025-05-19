import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  Image, 
  Platform 
} from 'react-native';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Calendar } from 'react-native-calendars';
import io from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';

const SOCKET_URL = "http://192.168.1.14:5000"
// Platform.OS === 'android'
  // ? 'http://10.0.2.2:5000'
  //  'http://192.168.1.14:5000';

export default function EmployeeDetailsScreen() {
  const { employeeId, projectId } = useRoute().params;
  const navigation = useNavigation();
  const socketRef = useRef(null);

  const [employee, setEmployee] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        setSelectedDate(today);

        const [empRes, logRes] = await Promise.all([
          axiosInstance.get(`/api/employees/${employeeId}`),
          axiosInstance.get(`/api/time/logs/admin/${employeeId}?groupByDate=true`)
        ]);
        setEmployee(empRes.data.employee);
        setLogs(logRes.data);
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [employeeId]);

useEffect(() => {
  let locationSubscription;
  // 1) connect socket
  socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
  socketRef.current.on('connect', () =>
    console.log('🔥 Socket connected:', socketRef.current.id)
  );
  socketRef.current.on('connect_error', err =>
    console.log('❌ Socket connect_error:', err.message)
  );

  // 2) request permissions & start GPS
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission needed', 'Location permission is required.');
    }
    locationSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Highest, timeInterval: 5000, distanceInterval: 5 },
      ({ coords }) => {
        console.log('📍 Got coords:', coords);
        setLiveLocation(coords);
        socketRef.current.emit('sendLocation', {
          userId: employeeId,
          projectId,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
    );
  })();

  return () => {
    if (locationSubscription) locationSubscription.remove();
    socketRef.current.disconnect();
  };
}, [employeeId, projectId]);

// useEffect(()=>{
//   console.log('hiiii');
// })

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const markedDates = logs.reduce((acc, log) => {
    acc[log.date] = {
      marked: true,
      dotColor: 'blue',
      selected: log.date === selectedDate,
      selectedColor: 'blue'
    };
    return acc;
  }, {});

  const selectedLog = logs.find(l => l.date === selectedDate);
  const totalHours = logs.reduce((sum, l) => sum + (l.totalHours || 0), 0);

  const removeFromProject = async () => {
    try {
      await axiosInstance.post('/api/employees/remove-from-project', {
        employeeId,
        projectId
      });
      Alert.alert('Removed', 'Employee removed from project');
      navigation.goBack();
    } catch (err) {
      console.error('Remove error:', err);
      Alert.alert('Failed to remove');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-blue-600 text-center mb-4 mt-8">
        {employee?.name || 'Employee'} Details
      </Text>

      <Text className="font-semibold">Email:</Text>
      <Text className="mb-4">{employee?.email || 'N/A'}</Text>

      <Text className="font-semibold">Total Hours:</Text>
      <Text className="mb-4">{totalHours.toFixed(2)} hrs</Text>

      {liveLocation ? (
        <View className="h-64 rounded overflow-hidden mb-6">
          <Text className="font-semibold mb-2">Live Location:</Text>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: liveLocation.latitude,
              longitude: liveLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
          >
            <Marker
              coordinate={liveLocation}
              title={employee.name}
              description="Real-time position"
            />
          </MapView>
        </View>
      ) : (
        <Text className="text-gray-500 mb-6">Waiting for live location…</Text>
      )}

      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates}
      />

      <Text className="mt-4 mb-2 font-bold">Logs for {selectedDate}:</Text>
      {selectedLog ? (
        <>
          <Text>Total: {selectedLog.totalHours?.toFixed(2)} hrs</Text>
          <Text className="mt-2 mb-1">Images:</Text>
          {selectedLog.images?.length > 0 ? (
            selectedLog.images.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 8 }}
                resizeMode="cover"
              />
            ))
          ) : (
            <Text className="text-gray-500">No images</Text>
          )}
        </>
      ) : (
        <Text className="text-gray-500">No logs this day</Text>
      )}

      <TouchableOpacity
        onPress={removeFromProject}
        className="mt-6 bg-red-600 p-3 rounded mb-8"
      >
        <Text className="text-white text-center font-bold">
          Remove from Project
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
