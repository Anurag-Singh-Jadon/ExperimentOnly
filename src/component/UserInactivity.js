// import React, {useState} from 'react';
// import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
// import UserInactiveCheck from 'react-native-user-inactivity-check';

// const App = () => {
//   const [showContent, setShowContent] = useState(false);
//   const action = () => {
//     setShowContent(true);
//     Alert.alert('User is not active');
//   };
//   let userInactiveCheckRef = React.createRef();
//   const onButtonPress = () => {
//     setShowContent(false);
//     userInactiveCheckRef && userInactiveCheckRef.resetTimer();
//   };
//   return (
//     <UserInactiveCheck
//       timeToInactivity={5}
//       interval={10}
//       onAction={action}
//       ref={ref => {userInactiveCheckRef = ref;}}
//       handleAppState={true}>
//       <View style={styles.container}>
//         <View style={styles.headView}>
//           <Text style={styles.heading}>User Inactivity Demo</Text>
//         </View>
//         <View style={styles.buttonView}>
//           {showContent ? (
//             <TouchableOpacity
//               style={{backgroundColor: '#DDDDDD', padding: 10}}
//               onPress={onButtonPress}>
//               <Text style={styles.buttonText}>Reset Timer</Text>
//             </TouchableOpacity>
//           ) : null}
//         </View>
//       </View>
//     </UserInactiveCheck>
//   );
// };

// const styles = StyleSheet.create({
//   heading: {
//     fontSize: 40,
//     marginBottom: 30,
//     alignSelf: 'center',
//   },
//   container: {
//     flex: 1,
//     padding: 15,
//     justifyContent: 'center',
//     backgroundColor: '#9d9d9d',
//   },
//   headView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   buttonView: {flex: 4, alignItems: 'center', justifyContent: 'center'},
//   buttonText: {fontSize: 30},
// });

// export default App;