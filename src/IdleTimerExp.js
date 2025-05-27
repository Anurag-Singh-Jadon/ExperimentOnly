import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const IdleTimerExp = ({ timeoutInMs, onTimeout }) => {
  const appState = useRef(AppState.currentState);
  const timeoutId = useRef(null);

  const resetTimer = () => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      onTimeout && onTimeout();
    }, timeoutInMs);
  };

  const handleAppStateChange = (nextAppState) => {
    if (appState.current === 'active' && nextAppState !== 'active') {
      // App is going to background, reset the timer
      resetTimer();
    } else if (appState.current !== 'active' && nextAppState === 'active') {
      // App is coming back from background, reset the timer
      resetTimer();
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    resetTimer();

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      clearTimeout(timeoutId.current);
    };
  }, []);

  return null; // Render nothing, this is just a utility component
};

export default IdleTimerExp;