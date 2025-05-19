import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';
import { Calendar } from 'react-native-calendars';
import * as Location from 'expo-location';

const ProjectDetailsScreen = () => {
  const { projectId } = useRoute().params;

  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setCurrentDate(today);
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await axiosInstance.get(`/api/time/logs?projectId=${projectId}&groupByDate=true`);
    setLogs(res.data);
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to start session.');
      return null;
    }
    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const handleStartSession = async () => {
    const coords = await getLocation();
    if (!coords) return;

    try {
      const res = await axiosInstance.post('/api/time/start', {
        projectId,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setSessionId(res.data._id);
      Alert.alert('Session Started');
      fetchLogs();
    } catch (err) {
      console.log('Start session error:', err.response?.data || err.message);
      Alert.alert('Could not start session');
    }
  };

  const handleEndSession = async () => {
    const coords = await getLocation();
    if (!coords) return;

    if (!sessionId) {
      Alert.alert('Session ID not found', 'You need to start a session first.');
      return;
    }

    try {
      await axiosInstance.post('/api/time/end', {
        sessionId,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      Alert.alert('Session Ended');
      setSessionId(null);
      fetchLogs();
    } catch (err) {
      console.log('End session error:', err.response?.data || err.message);
      Alert.alert('Could not end session');
    }
  };

  const getMarkedDates = () => {
    const dates = {};
    logs.forEach(log => {
      dates[log.date] = {
        marked: true,
        dotColor: 'blue',
        selected: log.date === selectedDate,
        selectedColor: 'blue',
      };
    });
    return dates;
  };

  const selectedLog = logs.find(log => log.date === selectedDate);

  return (
    <View className="flex-1 p-4 bg-white">
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
      />

      {selectedLog ? (
        <>
          <Text className="text-lg font-bold mt-4">Hours Worked: {selectedLog.totalHours.toFixed(2)} hrs</Text>
          <Text className="text-base mt-2 mb-1">Uploaded Images:</Text>
          <FlatList
            data={selectedLog.images}
            keyExtractor={(uri, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} className="w-full h-48 mb-4 rounded" resizeMode="cover" />
            )}
          />
        </>
      ) : (
        <Text className="mt-4 text-gray-500">Select a date to see logs</Text>
      )}

      {selectedDate === currentDate && (
        <View className="mt-6 flex-row justify-around">
          <TouchableOpacity onPress={handleStartSession} className="bg-blue-600 p-3 rounded">
            <Text className="text-white font-bold">Start Session</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleEndSession} className="bg-red-500 p-3 rounded">
            <Text className="text-white font-bold">End Session</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProjectDetailsScreen;
