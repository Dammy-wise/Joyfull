import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/background-welcome.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to,</Text>
        <Text style={styles.title}>Hapnezz.</Text>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'green' }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login Hapnezz</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.buttonText}>Login Hapnezz</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)', // dark overlay for readability
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    marginTop: 20,
    padding: 15,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
