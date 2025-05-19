
import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import axiosInstance from '../api/axiosInstance';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
const { width, height } = Dimensions.get('window');



const ProjectManagementScreen = () => {
  // Form state
  const [name, setName] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const appConfig = Constants.manifest ?? Constants.expoConfig;
  const API_KEY = appConfig?.extra?.GOOGLE_PLACES_API_KEY;
  const [description, setDescription] = useState('');
  const [radius, setRadius] = useState('100');
  const [workingHours, setWorkingHours] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [assignedEmails, setAssignedEmails] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Map/modal state
  const [mapVisible, setMapVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const mapRef = useRef();
  const placesRef = useRef();

  // Projects list
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      getCurrentLocation();
    }
  };
  useEffect(() => {
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };

  getLocation();
}, []);

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setRegion(region => ({
        ...region,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      }));
    } catch (e) {
      console.warn('Could not get location', e);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/projects');
      setProjects(data.projects || []);
    } catch (e) {
      Alert.alert('Error', 'Could not load projects');
    }
    setLoading(false);
  };

  const clearForm = () => {
    setName(''); setDescription(''); setRadius('100');
    setWorkingHours(''); setStatus('ongoing');
    setAssignedEmails(''); setEditingId(null);
    setMarkerCoordinate(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Name is required');
    if (!markerCoordinate) return Alert.alert('Validation', 'Pick a location');

    const emailList = (assignedEmails || '')
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    const payload = {
      name,
      description,
      center: {
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
      },
      radius: parseFloat(radius) || 0,
      workingHours,
      status,
      assignedEmails: emailList,
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/api/projects/${editingId}`, payload);
        Alert.alert('Success', 'Project updated');
      } else {
        await axiosInstance.post('/api/projects', payload);
        Alert.alert('Success', 'Project created');
      }
      clearForm();
      fetchProjects();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = project => {
    setEditingId(project._id);
    setName(project.name);
    setDescription(project.description || '');
    setRadius(String(project.radius || '100'));
    setWorkingHours(project.workingHours || '');
    setStatus(project.status || 'ongoing');
    setAssignedEmails(
      (project.assignedEmployees || []).map(emp => emp.email).join(', ')
    );
    if (project.center) {
      const { latitude, longitude } = project.center;
      setRegion({ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      setMarkerCoordinate({ latitude, longitude });
    }
    placesRef.current?.setAddressText(project.name);
  };

  const handleDelete = id => {
    Alert.alert('Confirm Delete', 'Delete this project?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosInstance.delete(`/api/projects/${id}`);
            fetchProjects();
          } catch {
            Alert.alert('Error', 'Delete failed');
          }
        },
      },
    ]);
  };

  const openMapModal = () => setMapVisible(true);
  const handleMapPress = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });
  };
  const confirmLocation = () => {
    if (!markerCoordinate) {
      return Alert.alert('Error', 'Tap on map to place marker');
    }
    setMapVisible(false);
  };

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{item.name}</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Ionicons name="create" size={20} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.projectText}>{item.description}</Text>
      <Text style={styles.projectText}>
        Location: {item.center?.latitude?.toFixed(4) ?? '–'},{' '}
        {item.center?.longitude?.toFixed(4) ?? '–'}
      </Text>
      <Text style={styles.projectText}>Radius: {item.radius} m</Text>
      <Text style={styles.projectText}>Hours: {item.workingHours}</Text>
      <Text style={styles.projectText}>Status: {item.status}</Text>
      <Text style={styles.projectText}>
        Assigned: {(item.assignedEmployees || []).map(e => e.email).join(', ')}
      </Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        {editingId ? 'Edit Project' : 'Create Project'}
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <View style={styles.locationRow}>
        <TouchableOpacity style={styles.mapButton} onPress={openMapModal}>
          <Ionicons name="map" size={20} color="#fff" />
          <Text style={styles.mapButtonText}>Pick Location</Text>
        </TouchableOpacity>
        <Text style={styles.locationText}>
          {markerCoordinate
            ? `${markerCoordinate.latitude.toFixed(4)}, ${markerCoordinate.longitude.toFixed(4)}`
            : 'None'}
        </Text>
      </View>

      <TextInput
        placeholder="Radius (m)"
        value={radius}
        onChangeText={setRadius}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Working Hours"
        value={workingHours}
        onChangeText={setWorkingHours}
        style={styles.input}
      />
      <TextInput
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
        style={styles.input}
      />
      <TextInput
        placeholder="Assign Emails (comma-separated)"
        value={assignedEmails}
        onChangeText={setAssignedEmails}
        style={styles.input}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          {editingId ? 'Update Project' : 'Create Project'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>All Projects</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && projects.length === 0 ? (
        <ActivityIndicator style={styles.loader} size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={item => item._id}
          renderItem={renderProject}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No projects found.</Text>}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Map Modal */}
      <Modal
        animationType="slide"
        visible={mapVisible}
        onRequestClose={() => setMapVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <GooglePlacesAutocomplete
            ref={c => (placesRef.current = c)}
            placeholder="Search location"
            predefinedPlaces={[]}
            fetchDetails
            onPress={(data, details = null) => {
              const { lat, lng } = details.geometry.location;
              const newRegion = { latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 };
              setRegion(newRegion);
              setMarkerCoordinate({ latitude: lat, longitude: lng });
              mapRef.current?.animateToRegion(newRegion);
            }}
            query={{
             key: API_KEY,
                language: 'en',
                types: 'geocode',
                // Add location bias when we have user's current location
                ...(currentLocation && {
                  location: `${currentLocation.latitude},${currentLocation.longitude}`,
                  radius: '50000', // Search within 50km
                  strictbounds: false // Allow results outside this radius too, but prioritize within
                })
            }}
            styles={{ container: { flex: 0, margin: 8 }, textInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 4 } }}
            textInputProps={{ onFocus: () => {}, onBlur: () => {} }}
          />

          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onPress={handleMapPress}
          >
            {markerCoordinate && <Marker coordinate={markerCoordinate} />}
            {markerCoordinate && radius && (
              <Circle
                center={markerCoordinate}
                radius={parseFloat(radius)}
                fillColor="rgba(0,128,255,0.2)"
                strokeColor="rgba(0,128,255,0.5)"
              />
            )}
          </MapView>

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={getCurrentLocation} style={styles.locateButton}>
              <Ionicons name="locate" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.confirmCancel}>
              <TouchableOpacity onPress={() => setMapVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmLocation} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProjectManagementScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 12,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  mapButton: {
    backgroundColor: '#2563EB', padding: 10, borderRadius: 6, flexDirection: 'row', alignItems: 'center',
  },
  mapButtonText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  locationText: { marginLeft: 12, flex: 1 },
  submitButton: {
    backgroundColor: '#2563EB', padding: 14, borderRadius: 6, alignItems: 'center', marginBottom: 24,
  },
  submitText: { color: '#fff', fontWeight: 'bold' },
  projectCard: {
    backgroundColor: '#f3f3f3', padding: 16, borderRadius: 6, marginHorizontal: 16, marginVertical: 8,
  },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectTitle: { fontSize: 18, fontWeight: 'bold' },
  iconRow: { flexDirection: 'row', width: 48, justifyContent: 'space-between' },
  projectText: { color: '#555', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#555' },

  modalContainer: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1, width, height: height * 0.6 },
  modalButtons: { position: 'absolute', bottom: 20, width, alignItems: 'center' },
  locateButton: {
    backgroundColor: '#2563EB', padding: 12, borderRadius: 24, position: 'absolute', right: 20, bottom: 100,
  },
  confirmCancel: {
    flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 16,
  },
  confirmButton: {
    backgroundColor: '#2563EB', padding: 12, borderRadius: 6, flex: 1, marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#6B7280', padding: 12, borderRadius: 6, flex: 1, marginRight: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
