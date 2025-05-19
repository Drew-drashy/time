import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { registerUser } from '../api/auth';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const navigation = useNavigation();

  const handleSignup = async () => {
    setLocalLoading(true);
    try {
      await registerUser({ name, email, password });
      alert('Registration successful! Please login.');
      navigation.navigate('Login');
    } catch (error) {
      alert('Signup failed. Please try again.');
    }
    setLocalLoading(false);
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-8 text-blue-600">Employee Signup</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 p-3 rounded mb-4"
      />

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
        onPress={handleSignup}
        className="bg-blue-600 p-3 rounded mb-4"
        disabled={localLoading}
      >
        {localLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-bold">Signup</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text className="text-center text-gray-600">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
