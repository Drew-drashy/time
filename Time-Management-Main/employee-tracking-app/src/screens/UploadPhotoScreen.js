import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const UploadPhotoScreen = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { projectId } = route.params;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadPhoto = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please pick or take a photo first');
      return;
    }

    // Upload logic here...
    console.log('Uploading photo for project:', projectId);
    console.log('Image URI:', image);

    Alert.alert('Success', 'Photo uploaded successfully');
    navigation.goBack();
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6 text-blue-600">Upload Project Photo</Text>

      {image && (
        <Image source={{ uri: image }} className="w-64 h-64 rounded mb-4" />
      )}

      <View className="flex-row justify-between w-full mb-4">
        <Button title="Pick from Gallery" onPress={pickImage} />
        <Button title="Take a Photo" onPress={takePhoto} />
      </View>

      <Button title="Upload Photo" onPress={uploadPhoto} color="#16A34A" />
    </View>
  );
};

export default UploadPhotoScreen;
