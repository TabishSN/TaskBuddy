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
  Image,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Avatar } from '@kolking/react-native-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUserPlus, faCheck, faClock, faCamera, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';

interface User {
  id: string;
  username: string;
  email: string;
  friendshipStatus?: 'pending' | 'accepted' | null;
  profile_pictures?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface SearchResponse {
  success: boolean;
  data: User[];
  message?: string;
}

interface FriendshipResponse {
  success: boolean;
  message: string;
}

const { width } = Dimensions.get('window');

const uploadImage = async (uri: string) => {
  try {
    // In a real app, you would upload the image to a storage service
    // For this example, we'll just use the URI directly
    return uri;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default function Profile() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profilePictures, setProfilePictures] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const route = useRoute<any>();
  const username = route.params?.username;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
    requestGalleryPermission();
  }, [username]);

  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setLoading(true);
        try {
          const imageUrl = await uploadImage(result.assets[0].uri);
          
          // Update profile pictures in the database
          const response = await axios.post(
            `http://204.236.195.55:8000/users/${currentUser?.id}/profile-pictures`,
            { imageUrl }
          );

          if (response.data.success) {
            setProfilePictures(prev => [...prev, imageUrl]);
            setCurrentImageIndex(profilePictures.length);
          }
        } catch (error) {
          console.error('Error updating profile picture:', error);
          Alert.alert('Error', 'Failed to update profile picture');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const nextImage = () => {
    if (currentImageIndex < profilePictures.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<User>>(
        `http://204.236.195.55:8000/users/${username}`
      );
      
      if (response.data.success) {
        setCurrentUser(response.data.data);
        if (response.data.data.profile_pictures) {
          setProfilePictures(response.data.data.profile_pictures);
        }
      }
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
      const response = await axios.get<SearchResponse>(
        `http://204.236.195.55:8000/search`,
        {
          params: {
            q: query,
            currentUserId: currentUser?.id
          }
        }
      );
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  }, 500);

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await axios.post<FriendshipResponse>(
        `http://204.236.195.55:8000/friendships`,
        {
          from_user_id: currentUser?.id,
          to_user_id: userId
        }
      );
      
      if (response.data.success) {
        setSearchResults(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, friendshipStatus: 'pending' }
              : user
          )
        );
        
        Alert.alert('Success', 'Friend request sent!');
      }
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
      {/* Profile Header with Slideshow */}
      <View style={styles.profileHeader}>
        <View style={styles.slideshowContainer}>
          {profilePictures.length > 0 ? (
            <>
              <Image
                source={{ uri: profilePictures[currentImageIndex] }}
                style={styles.profileImage}
              />
              {profilePictures.length > 1 && (
                <View style={styles.slideshowControls}>
                  <TouchableOpacity 
                    style={styles.slideshowButton} 
                    onPress={previousImage}
                    disabled={currentImageIndex === 0}
                  >
                    <FontAwesomeIcon 
                      icon={faChevronLeft} 
                      size={20} 
                      color={currentImageIndex === 0 ? '#666' : '#fff'} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.slideshowButton} 
                    onPress={nextImage}
                    disabled={currentImageIndex === profilePictures.length - 1}
                  >
                    <FontAwesomeIcon 
                      icon={faChevronRight} 
                      size={20} 
                      color={currentImageIndex === profilePictures.length - 1 ? '#666' : '#fff'} 
                    />
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <Avatar
              size={120}
              name={username || ''}
              style={{ backgroundColor: '#ff3b30' }}
            />
          )}
          <TouchableOpacity 
            style={styles.addPhotoButton}
            onPress={pickImage}
          >
            <FontAwesomeIcon icon={faCamera} size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{username}</Text>
          {profilePictures.length > 0 && (
            <Text style={styles.photoCount}>
              {currentImageIndex + 1} / {profilePictures.length}
            </Text>
          )}
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
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  slideshowContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  slideshowControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  slideshowButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  photoCount: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
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