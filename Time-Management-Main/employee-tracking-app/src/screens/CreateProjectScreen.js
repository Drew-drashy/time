import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axiosInstance from '../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreateProjectScreen = () => {
  const navigation = useNavigation();
  const [project, setProject] = useState({
    name: '',
    description: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/api/projects', project);
      alert('Project created successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Create Project Error:', error.response?.data || error.message);
      alert('Failed to create project');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold text-center text-blue-600 mb-8">Create Project</Text>

      <TextInput
        placeholder="Project Name"
        value={project.name}
        onChangeText={(text) => setProject({ ...project, name: text })}
        className="border border-gray-300 p-3 rounded mb-4"
      />

      <TextInput
        placeholder="Description"
        value={project.description}
        onChangeText={(text) => setProject({ ...project, description: text })}
        className="border border-gray-300 p-3 rounded mb-4"
      />

      <TextInput
        placeholder="Deadline (YYYY-MM-DD)"
        value={project.deadline}
        onChangeText={(text) => setProject({ ...project, deadline: text })}
        className="border border-gray-300 p-3 rounded mb-8"
      />

      <TouchableOpacity
        onPress={handleCreate}
        className="bg-blue-600 p-4 rounded"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-bold">Create Project</Text>
        )}
      </TouchableOpacity>

          {user.role === 'admin' && (
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateProject')}
        className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    )}

    </View>
  );
};

export default CreateProjectScreen;
