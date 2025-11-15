import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {useRouter} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Activity() {
   const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All Activity');

  const notifications = {
    system: [
      {
        id: 1,
        icon: require('../../assets/icons/app-icon.png'),
        message: 'Welcome to Hapyness arma...',
        time: '2m',
      },
      {
        id: 2,
        icon: 'notifications',
        message: 'You can turn off notifications',
        time: '2m',
        hasArrow: true,
      },
    ],
    activity: [
      {
        id: 3,
        user: {
          name: 'Sarah Amalia',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        action: 'commented your post',
        time: '2m',
      },
      {
        id: 4,
        user: {
          name: 'Brandon Jack',
          image: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        action: 'commented your post',
        time: '2m',
      },
      {
        id: 5,
        users: [
          { image: 'https://randomuser.me/api/portraits/women/4.jpg' },
          { image: 'https://randomuser.me/api/portraits/men/5.jpg' },
        ],
        message: 'Lewis C and 41more like your content',
        time: '2m',
      },
      {
        id: 6,
        user: {
          name: 'Jack Nicole',
          image: 'https://randomuser.me/api/portraits/men/6.jpg',
        },
        action: 'commented your post',
        time: '2m',
      },
    ],
    messages: [
      {
        id: 7,
        user: {
          name: 'Brandon Olan',
          image: 'https://randomuser.me/api/portraits/men/7.jpg',
        },
        time: '2m',
      },

      {
        id: 8,
        user: {
          name: 'Thompson Olan',
          image: 'https://randomuser.me/api/portraits/men/8.jpg',
        },
        time: '3m',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/tabs/home')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={28} color="#00ff88" />
        </TouchableOpacity>
      </View>

      {/* Filter and Search */}
      <View style={styles.filterSection}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>{selectedFilter}</Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* System Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          {notifications.system.map(notif => (
            <TouchableOpacity key={notif.id} style={styles.notifItem}>
              <View style={styles.notifIcon}>
                {notif.icon === 'notifications' ? (
                  <Ionicons name="notifications" size={24} color="#fff" />
                ) : (
                  <Image source={notif.icon} style={styles.iconImage} />
                )}
              </View>
              <Text style={styles.notifText}>{notif.message}</Text>
              {notif.hasArrow && (
                <Ionicons name="chevron-forward" size={20} color="#666" />
              )}
              <Text style={styles.notifTime}>{notif.time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          {notifications.activity.map(notif => (
            <TouchableOpacity key={notif.id} style={styles.notifItem}>
              {notif.users ? (
                <View style={styles.multipleUsers}>
                  {notif.users.map((user, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: user.image }}
                      style={[styles.userImage, idx > 0 && { marginLeft: -10 }]}
                    />
                  ))}
                </View>
              ) : (
                <Image
                  source={{ uri: notif.user.image }}
                  style={styles.userImage}
                />
              )}
              <View style={styles.notifContent}>
                <Text style={styles.notifText}>
                  {notif.user ? (
                    <>
                      <Text style={styles.userName}>{notif.user.name}</Text>
                      <Text>, {notif.action}</Text>
                    </>
                  ) : (
                    notif.message
                  )}
                </Text>
              </View>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message</Text>
          {notifications.messages.map(notif => (
            <TouchableOpacity key={notif.id} style={styles.notifItem}>
              <Image source={{ uri: notif.user.image }} style={styles.userImage} />
              <View style={styles.notifContent}>
                <Text style={styles.userName}>{notif.user.name}</Text>
              </View>
              <Text style={styles.notifTime}>{notif.time}</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ff88',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  filterText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: '#fff',
    fontSize: 14,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  multipleUsers: {
    flexDirection: 'row',
  },
  notifContent: {
    flex: 1,
  },
  notifText: {
    color: '#fff',
    fontSize: 14,
  },
  userName: {
    fontWeight: '600',
    color: '#fff',
  },
  notifTime: {
    color: '#666',
    fontSize: 12,
  },
});