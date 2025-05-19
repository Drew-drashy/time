import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import ProjectsScreen from '../screens/ProjectsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WorkLogsScreen from '../screens/WorkLogsScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import ProjectManagementScreen from '../screens/ProjectManagementScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useAuth();

  // useEffect(() => {
  //   console.log('✅ TabNavigator mounted');
  // }, []);

  return (
    <Tab.Navigator
      initialRouteName="Projects"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
         let iconName;
          
          if (route.name === 'Projects') {
            iconName = 'folder-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'WorkLogs') {
            iconName = 'calendar-outline';
          } else if (route.name === 'ProjectManagement') {
            iconName = 'briefcase-outline';
          }
          // return <Ionicons name={icons[route.name]} size={size} color={color} />;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Projects" component={ProjectsScreen} />
     {user.role==='admin' && ( <Tab.Screen name="ProjectManagement" component={ProjectManagementScreen} />)}
      <Tab.Screen name="WorkLogs" component={WorkLogsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
