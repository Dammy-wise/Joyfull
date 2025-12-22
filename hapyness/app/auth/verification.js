import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Verification() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('(091) 123 - 4567');

  const handleNumberPress = (num) => {
    const firstEmpty = code.findIndex(c => c === '');
    if (firstEmpty !== -1) {
      const newCode = [...code];
      newCode[firstEmpty] = num;
      setCode(newCode);
    }
  };

  const handleDelete = () => {
    const lastFilled = code.findLastIndex(c => c !== '');
    if (lastFilled !== -1) {
      const newCode = [...code];
      newCode[lastFilled] = '';
      setCode(newCode);
    }
  };

  const handleDonate = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      Alert.alert('Error', 'Please enter complete verification code');
      return;
    }

    try {
      const savedCode = await AsyncStorage.getItem('verificationCode');
      
      if (enteredCode === savedCode) {
        Alert.alert('Success', 'Code verified!', [
          { text: 'OK', onPress: () => router.push('/auth/resetpassword') }
        ]);
      } else {
        Alert.alert('Error', 'Invalid verification code');
        setCode(['', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Failed to verify code. Please try again.');
    }
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', '.', '×']
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={styles.backText}>Donations</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          A verification codes has been sent to {phoneNumber}
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <View key={index} style={styles.codeBox}>
              <Text style={styles.codeText}>{digit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.keypad}>
          {numbers.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((num, numIndex) => (
                <TouchableOpacity
                  key={numIndex}
                  style={styles.keypadButton}
                  onPress={() => {
                    if (num === '×') {
                      handleDelete();
                    } else if (num !== '.') {
                      handleNumberPress(num);
                    }
                  }}
                >
                  <Text style={[
                    styles.keypadText,
                    num === '×' && styles.deleteText
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
          <Text style={styles.donateButtonText}>Donate</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 60,
  },
  codeBox: {
    width: 48,
    height: 48,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  keypad: {
    width: '100%',
    marginBottom: 40,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  keypadButton: {
    width: 72,
    height: 72,
    backgroundColor: '#2a2a2a',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 24,
  },
  donateButton: {
    backgroundColor: '#10B981',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});