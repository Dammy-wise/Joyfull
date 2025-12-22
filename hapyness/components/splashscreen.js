import { Animated, View, Image, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

export default function Splashscreen({ onFinish }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        }
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
    </Animated.View>
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