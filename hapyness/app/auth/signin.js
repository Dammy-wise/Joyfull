import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveLogin, setSaveLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      
      // Save login credentials if checkbox is checked
      if (saveLogin) {
        await AsyncStorage.setItem('savedLogin', JSON.stringify({ email, password }));
      } else {
        await AsyncStorage.removeItem('savedLogin');
      }
      
      if (user.onboardingCompleted) {
        router.replace('/tabs/home');
      } else {
        router.replace('/auth/step1');
      }
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.prompt('Gmail Sign In', 'Enter your Gmail address:', async (googleEmail) => {
      if (!googleEmail) return;
      
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const user = users.find(u => u.email === googleEmail);

      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        if (user.onboardingCompleted) {
          router.replace('/home');
        } else { 
          router.replace('/auth/step1');
        }
      } else {
        Alert.alert('Error', 'Gmail not linked');
      }
    });
  };

  const handleFacebookSignIn = async () => {
    Alert.prompt('Facebook Sign In', 'Enter your Facebook email:', async (fbEmail) => {
      if (!fbEmail) return;
      
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const user = users.find(u => u.email === fbEmail);

      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        if (user.onboardingCompleted) {
          router.replace('/home');
        } else {
          router.replace('/auth/step1');
        }
      } else {
        Alert.alert('Error', 'Facebook not linked');
      }
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
        <Text style={styles.title}>Welcome to,</Text>
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

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Input your password here"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={
                  showPassword
                    ? require('../../assets/image/eye_open.png')
                    : require('../../assets/image/eye_closed.png')
                }
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setSaveLogin(!saveLogin)}
            >
              <Ionicons
                name={saveLogin ? "checkmark-sharp" : "square-outline"}
                size={20}
                color={saveLogin ? "#10B981" : "#666"}
              />
              <Text style={styles.checkboxText}>Save Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
            <Text style={styles.loginButtonText}>Login Hapnezz</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.gmailButton} onPress={handleGoogleSignIn}>
              <Text style={styles.socialButtonText}>Gmail</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookSignIn}>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: '#fff',
    fontSize: 14,
  },
  eyeButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxText: {
    color: '#fff',
    fontSize: 14,
  },
  forgotText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#10B981',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
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