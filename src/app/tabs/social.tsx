import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faHeart, 
  faComment, 
  faShare, 
  faPaperPlane,
  faImage,
  faVideo,
  faSmile
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Avatar } from '@kolking/react-native-avatar';
import { useRoute } from '@react-navigation/native';

interface Post {
  id: string;
  content: string;
  image_url?: string;
  username: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

interface Comment {
  id: string;
  content: string;
  username: string;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  posts?: T[];
  comments?: T[];
  message?: string;
}

export default function Social() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const route = useRoute<any>();
  const userId = route.params?.id;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse<Post>>('http://204.236.195.55:8000/posts');
      if (response.data.success && response.data.posts) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const createPost = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to create a post');
      return;
    }
    
    if (!newPost.trim()) return;
    
    try {
      const response = await axios.post<ApiResponse<Post>>('http://204.236.195.55:8000/posts', {
        user_id: userId,
        content: newPost,
      });
      if (response.data.success) {
        setNewPost('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  const likePost = async (postId: string) => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to like posts');
      return;
    }

    try {
      const response = await axios.post<ApiResponse<null>>(`http://204.236.195.55:8000/posts/${postId}/like`, {
        user_id: userId,
      });
      if (response.data.success) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await axios.get<ApiResponse<Comment>>(`http://204.236.195.55:8000/posts/${postId}/comments`);
      if (response.data.success && response.data.comments) {
        setComments(prev => ({ ...prev, [postId]: response.data.comments! }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments. Please try again.');
    }
  };

  const addComment = async (postId: string) => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;
    
    try {
      const response = await axios.post<ApiResponse<Comment>>(`http://204.236.195.55:8000/posts/${postId}/comment`, {
        user_id: userId,
        content: newComment,
      });
      if (response.data.success) {
        setNewComment('');
        fetchComments(postId);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Feed</Text>
      </View>

      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.createPostCard}>
          <View style={styles.createPostHeader}>
            <Avatar 
              size={40} 
              name={route.params?.username || 'User'}
              style={{ backgroundColor: '#ff3b30' }}
            />
            <TextInput
              style={styles.createPostInput}
              placeholder="Share your workout journey..."
              placeholderTextColor="#888"
              value={newPost}
              onChangeText={setNewPost}
              multiline
            />
          </View>
          <View style={styles.createPostActions}>
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton}>
                <FontAwesomeIcon icon={faImage} size={20} color="#4CAF50" />
                <Text style={styles.mediaButtonText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <FontAwesomeIcon icon={faVideo} size={20} color="#2196F3" />
                <Text style={styles.mediaButtonText}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <FontAwesomeIcon icon={faSmile} size={20} color="#FFC107" />
                <Text style={styles.mediaButtonText}>Feeling</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.postButton, !newPost.trim() && styles.postButtonDisabled]} 
              onPress={createPost}
              disabled={!newPost.trim()}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet. Share your first workout!</Text>
          </View>
        ) : (
          posts.map(post => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postHeader}>
                <Avatar 
                  size={45} 
                  name={post.username}
                  style={{ backgroundColor: '#ff3b30' }}
                />
                <View style={styles.postHeaderText}>
                  <Text style={styles.username}>{post.username}</Text>
                  <Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
                </View>
              </View>

              <Text style={styles.content}>{post.content}</Text>
              {post.image_url && (
                <Image 
                  source={{ uri: post.image_url }} 
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.actions}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => likePost(post.id)}
                >
                  <FontAwesomeIcon 
                    icon={faHeart} 
                    size={22} 
                    color={post.likes_count > 0 ? "#ff3b30" : "#fff"} 
                  />
                  <Text style={styles.actionText}>{post.likes_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedPost(selectedPost === post.id ? null : post.id);
                    if (selectedPost !== post.id) {
                      fetchComments(post.id);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faComment} size={22} color="#fff" />
                  <Text style={styles.actionText}>{post.comments_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesomeIcon icon={faShare} size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              {selectedPost === post.id && (
                <View style={styles.commentsSection}>
                  <View style={styles.commentInput}>
                    <TextInput
                      style={styles.commentTextInput}
                      placeholder="Add a comment..."
                      placeholderTextColor="#888"
                      value={newComment}
                      onChangeText={setNewComment}
                    />
                    <TouchableOpacity 
                      style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
                      onPress={() => addComment(post.id)}
                      disabled={!newComment.trim()}
                    >
                      <FontAwesomeIcon 
                        icon={faPaperPlane} 
                        size={16} 
                        color={newComment.trim() ? "#ff3b30" : "#666"} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {comments[post.id]?.map(comment => (
                    <View key={comment.id} style={styles.comment}>
                      <Avatar 
                        size={35} 
                        name={comment.username}
                        style={{ backgroundColor: '#666' }}
                      />
                      <View style={styles.commentContent}>
                        <Text style={styles.commentUsername}>{comment.username}</Text>
                        <Text style={styles.commentText}>{comment.content}</Text>
                        <Text style={styles.commentTimestamp}>
                          {formatDate(comment.created_at)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#111',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  createPostCard: {
    backgroundColor: '#222',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  createPostInput: {
    flex: 1,
    marginLeft: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 40,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mediaButtonText: {
    color: '#888',
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#444',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  post: {
    backgroundColor: '#222',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postHeaderText: {
    marginLeft: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: Dimensions.get('window').width - 60,
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
  commentsSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  commentTextInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    padding: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 15,
  },
  commentUsername: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 15,
  },
  commentText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  commentTimestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
  },
});