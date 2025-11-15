import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useRouter} from 'expo-router'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - 6) / 3;

export default function Profile() {
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Set to false when viewing others
  const router = useRouter();
  const user = {
    name: 'Emanuel Watson.',
    username: '@emanuelwatson',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'PIVOTGANG 🍊\nCARE FOR ME TOUR OUT NOW 🎸\n#CHI-TOWN',
    description: 'This remind me of before we had insomnia\nSleepin\' peacefully, never needed a pile of drugs',
    following: 29,
    followers: 121900,
    badges: 80,
    posts: [
      { id: 1, image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400' },
      { id: 2, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400' },
      { id: 3, image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400' },
      { id: 4, image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=400' },
      { id: 5, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400' },
      { id: 6, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={(() => router.back() )} >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Ionicons name="grid" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user.image }} style={styles.profileImage} />
        </View>

        {/* Name */}
        <Text style={styles.name}>{user.name}</Text>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.followingButton}>
              <Text style={styles.followingText}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Ionicons name="chatbubble" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{user.bio}</Text>
          <Text style={styles.bioDescription}>{user.description}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {(user.followers / 1000).toFixed(1)}k
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.badges}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {user.posts.map(post => (
            <TouchableOpacity key={post.id} style={styles.postItem}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
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
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00ff88',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  followingButton: {
    flex: 1,
    backgroundColor: '#00ff88',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  followingText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: '#ff4458',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioSection: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  bioText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  bioDescription: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  postItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
});
