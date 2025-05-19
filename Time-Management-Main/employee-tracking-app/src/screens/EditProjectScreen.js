import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axiosInstance from '../api/axiosInstance';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditProjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projectId } = route.params;

  const [project, setProject] = useState({
    name: '',
    description: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(`/api/projects/${projectId}`);
        const p = response.data;
        setProject({
          name: p.name,
          description: p.description,
          deadline: p.deadline,
        });
      } catch (error) {
        console.log('Load Project Error:', error.response?.data || error.message);
        alert('Failed to load project details');
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/api/projects/${projectId}`, project);
      alert('Project updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Update Project Error:', error.response?.data || error.message);
      alert('Failed to update project');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold text-center text-blue-600 mb-8">Edit Project</Text>

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
        onPress={handleSave}
        className="bg-blue-600 p-4 rounded"
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-bold">Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditProjectScreen;
