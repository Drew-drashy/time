// Update this URL to your real backend server URL
export const SERVER_URL = "http://192.168.1.14:5000"; 

// Socket.io event names
export const SOCKET_EVENTS = {
  SEND_LOCATION: 'sendLocation',
  LOCATION_UPDATE: 'locationUpdate',
  GEOFENCE_VIOLATION: 'geofenceViolation',
};

// Colors and other UI constants (optional)
export const COLORS = {
  primary: '#2563EB', // Tailwind blue-600
  danger: '#DC2626',  // Tailwind red-600
  success: '#16A34A', // Tailwind green-600
};

// Default map settings (optional if you use MapView later)
export const MAP_DEFAULT = {
  latitude: 34.0522,   // Example: Los Angeles
  longitude: -118.2437,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
