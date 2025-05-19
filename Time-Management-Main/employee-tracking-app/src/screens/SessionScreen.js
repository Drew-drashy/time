import React from 'react';
import { View, Text, Button } from 'react-native';
import useLocationTracker from '../hooks/useLocationTracker';
import { useSession } from '../context/SessionContext';
import { useAuth } from '../context/AuthContext'; // Assuming you have auth context
import { startSessionAPI, endSessionAPI } from '../api/time';

const SessionScreen = ({ projectId }) => {
  const { user } = useAuth();
  const { sessionId, setSessionId, isSessionActive, setIsSessionActive } = useSession();
  const { startTracking, stopTracking } = useLocationTracker(sessionId, projectId);

  const startSession = async () => {
    const session = await startSessionAPI(projectId);
    setSessionId(session._id);
    setIsSessionActive(true);
    startTracking(user._id);
  };

  const endSession = async () => {
    await endSessionAPI(sessionId);
    setIsSessionActive(false);
    setSessionId(null);
    stopTracking();
  };

  return (
    <View className="flex-1 justify-center items-center">
      {!isSessionActive ? (
        <Button title="Start Work" onPress={startSession} />
      ) : (
        <Button title="End Work" onPress={endSession} />
      )}
      {isSessionActive && <Text className="mt-4">Session Running...</Text>}
    </View>
  );
};

export default SessionScreen;
