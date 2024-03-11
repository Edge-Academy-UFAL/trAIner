import { Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Text, View } from '@/components/Themed';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
// import Canvas from 'expo';

export default function TabTwoScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const [ratio, setRatio] = useState('16:9');

  useEffect(() => {
    if (cameraRef.current && Platform.OS === 'android') {
      cameraRef.current.getSupportedRatiosAsync().then(ratios => {
        if (ratios.includes('16:9')) {
          setRatio('16:9');
        }
      });
    }
  }, [cameraRef]);

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  
  if (!permission || !isFocused) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const cameraStyleWithRatio = StyleSheet.compose(styles.camera, { aspectRatio: ratio === '16:9' ? 9/16 : 3/4 }); 
  return (
    <View style={styles.container}>
      <Camera style={cameraStyleWithRatio} ref={cameraRef} type={type} ratio={ratio}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
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
    aspectRatio: 3/4,
    width: '100%'
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