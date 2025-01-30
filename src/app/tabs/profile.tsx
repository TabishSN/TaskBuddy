import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Avatar } from '@kolking/react-native-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUserPlus, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  username: string;
  email: string;
  friendshipStatus?: 'pending' | 'accepted' | null;
}

export default function Profile() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const route = useRoute<any>();
  const username = route.params?.username;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://204.236.195.55:8000/users/${username}`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://204.236.195.55:8000/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  }, 500);

  const sendFriendRequest = async (userId: string) => {
    try {
      await axios.post(`http://204.236.195.55:8000/friendships`, {
        from_user_id: currentUser?.id,
        to_user_id: userId
      });
      
      // Update the search results to show pending status
      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, friendshipStatus: 'pending' }
            : user
        )
      );
      
      Alert.alert('Success', 'Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const getFriendshipStatusIcon = (status: string | null | undefined) => {
    switch (status) {
      case 'pending':
        return <FontAwesomeIcon icon={faClock} size={20} color="#FFA500" />;
      case 'accepted':
        return <FontAwesomeIcon icon={faCheck} size={20} color="#4CAF50" />;
      default:
        return <FontAwesomeIcon icon={faUserPlus} size={20} color="#ff3b30" />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar
          size={100}
          name={username || ''}
          style={{ backgroundColor: '#ff3b30' }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Find Friends</Text>
        <View style={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchUsers(text);
            }}
          />
        </View>

        {loading && (
          <ActivityIndicator style={styles.loader} color="#ff3b30" />
        )}

        {searchResults.map((user) => (
          <View key={user.id} style={styles.searchResultItem}>
            <View style={styles.userInfo}>
              <Avatar size={40} name={user.username} style={{ backgroundColor: '#666' }} />
              <View style={styles.userDetails}>
                <Text style={styles.searchResultName}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[
                styles.friendActionButton,
                user.friendshipStatus === 'pending' && styles.pendingButton,
                user.friendshipStatus === 'accepted' && styles.acceptedButton
              ]}
              onPress={() => sendFriendRequest(user.id)}
              disabled={user.friendshipStatus !== null}
            >
              {getFriendshipStatusIcon(user.friendshipStatus)}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileInfo: {
    marginLeft: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  friendActionButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  pendingButton: {
    backgroundColor: '#333',
  },
  acceptedButton: {
    backgroundColor: '#1c411e',
  },
});