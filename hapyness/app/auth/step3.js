import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Step3() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleNext = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    // ✅ Save step3 data
    await AsyncStorage.setItem("step3", JSON.stringify({ name }));
    await AsyncStorage.setItem("onboardingComplete", "true");

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

    // ✅ Navigate to home
    router.replace('/tabs/home'); // or '/tabs' depending on your structure
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/auth/step2')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <TouchableOpacity
              key={step}
              style={[
                styles.circle,
                step === 3 ? styles.activeCircle : styles.inactiveCircle,
              ]}
              onPress={() => router.push(`/auth/step${step}`)}
            >
              <Text
                style={[
                  styles.circleText,
                  step === 3 ? styles.activeCircleText : null,
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Tell me your username</Text>
        <Text style={styles.title}>please?</Text>
        <Text style={styles.subtitle}>This help your friend to, find your hapnezz account</Text>

        <TextInput
          style={styles.input}
          placeholder="Input your username here...."
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next Step</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 19,
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
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCircle: {
    backgroundColor: "#ff3b30",
  },
  inactiveCircle: {
    backgroundColor: "#222",
  },
  circleText: {
    color: "#888",
    fontWeight: "bold",
  },
  activeCircleText: {
    color: "#fff",
  },
});