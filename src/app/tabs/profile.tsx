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
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Avatar } from '@kolking/react-native-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';

// Define route params type
type ProfileScreenParams = {
  Profile: {
    username: string;
  };
};

type ProfileScreenRouteProp = RouteProp<ProfileScreenParams, 'Profile'>;

interface User {
  id: string;
  username: string;
  experience_level: string;
  avatar_url?: string;
  friendshipStatus?: 'pending' | 'accepted' | 'rejected';
}

interface Discipline {
  id: string;
  name: string;
  icon: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const route = useRoute<ProfileScreenRouteProp>();
  const username = route.params?.username;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
      fetchUserDisciplines();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User>(`http://localhost:8000/api/users/${username}`);
      setUser(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDisciplines = async () => {
    try {
      const response = await axios.get<Discipline[]>(`http://localhost:8000/api/users/${username}/disciplines`);
      setDisciplines(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchUsers = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get<User[]>(`http://localhost:8000/api/users/search?q=${query}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error(err);
    }
  }, 300);

  const sendFriendRequest = async (userId: string) => {
    try {
      await axios.post(`http://localhost:8000/api/friendships`, {
        addressee_id: userId
      });
      // Update UI to show pending request
      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, friendshipStatus: 'pending' }
            : user
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff3b30" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar
          size={100}
          name={user?.username || ''}
          source={user?.avatar_url ? { uri: user.avatar_url } : undefined}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.experienceLevel}>{user?.experience_level}</Text>
        </View>
      </View>

      {/* Search Bar */}
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.id}
              style={styles.searchResultItem}
              onPress={() => sendFriendRequest(result.id)}
            >
              <Avatar size={40} name={result.username} />
              <Text style={styles.searchResultName}>{result.username}</Text>
              <FontAwesomeIcon icon={faUserPlus} size={20} color="#ff3b30" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Disciplines */}
      <Text style={styles.sectionTitle}>My Disciplines</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.disciplinesContainer}
      >
        {disciplines.map((discipline) => (
          <View key={discipline.id} style={styles.disciplineCard}>
            <Text style={styles.disciplineIcon}>{discipline.icon}</Text>
            <Text style={styles.disciplineName}>{discipline.name}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  profileInfo: {
    marginLeft: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  experienceLevel: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  searchResults: {
    margin: 20,
    marginTop: 0,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchResultName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    margin: 20,
    marginBottom: 10,
  },
  disciplinesContainer: {
    paddingHorizontal: 20,
  },
  disciplineCard: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  disciplineIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  disciplineName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Profile; 