import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
   <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Sign up to,</Text>
      <Text style={styles.title}>Hapnezz</Text>

      <TextInput
        placeholder="Email@Hapnezz.com"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Input your password here"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Re-type your password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Or</Text>

      <View style={styles.socials}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: 'red' }]}>
          <Text style={styles.buttonText}>Gmail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: 'blue' }]}>
          <Text style={styles.buttonText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  input: { backgroundColor: '#222', width: '100%', padding: 15, borderRadius: 8, marginVertical: 10, color: '#fff' },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '600' },
  or: { marginVertical: 15, color: '#aaa' },
  socials: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  socialButton: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  link: { color: 'skyblue', marginTop: 20 }
});
