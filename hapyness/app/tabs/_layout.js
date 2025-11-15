import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


// ------------------ DEFAULT TAB ICON ------------------
const TabIcon = ({ focused, activeIcon, defaultIcon, notifyIcon, hasNotifications }) => {

  const iconSource =
    hasNotifications && !focused
      ? notifyIcon
      : focused
      ? activeIcon
      : defaultIcon;

  return (
   <SafeAreaView>
    <View style={styles.tabIconContainer}>
      {focused && <View style={styles.activeBar} />}
      <Image 
        source={iconSource}
        style={styles.tabIcon}
        resizeMode="contain"
      />
    </View>
    </SafeAreaView>
  );
};


// ------------------ UPLOAD TAB ICON (separate & larger) ------------------
const TabIcon1 = ({ focus, active, defaultic }) => {
  const iconSource = focus ? active : defaultic;
  return (
   <SafeAreaView>
    <View style={styles.tabIconContainer}>
      {focus && <View style={styles.activeBar} />}
      <Image
        source={iconSource}
        style={styles.uploadIcon}     // 👈 bigger size here
        resizeMode="contain"
      />
    </View>
    </SafeAreaView>
  );
};



export default function TabLayout() {
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const checkNotifications = () => {};
    checkNotifications();
  }, []);

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      
      <Tabs.Screen
        name="home"
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
          tabPress: () => setHasNotifications(false),
        }}
      />

      {/* UPLOAD — uses bigger icon */}
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ focused }) => (
            <TabIcon1
              focus={focused}
              active={require('../../assets/nav/add-active.png')}
              defaultic={require('../../assets/nav/add.png')}
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
    height: 89,
    paddingBottom: 13,
    paddingTop: 10,
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

  // regular icons
  tabIcon: {
    width: 26,
    height: 26,
  },

  // 👉 bigger Upload icon
  uploadIcon: {
    width: 35,   // increase size here
    height: 35,  // increase size here
    marginBottom: -9,
  },
});
