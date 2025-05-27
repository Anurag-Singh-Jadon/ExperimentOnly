import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {captureScreen,captureRef} from 'react-native-view-shot';
// import {captureRef} from 'react-native-view-shot-scrollview';

const App = () => {
  const [imageURI, setImageURI] = useState(
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/sample_img.png',
  );
  const [savedImagePath, setSavedImagePath] = useState('');
  const scrollViewRef = useRef();

  const takeScreenShot = () => {
    captureRef(scrollViewRef, {
      format: 'jpg',
      quality: 0.8,
    }).then(
      (uri) => {
        setSavedImagePath(uri);
        setImageURI(uri);
      },
      (error) => console.error('Oops, Something Went Wrong', error),
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          React Native Example to Take Scrollable Screenshot Programmatically
        </Text>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}>
          <Image
            source={{uri: imageURI}}
            style={{
              width: 200,
              height: 300,
              resizeMode: 'contain',
              marginTop: 5,
            }}
          />
           <TouchableOpacity style={styles.buttonStyle} onPress={takeScreenShot}>
          <Text style={styles.buttonTextStyle}>Take Screenshot</Text>
        </TouchableOpacity>
        <Text style={styles.textStyle}>
          {savedImagePath ? `Saved Image Path\n ${savedImagePath}` : ''}
        </Text>
           <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
          Anurag Singh Jadon
        </Text>
        <Text>
         Ravi
        </Text>
       
        </ScrollView>
      
       
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    textAlign: 'center',
    padding: 10,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
});
