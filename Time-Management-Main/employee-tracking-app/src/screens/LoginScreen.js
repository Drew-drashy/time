import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleLogin = async () => {
    setLocalLoading(true);
    try {
      await login(email, password);
      // console.log('hiii')
      // navigation.replace('HomeTabs');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
    setLocalLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-8 text-blue-600">Employee Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="border border-gray-300 p-3 rounded mb-4"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 p-3 rounded mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 p-3 rounded"
        disabled={localLoading}
      >
        {localLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-bold">Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text className="text-center text-gray-600 mt-4">Don't have an account? Signup</Text>
    </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;
