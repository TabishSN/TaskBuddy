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
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faComment, faShare, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
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

export default function Social() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  
  const route = useRoute();
  const userId = route.params?.id;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://204.236.195.55:8000/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;
    try {
      await axios.post('http://204.236.195.55:8000/posts', {
        user_id: userId,
        content: newPost,
      });
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const likePost = async (postId: string) => {
    try {
      await axios.post(`http://204.236.195.55:8000/posts/${postId}/like`, {
        user_id: userId,
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await axios.get(`http://204.236.195.55:8000/posts/${postId}/comments`);
      setComments(prev => ({ ...prev, [postId]: response.data.comments }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`http://204.236.195.55:8000/posts/${postId}/comment`, {
        user_id: userId,
        content: newComment,
      });
      setNewComment('');
      fetchComments(postId);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#888"
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={createPost}>
          <FontAwesomeIcon icon={faPaperPlane} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {posts.map(post => (
        <View key={post.id} style={styles.post}>
          <View style={styles.postHeader}>
            <Avatar size={40} name={post.username} backgroundColor="#ff3b30" />
            <View style={styles.postHeaderText}>
              <Text style={styles.username}>{post.username}</Text>
              <Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
            </View>
          </View>

          <Text style={styles.content}>{post.content}</Text>
          {post.image_url && (
            <Image source={{ uri: post.image_url }} style={styles.postImage} />
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => likePost(post.id)}>
              <FontAwesomeIcon icon={faHeart} size={20} color="#ff3b30" />
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
              <FontAwesomeIcon icon={faComment} size={20} color="#fff" />
              <Text style={styles.actionText}>{post.comments_count}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesomeIcon icon={faShare} size={20} color="#fff" />
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
                  style={styles.sendButton}
                  onPress={() => addComment(post.id)}
                >
                  <FontAwesomeIcon icon={faPaperPlane} size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {comments[post.id]?.map(comment => (
                <View key={comment.id} style={styles.comment}>
                  <Avatar size={30} name={comment.username} backgroundColor="#666" />
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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  newPostContainer: {
    padding: 15,
    backgroundColor: '#222',
    marginTop: 60,
    marginHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    minHeight: 40,
  },
  postButton: {
    padding: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 20,
    marginLeft: 10,
  },
  post: {
    backgroundColor: '#222',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
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
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    color: '#fff',
    marginLeft: 5,
  },
  commentsSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  commentTextInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  commentUsername: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    color: '#fff',
  },
  commentTimestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
});