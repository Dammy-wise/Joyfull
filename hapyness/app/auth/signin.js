import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_CONFIG, FACEBOOK_CONFIG } from '../config/auth';


// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveLogin, setSaveLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google OAuth Configuration
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    GOOGLE_CONFIG
  });

  // Facebook OAuth Configuration
  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    FACEBOOK_CONFIG
  });

  // Load saved login credentials on mount
  useEffect(() => {
    loadSavedLogin();
  }, []);

  // Handle Google Sign In Response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      handleGoogleSignIn(authentication.accessToken);
    }
  }, [googleResponse]);

  // Handle Facebook Sign In Response
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      handleFacebookSignIn(authentication.accessToken);
    }
  }, [facebookResponse]);

  const loadSavedLogin = async () => {
    try {
      const savedLogin = await AsyncStorage.getItem('savedLogin');
      if (savedLogin) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedLogin);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setSaveLogin(true);
      }
    } catch (error) {
      console.error('Error loading saved login:', error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
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
    } catch (error) {
      console.error('Error during sign in:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (accessToken) => {
    setLoading(true);
    
    try {
      // Fetch user info from Google
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const userInfo = await response.json();
      
      // Check if user exists
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      let user = users.find(u => u.email === userInfo.email);
      
      if (user) {
        // User exists, log them in
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        
        if (user.onboardingCompleted) {
          router.replace('/tabs/home');
        } else {
          router.replace('/auth/step1');
        }
      } else {
        // User doesn't exist, suggest signup
        Alert.alert(
          'Account Not Found',
          'No account found with this Google email. Would you like to sign up?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Sign Up', 
              onPress: () => router.push('/auth/signup')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async (accessToken) => {
    setLoading(true);
    
    try {
      // Fetch user info from Facebook
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`
      );
      
      const userInfo = await response.json();
      
      if (!userInfo.email) {
        Alert.alert('Error', 'Unable to retrieve email from Facebook. Please use email login.');
        return;
      }
      
      // Check if user exists
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      let user = users.find(u => u.email === userInfo.email);
      
      if (user) {
        // User exists, log them in
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        
        if (user.onboardingCompleted) {
          router.replace('/tabs/home');
        } else {
          router.replace('/auth/step1');
        }
      } else {
        // User doesn't exist, suggest signup
        Alert.alert(
          'Account Not Found',
          'No account found with this Facebook email. Would you like to sign up?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Sign Up', 
              onPress: () => router.push('/auth/signup')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Facebook sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Facebook. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>Hapyness</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email@Hapyness.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Input your password here"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
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
              disabled={loading}
            >
              <Ionicons
                name={saveLogin ? "checkmark-sharp" : "square-outline"}
                size={20}
                color={saveLogin ? "#10B981" : "#666"}
              />
              <Text style={styles.checkboxText}>Save Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/auth/forgotpassword')}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]} 
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login Hapyness</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.gmailButton, loading && styles.disabledButton]} 
              onPress={() => googlePromptAsync()}
              disabled={!googleRequest || loading}
            >
              <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.socialButtonText}>Gmail</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.facebookButton, loading && styles.disabledButton]} 
              onPress={() => facebookPromptAsync()}
              disabled={!facebookRequest || loading}
            >
              <Ionicons name="logo-facebook" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By continuing you agree Hapyness{' '}
            <Text style={styles.linkText}>Term Of Use</Text> and confirm that you have read
            Hapyness <Text style={styles.linkText}>Privacy Policy</Text>
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
    tintColor: '#10B981',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  facebookButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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