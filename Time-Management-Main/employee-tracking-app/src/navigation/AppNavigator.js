import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { SessionProvider } from '../context/SessionContext';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SessionScreen from '../screens/SessionScreen';
import UploadPhotoScreen from '../screens/UploadPhotoScreen';
import EditProjectScreen from '../screens/EditProjectScreen';
import TabNavigator from './TabNavigator';
import CreateProjectScreen from '../screens/CreateProjectScreen'
import ProjectsScreen from '../screens/ProfileScreen'
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';
import EmployeeDetailsScreen from '../screens/EmployeeDetailsScreen'
import ProjectManagementScreen from '../screens/ProjectManagementScreen';
// import EmployeeDetailsScreen from '../screens/EmployeeDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <SessionProvider>
      <NavigationContainer>
        
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            {!user ? (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="HomeTabs" component={TabNavigator} />
                {/* <Stack.Screen name="Session" component={SessionScreen} />
                <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} />
                <Stack.Screen name="EditProject" component={EditProjectScreen} /> */}
                <Stack.Screen name="CreateProject" component={CreateProjectScreen} />

                <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen}/>
                <Stack.Screen name="EmployeeDetails" component={EmployeeDetailsScreen} />
                {/* <Stack.Screen name="ProjectManagement" component={ProjectManagementScreen}/> */}
                {user.role==='admin' &&
                  (<Stack.Screen name="ProjectManagement" component={ProjectManagementScreen}/>)
                }
                
              </>
            )}
          </Stack.Navigator>

       
      </NavigationContainer>
    </SessionProvider>
  );
};

export default AppNavigator;
