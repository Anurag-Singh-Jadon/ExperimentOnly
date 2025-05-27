// import React, { Component } from 'react';
// import { Alert } from 'react-native';
// import { IdleTimerManager } from 'react-native-idle-timer';

// class IdleTimerTwo extends Component {
//   idleTimer = null;

//   componentDidMount() {
//     IdleTimerManager.setIdleTimeout(5000); // 5 seconds
//     IdleTimerManager.addListener('onIdleTimerExpired', this.handleUserInactivity);
//     IdleTimerManager.addListener('onAppStateChange', this.handleAppStateChange);
//     this.idleTimer = setTimeout(() => {
//       IdleTimerManager.pauseTracking();
//     }, 5000); // initial 5 seconds of inactivity
//   }

//   componentWillUnmount() {
//     IdleTimerManager.removeListener('onIdleTimerExpired', this.handleUserInactivity);
//     IdleTimerManager.removeListener('onAppStateChange', this.handleAppStateChange);
//     clearTimeout(this.idleTimer);
//     IdleTimerManager.resetIdleTimer();
//   }

//   handleUserInactivity = () => {
//     Alert.alert(
//       'Idle Time Exceeded',
//       'Do you want to extend your session or log out?',
//       [
//         {
//           text: 'Extend',
//           onPress: () => {
//             IdleTimerManager.resetIdleTimer();
//             this.idleTimer = setTimeout(() => {
//               IdleTimerManager.pauseTracking();
//             }, 5000); // 5 seconds
//           },
//         },
//         {
//           text: 'Log Out',
//           onPress: () => {
//             // perform logout action here
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: false },
//     );
//   };

//   handleAppStateChange = (newAppState) => {
//     if (newAppState === 'active') {
//       clearTimeout(this.idleTimer);
//       IdleTimerManager.resetIdleTimer();
//     }
//   };

//   render() {
//     // render your app here
//   }
// }

// export default IdleTimerTwo;
