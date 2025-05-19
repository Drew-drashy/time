import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        avatar: user.avatar || '',
      });
      setLoading(false);
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfile({ ...profile, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('phone', profile.phone);
      formData.append('position', profile.position);

      if (profile.avatar && !profile.avatar.startsWith('http')) {
        const uri = profile.avatar;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('avatar', {
          uri,
          name: filename,
          type,
        });
      }

      await axiosInstance.put('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile updated successfully');
    } catch (error) {
      console.log('Profile Update Error:', error.response?.data || error.message);
      alert('Failed to update profile');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
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
      <Text className="text-2xl font-bold text-center text-blue-600 mb-6 mt-8">My Profile</Text>

      {/* <TouchableOpacity onPress={pickImage} className="self-center mb-6">
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} className="w-24 h-24 rounded-full" />
        ) : (
          <View className="w-24 h-24 bg-gray-300 rounded-full justify-center items-center">
            <Text className="text-gray-700">Pick Image</Text>
          </View>
        )}
      </TouchableOpacity> */}
      {/* soon change it into the media uploader */}
      <TextInput
        placeholder="Name"
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        className="border border-gray-300 p-3 rounded mb-4"
      />

      <TextInput
        placeholder="Email"
        value={profile.email}
        editable={false}
        className="border border-gray-300 p-3 rounded mb-4 bg-gray-100"
      />

      <TextInput
        placeholder="Phone"
        value={profile.phone}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        keyboardType="phone-pad"
        className="border border-gray-300 p-3 rounded mb-4"
      />

      <TextInput
        placeholder="Position"
        value={profile.position}
        onChangeText={(text) => setProfile({ ...profile, position: text })}
        className="border border-gray-300 p-3 rounded mb-8"
      />

      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-600 p-3 rounded mb-6"
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-bold">Save Changes</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 p-3 rounded"
      >
        <Text className="text-center text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
