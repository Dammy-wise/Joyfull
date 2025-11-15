import { Animated, View, Image, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

export default function Splashscreen({ onFinish }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1200,
      delay: 800,
      useNativeDriver: true,
    }).start(onFinish);
  }, []);

  return (
    <View style={[styles.container, ]}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  }
});
