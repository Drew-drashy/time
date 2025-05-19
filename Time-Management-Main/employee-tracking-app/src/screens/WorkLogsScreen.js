import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getTimeLogs } from '../api/time';
import { useNavigation } from '@react-navigation/native';

const WorkLogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const data = await getTimeLogs();
        setLogs(data);
      } catch (error) {
        alert('Failed to load logs');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4 text-blue-600 text-center mt-8">Work Logs</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-3 rounded mb-3">
            <Text className="font-bold">{item.project?.name || 'Unknown Project'}</Text>
            <Text>Start: {new Date(item.startTime).toLocaleString()}</Text>
            <Text>End: {new Date(item.endTime).toLocaleString()}</Text>
            <Text>Total Hours: {item.totalHours?.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default WorkLogsScreen;
