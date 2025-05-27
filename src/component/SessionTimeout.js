import React, { useState, useEffect } from 'react';
import { Alert, InteractionManager,View,Text } from 'react-native';

const TIMEOUT_DURATION = 60000; // 10 minutes in milliseconds

const App = () => {
  const [sessionTimer, setSessionTimer] = useState(null);

  useEffect(() => {
    const resetTimer = () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      const newSessionTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          Alert.alert('Session Timeout', 'Your session has timed out due to inactivity.', [{ text: 'OK' }]);
          // Perform logout or other desired action here
        });
      }, TIMEOUT_DURATION);
      setSessionTimer(newSessionTimer);
    };
    const clearTimer = () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
        setSessionTimer(null);
      }
    };
    // Set up InteractionManager events for user activity
    InteractionManager.addEventListener('interactionStart', resetTimer);
    InteractionManager.addEventListener('interactionEnd', clearTimer);
    // Clean up InteractionManager events on unmount
    return () => {
      InteractionManager.removeEventListener('interactionStart', resetTimer);
      InteractionManager.removeEventListener('interactionEnd', clearTimer);
      clearTimer();
    };
  }, [sessionTimer]);

  // Render your app as usual
  return (
    <View>
    <Text> Anurag Singh</Text>
    </View>
  );
};

export default App;
