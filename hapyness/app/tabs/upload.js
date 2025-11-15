import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function Upload() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const router = useRouter();
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back ()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload</Text>
        <TouchableOpacity>
          <Text style={styles.nextButton}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Area */}
      <View style={styles.uploadArea}>
        {selectedMedia ? (
          <Image source={{ uri: selectedMedia }} style={styles.previewImage} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={80} color="#666" />
            <Text style={styles.uploadText}>Select media to upload</Text>
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Ionicons name="images-outline" size={32} color="#fff" />
          <Text style={styles.actionText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={openCamera}>
          <Ionicons name="camera-outline" size={32} color="#fff" />
          <Text style={styles.actionText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="videocam-outline" size={32} color="#fff" />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextButton: {
    fontSize: 16,
    color: '#00ff88',
    fontWeight: '600',
  },
  uploadArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#fff',
  },
});