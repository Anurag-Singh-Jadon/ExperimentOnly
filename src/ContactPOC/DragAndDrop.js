import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DraxProvider, { DraxView } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const DragAndDrop = () => {
  return (
    
    <View style={{flex:1}}>
    <DraxProvider>
      <View style={styles.container}>
        <DraxView
          style={styles.draggable}
          onDragStart={() => console.log('Drag started')}
          onDragEnd={() => console.log('Drag ended')}
        >
          <Text style={styles.text}>Drag Me</Text>
        </DraxView>
        <View style={styles.dropTarget}>
          <DraxView
            style={styles.dropZone}
            receivingStyle={styles.receivingZone}
            onReceiveDrag={() => console.log('Item dropped')}
          >
            <Text style={styles.text}>Drop Here</Text>
          </DraxView>
        </View>
      </View>
    </DraxProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draggable: {
    width: 80,
    height: 80,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    color: 'white',
  },
  dropTarget: {
    width: 100,
    height: 100,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropZone: {
    width: 80,
    height: 80,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receivingZone: {
    backgroundColor: 'lightgreen',
  },
});

export default DragAndDrop;