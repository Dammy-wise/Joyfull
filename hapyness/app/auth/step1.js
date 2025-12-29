// hapyness/app/auth/step1.js
// ✅ FIXED - Removed duplicate router.replace and onboarding check
import React, { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step1() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState(null);

  const Step2 = async () => {
    if (!selectedGender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    try {
      await AsyncStorage.setItem("step1", JSON.stringify({gender: selectedGender}));
      router.push('/auth/step2');
    } catch (error) {
      console.error('Error saving step1 data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  };

  const handleSelect = (gender) => {
    setSelectedGender(gender);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back and Progress Circles */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.circle,
                step === 1 ? styles.activeCircle : styles.nextCircle,
              ]}
            >
              <Text
                style={[
                  styles.circleText,
                  step === 1 ? styles.activeCircleText : null,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>What's your gender?</Text>
      <Text style={styles.subtitle}>
        This helps us find you more relevant content
      </Text>

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderCard,
            selectedGender === "Male" && styles.selectedCard,
          ]}
          onPress={() => handleSelect("Male")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/image/male.png")}
            style={styles.genderImage}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === "Male" && styles.selectedText,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderCard,
            selectedGender === "Female" && styles.selectedCard,
          ]}
          onPress={() => handleSelect("Female")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/image/female.png")}
            style={styles.genderImage}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === "Female" && styles.selectedText,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>

      {/* Next Step Button */}
      <TouchableOpacity
        style={[styles.nextButton, !selectedGender && styles.disabledButton]}
        onPress={Step2}
        disabled={!selectedGender}
      >
        <Text style={styles.nextButtonText}>Next Step</Text>
      </TouchableOpacity>
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
  backText: {
    color: "#ccc",
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  activeCircle: {
    backgroundColor: "#ff3b30",
  },
  nextCircle: {
    backgroundColor: "#222",
  },
  circleText: {
    color: "#888",
    fontWeight: "bold",
  },
  activeCircleText: {
    color: "#fff",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 30,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  genderCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 29,
  },
  selectedCard: {
    backgroundColor: "#0a2910",
    borderWidth: 1,
    borderColor: "#00c851",
  },
  genderImage: {
    width: 120,
    height: 140,
    resizeMode: "contain",
  },
  genderText: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 8,
  },
  selectedText: {
    color: "#00c851",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#00c851",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});