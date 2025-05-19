import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAdminNotifications from '../hooks/useAdminNotifications';

const AdminDashboardScreen = () => {
    useAdminNotifications(); 
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold text-center text-blue-600 mb-8">Admin Dashboard</Text>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('CreateProject')}
        className="bg-blue-600 p-4 rounded mb-4"
      >
        <Text className="text-white font-bold text-center">Create New Project</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('ViewProjects')}
        className="bg-green-600 p-4 rounded mb-4"
      >
        <Text className="text-white font-bold text-center">Manage Existing Projects</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('ViewEmployees')}
        className="bg-yellow-600 p-4 rounded mb-4"
      >
        <Text className="text-white font-bold text-center">View All Employees</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('LiveTracking')}
        className="bg-red-600 p-4 rounded mb-4"
      >
        <Text className="text-white font-bold text-center">Live Location Tracking</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('WorkLogs')}
        className="bg-purple-600 p-4 rounded mb-4"
      >
        <Text className="text-white font-bold text-center">View Work Logs / Reports</Text>
      </TouchableOpacity>

       */}
       <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        className="bg-purple-600 p-4 rounded mb-4"
      >
        <Text className="text-white font-bold text-center">Profile</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default AdminDashboardScreen;
