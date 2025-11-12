import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Step3() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleNext = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    const currentUserData = await AsyncStorage.getItem('currentUser');
    const currentUser = JSON.parse(currentUserData);
    
    currentUser.name = name;
    currentUser.onboardingCompleted = true;
    await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));

    const usersData = await AsyncStorage.getItem('users');
    const users = JSON.parse(usersData);
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    users[userIndex] = currentUser;
    await AsyncStorage.setItem('users', JSON.stringify(users));

    router.replace('../tabs/home');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.stepIndicator}>
          <View style={[styles.step, styles.stepInactive]}>
            <Text style={styles.stepInactiveText}>1</Text>
          </View>
          <View style={[styles.step, styles.stepInactive]}>
            <Text style={styles.stepInactiveText}>2</Text>
          </View>
          <View style={[styles.step, styles.stepActive]}>
            <Text style={styles.stepActiveText}>3</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Tell me your name</Text>
        <Text style={styles.title}>please?</Text>
        <Text style={styles.subtitle}>This help your friend to, find your hapnezz account</Text>

        <TextInput
          style={styles.input}
          placeholder="Input your name here...."
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next Step</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: '#EF4444',
  },
  stepInactive: {
    backgroundColor: '#2a2a2a',
  },
  stepActiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepInactiveText: {
    color: '#666',
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
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: '#10B981',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});