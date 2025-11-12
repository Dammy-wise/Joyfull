import { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Mock posts data

const MOCK_POSTS = [
  {
    id: '1',
    type: 'content',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
    author: 'Spotify Music',
    verified: true,
    description: 'Lewis Capaldi says his mum and dad dissed someone you loved and told him to ditch it in #SpotifyMusic',
    music: { artist: 'Clinton Kane', title: 'I dont want watch the wo..' },
    hashtag: '#Thai..',
    likes: 1900,
    shares: 200,
    comments: 200,
    saves: 0,
    isLiked: false,
    isSaved: false,
    category: 'trending',
  },
  {
    id: '2',
    type: 'content',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
    author: 'Amanda Sarah',
    verified: true,
    description: "Thailan's capital is a fast, buzzing city of over eight million people. Know for cosmopolitan feel #ThaiAdventure",
    music: { artist: 'Clinton Kane', title: 'I dont want watch the wo..' },
    hashtag: '#Thai..',
    likes: 1900,
    shares: 200,
    comments: 200,
    saves: 0,
    isLiked: false,
    isSaved: false,
    category: 'following',
  },
  {
    id: '3',
    type: 'content',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    author: 'Amanda Sarah',
    verified: true,
    description: "Thailan's capital is a fast, buzzing city of over eight million people. Know for cosmopolitan feel #ThaiAdventure",
    music: { artist: 'Clinton Kane', title: 'I dont want watch the wo..' },
    hashtag: '#Thai..',
    likes: 1900,
    shares: 200,
    comments: 200,
    saves: 0,
    isLiked: false,
    isSaved: false,
    category: 'trending',
  },
];

export default function home() {
  const [activeTab, setActiveTab] = useState('following');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadUser();
    loadPosts();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadPosts = async () => {
    const storedPosts = await AsyncStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  };

  const savePosts = async (updatedPosts) => {
    await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const toggleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const toggleSave = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const filteredPosts = posts.filter(post => post.category === activeTab);

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      
      {/* Right side actions */}
      <View style={styles.actionsContainer}>
        {/* Trophy/Hashtag */}
        <View style={styles.actionItem}>
          <View style={styles.actionButton}>
            <Ionicons name="trophy" size={28} color="#fff" />
          </View>
          <Text style={styles.actionLabel}>{item.hashtag}</Text>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.actionItem} onPress={() => toggleSave(item.id)}>
          <View style={styles.actionButton}>
            <Ionicons 
              name={item.isSaved ? 'bookmark' : 'bookmark-outline'} 
              size={28} 
              color="#fff" 
            />
          </View>
          <Text style={styles.actionLabel}>Save</Text>
        </TouchableOpacity>

        {/* Like */}
        <TouchableOpacity style={styles.actionItem} onPress={() => toggleLike(item.id)}>
          <View style={styles.actionButton}>
            <Ionicons 
              name={item.isLiked ? 'heart' : 'heart-outline'} 
              size={28} 
              color={item.isLiked ? '#EF4444' : '#fff'} 
            />
          </View>
          <Text style={styles.actionLabel}>{item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionButton}>
            <Ionicons name="arrow-redo" size={28} color="#fff" />
          </View>
          <Text style={styles.actionLabel}>{item.shares}</Text>
        </TouchableOpacity>

        {/* Comments */}
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionButton}>
            <Ionicons name="chatbox-outline" size={28} color="#fff" />
          </View>
          <Text style={styles.actionLabel}>{item.comments}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        {item.type === 'content' && (
          <View style={styles.authorContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }} 
              style={styles.authorImage} 
            />
            {item.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#10B981" style={styles.verifiedIcon} />
            )}
          </View>
        )}

        {item.type === 'ad' && (
          <View style={styles.adContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=2' }} 
              style={styles.adImage} 
            />
            {item.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#10B981" style={styles.verifiedIcon} />
            )}
          </View>
        )}

        <View style={styles.infoContent}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          
          {item.type === 'ad' && (
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          )}

          <View style={styles.musicInfo}>
            <Ionicons name="musical-notes" size={14} color="#fff" />
            <Text style={styles.musicText} numberOfLines={1}>
              {item.music.artist} - {item.music.title}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with tabs */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>
            Following
          </Text>
          {activeTab === 'following' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.tab}
          onPress={() => setActiveTab('trending')}
        >
          <Text style={[styles.tabText, activeTab === 'trending' && styles.tabTextActive]}>
            Trendings
          </Text>
          {activeTab === 'trending' && (
            <View style={styles.notificationDot} />
          )}
        </TouchableOpacity>
      </View>

      {/* Posts */}
      <FlatList
        ref={flatListRef}
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 80}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  tab: {
    position: 'relative',
    paddingHorizontal: 20,
  },
  tabText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  divider: {
    width: 2,
    height: 20,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  postContainer: {
    width: width,
    height: height - 80,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
  },
  actionItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 100,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  adContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  verifiedIcon: {
    marginLeft: -8,
  },
  infoContent: {
    paddingLeft: 4,
  },
  authorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  downloadButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  musicText: {
    color: '#fff',
    fontSize: 12,
    maxWidth: width - 120,
  },
});