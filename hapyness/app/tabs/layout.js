import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';

const TabIcon = ({ focused, activeIcon, defaultIcon, notifyIcon, hasNotifications }) => {
  // If there are notifications and not focused, show notify icon
  const iconSource = hasNotifications && !focused ? notifyIcon : (focused ? activeIcon : defaultIcon);
  
  return (
    <View style={styles.tabIconContainer}>
      {focused && <View style={styles.activeBar} />}
      <Image 
        source={iconSource}
        style={styles.tabIcon}
        resizeMode="contain"
      />
    </View>
  );
};

export default function TabLayout() {
  const [hasNotifications, setHasNotifications] = useState(true); // Set to true when new notifications arrive

  // Simulate checking for notifications
  useEffect(() => {
    // This would be replaced with actual notification checking logic
    // For example, checking unread count from your backend
    const checkNotifications = () => {
      // setHasNotifications(unreadCount > 0);
    };
    
    checkNotifications();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/nav/home-active.png')}
              defaultIcon={require('../../assets/nav/home.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/nav/activity-active.png')}
              defaultIcon={require('../../assets/nav/activity.png')}
              notifyIcon={require('../../assets/nav/activity-notify.png')}
              hasNotifications={hasNotifications}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            // Mark notifications as read when user opens activity
            setHasNotifications(false);
          },
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/nav/add-active.png')}
              defaultIcon={require('../../assets/nav/add.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/nav/search-active.png')}
              defaultIcon={require('../../assets/nav/search.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={require('../../assets/nav/profile-active.png')}
              defaultIcon={require('../../assets/nav/profile.png')}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 10,
    paddingTop: 5,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeBar: {
    position: 'absolute',
    top: -8,
    width: 40,
    height: 3,
    backgroundColor: '#00ff88',
    borderRadius: 2,
  },
  tabIcon: {
    width: 26,
    height: 26,
  },
});

