import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import axiosInstance from '../api/axiosInstance';

const screenWidth = Dimensions.get('window').width;

const AnalyticsDashboardScreen = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await axiosInstance.get('/api/time/logs');
        setLogs(data);
      } catch (error) {
        console.log('Fetch Logs Error:', error.response?.data || error.message);
      }
    })();
  }, []);

  const getBarChartData = () => {
    const projects = {};
    logs.forEach(log => {
      const name = log.project?.name || 'Unknown';
      projects[name] = (projects[name] || 0) + (log.totalHours || 0);
    });

    return {
      labels: Object.keys(projects),
      datasets: [{ data: Object.values(projects) }],
    };
  };

  const getPieChartData = () => {
    const projects = {};
    logs.forEach(log => {
      const name = log.project?.name || 'Unknown';
      projects[name] = (projects[name] || 0) + (log.totalHours || 0);
    });

    return Object.keys(projects).map(name => ({
      name,
      hours: projects[name],
      color: '#' + Math.floor(Math.random() * 16777215).toString(16), // random colors
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-6 text-blue-600">Analytics</Text>

      <Text className="text-lg font-bold mb-2">Hours Worked Per Project:</Text>

      <BarChart
        data={getBarChartData()}
        width={screenWidth - 20}
        height={220}
        yAxisSuffix="h"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      <Text className="text-lg font-bold mt-8 mb-2">Work Time Distribution:</Text>

      <PieChart
        data={getPieChartData()}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="hours"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
};

export default AnalyticsDashboardScreen;
