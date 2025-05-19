import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import socket from '../socket/socket';

export default function useAdminNotifications() {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    socket.connect();
    socket.on('geofenceViolation', async (data) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Geofence Violation',
          body: `Employee ${data.userId} exited assigned area!`,
          sound: true,
        },
        trigger: null,
      });
    });

    return () => {
      subscription.remove();
      socket.disconnect();
    };
  }, []);
}
