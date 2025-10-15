import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function Step3({navigation}) {
  const navigation = useNavigation();
  const [name, setName] = useState("");

  const handleNext = () => {
    if (name.trim().length > 0) {
      navigation.navigate("Home");
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {/* Step Indicators */}
            <View style={styles.stepContainer}>
              <View style={styles.stepInactive} />
              <View style={styles.stepInactive} />
              <View style={styles.stepActive} />
            </View>

            {/* Title and Subtitle */}
            <Text style={styles.title}>Tell me your name please?</Text>
            <Text style={styles.subtitle}>
              This helps your friends find your Hapnezz account
            </Text>

            {/* Input */}
            <TextInput
              placeholder="Input your name here..."
              placeholderTextColor="#777"
              value={name}
              onChangeText={setName}
              style={styles.input}
              returnKeyType="done"
            />

            {/* Next Button */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next Step</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D", // same dark background as Step1 & Step2
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  stepInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#333",
    marginLeft: 10,
  },
  stepActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF3B30",
    marginLeft: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#00D084",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#00D084",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
