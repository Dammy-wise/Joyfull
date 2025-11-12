import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    if (users.find(u => u.email === email)) {
      Alert.alert('Error', 'Email already registered');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    
    Alert.alert('Success', 'Account created successfully!', [
      { text: 'OK', onPress: () => router.replace('/auth/signin') }
    ]);
  };

  const handleGoogleSignUp = async () => {
    Alert.prompt('Gmail Sign Up', 'Enter your Gmail address:', async (googleEmail) => {
      if (!googleEmail) return;
      
      if (!validateEmail(googleEmail)) {
        Alert.alert('Error', 'Invalid Gmail address');
        return;
      }

      setEmail(googleEmail);
      Alert.alert('Success', 'Gmail linked successfully!');
    });
  };

  const handleFacebookSignUp = async () => {
    Alert.prompt('Facebook Sign Up', 'Enter your Facebook email:', async (fbEmail) => {
      if (!fbEmail) return;
      
      if (!validateEmail(fbEmail)) {
        Alert.alert('Error', 'Invalid Facebook email');
        return;
      }

      setEmail(fbEmail);
      Alert.alert('Success', 'Facebook linked successfully!');
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Sing up to,</Text>
        <Text style={styles.title}>Hapnezz</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email@Hapnezz.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Input your password here"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Re-type your password"
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.createButton} onPress={handleSignUp}>
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.gmailButton} onPress={handleGoogleSignUp}>
              <Text style={styles.socialButtonText}>Gmail</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookSignUp}>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By continuing you agree Hapnezz{' '}
            <Text style={styles.linkText}>Term Of Use</Text> and confirm that you have read
            Hapnezz <Text style={styles.linkText}>Privacy Police</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    marginTop: 40,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#10B981',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  gmailButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
  },
  facebookButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#3B82F6',
  },
}); 
                                                           