import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { exercises } from '../../exerciseFunctions/exerciseFunctions';
import React from 'react';

export default function TabOneScreen() {
  
  return (
    <View style={styles.container}>
      {Object.keys(exercises).map( (exercise_name, index) => <Text style={styles.text} key={index}>{exercise_name}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    // justifyContent: 'center',
    aspectRatio: 3/4,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});