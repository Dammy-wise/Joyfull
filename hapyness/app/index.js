import { View, Text, TouchableOpacity,ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const router = useRouter();
  
  return (

  <ImageBackground
      source={require('../assets/image/welcome.png')}
      style={styles.container}
      blurRadius={1}
    >



    
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to,</Text>
        <Text style={styles.subtitle}>Hapyness.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push('/auth/signin')}
        >
          <Text style={styles.primaryButtonText}>Login to Hapyness</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/auth/signup')}
        >
      
          <Text style={styles.secondaryButtonText}>Signup to Hapyness</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
    marginBottom: 7,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  buttonContainer: {
    gap: 14,
    paddingBottom: 65,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    height: 56,
    marginHorizontal: 8,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#EF4444',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})