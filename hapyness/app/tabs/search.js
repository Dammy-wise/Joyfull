import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Following');

  const users = [
    {
      id: 1,
      name: 'Amanda Sarah',
      username: '@amandasarah',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      verified: true,
      followers: '2.5M',
    },
    {
      id: 2,
      name: 'Brandon Jack',
      username: '@brandonjack',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      verified: false,
      followers: '1.2M',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.headerTabs}>
        <TouchableOpacity onPress={() => setActiveTab('Following')}>
          <Text
            style={[
              styles.headerTab,
              activeTab === 'Following' && styles.headerTabActive,
            ]}
          >
            Following
          </Text>
        </TouchableOpacity>
        <View style={styles.tabDivider} />
        <TouchableOpacity onPress={() => setActiveTab('Not Following')}>
          <Text
            style={[
              styles.headerTab,
              activeTab === 'Not Following' && styles.headerTabActive,
            ]}
          >
            Not Following
          </Text>
          {activeTab === 'Not Following' && <View style={styles.trendingDot} />}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, id or something"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Results */}
        {users.map(user => (
          <TouchableOpacity key={user.id} style={styles.userItem}>
            <Image source={{ uri: user.image }} style={styles.userImage} />
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.name}</Text>
                {user.verified && (
                  <Image
                    source={require('../../assets/icons/verified.png')}
                    style={styles.verifiedBadge}
                  />
                )}
              </View>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.followers}>{user.followers} followers</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

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
  headerTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  headerTab: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  headerTabActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabDivider: {
    width: 2,
    height: 20,
    backgroundColor: '#fff',
  },
  trendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff4458',
    position: 'absolute',
    top: -2,
    right: -8,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
  },
  username: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  followers: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
  },
  followText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});