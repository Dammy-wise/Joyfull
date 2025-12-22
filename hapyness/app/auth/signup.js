import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Google OAuth Configuration
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: '237274952758-u2a8qnjc1nojstqi5facqqrn02nmaq1p.apps.googleusercontent.com',
    iosClientId: '237274952758-iu7dcg8q2v7ka9umsaq4ms0vagjsdije.apps.googleusercontent.com',
    androidClientId: '237274952758-0sl06arlh56232jgvbuto833af4k55rd.apps.googleusercontent.com',
    webClientId: '237274952758-tnbbbdr3mfv07mppufogc6cijr4v2svi.apps.googleusercontent.com',
  });

  // Facebook OAuth Configuration
  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  // Handle Google Sign Up Response
  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      handleGoogleSignUp(authentication.accessToken);
    }
  }, [googleResponse]);

  // Handle Facebook Sign Up Response
  React.useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      handleFacebookSignUp(authentication.accessToken);
    }
  }, [facebookResponse]);

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

    setLoading(true);

    try {
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
        authProvider: 'email',
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/auth/signin') }
      ]);
    } catch (error) {
      console.error('Error during sign up:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (accessToken) => {
    setLoading(true);
    
    try {
      // Fetch user info from Google
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const userInfo = await response.json();
      
      // Check if user already exists
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      let existingUser = users.find(u => u.email === userInfo.email);
      
      if (existingUser) {
        // User exists, log them in
        await AsyncStorage.setItem('currentUser', JSON.stringify(existingUser));
        
        if (existingUser.onboardingCompleted) {
          router.replace('/tabs/home');
        } else {
          router.replace('/auth/step1');
        }
      } else {
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email: userInfo.email,
          name: userInfo.name,
          profilePicture: userInfo.picture,
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
          authProvider: 'google',
        };

        users.push(newUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
        
        Alert.alert('Success', 'Google account linked successfully!', [
          { text: 'OK', onPress: () => router.replace('/auth/step1') }
        ]);
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async (accessToken) => {
    setLoading(true);
    
    try {
      // Fetch user info from Facebook
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`
      );
      
      const userInfo = await response.json();
      
      if (!userInfo.email) {
        Alert.alert('Error', 'Unable to retrieve email from Facebook. Please use email signup.');
        return;
      }
      
      // Check if user already exists
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      let existingUser = users.find(u => u.email === userInfo.email);
      
      if (existingUser) {
        // User exists, log them in
        await AsyncStorage.setItem('currentUser', JSON.stringify(existingUser));
        
        if (existingUser.onboardingCompleted) {
          router.replace('/tabs/home');
        } else {
          router.replace('/auth/step1');
        }
      } else {
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email: userInfo.email,
          name: userInfo.name,
          profilePicture: userInfo.picture?.data?.url,
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
          authProvider: 'facebook',
        };

        users.push(newUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
        
        Alert.alert('Success', 'Facebook account linked successfully!', [
          { text: 'OK', onPress: () => router.replace('/auth/step1') }
        ]);
      }
    } catch (error) {
      console.error('Facebook sign up error:', error);
      Alert.alert('Error', 'Failed to sign up with Facebook. Please try again.');
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
        <Text style={styles.title}>Sign up to,</Text>
        <Text style={styles.title}>Hapyness</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email@Hapnezz.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Input your password here"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Re-type your password"
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.createButton, loading && styles.disabledButton]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>Create Account</Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  createButtonText: {
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