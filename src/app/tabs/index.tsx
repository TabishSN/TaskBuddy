import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios'; // Don't need to import AxiosResponse separately
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Avatar } from '@kolking/react-native-avatar';
import SearchBar from '@/src/components/searchbar';

// Define route params for username
interface IndexScreenRouteParams {
  username: string;
}

type IndexScreenRouteProp = RouteProp<{ Index: IndexScreenRouteParams }, 'Index'>;

// Define the expected response structure
interface ChatResponse {
  response: string;
}

const Index = () => {
  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFAA33', '#33D4FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const route = useRoute<IndexScreenRouteProp>();
  const { username } = route.params;

  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false); // To show a loading indicator

  const handleSend = async () => {
    if (userInput.trim() === '') return; // Ensure input isn't empty
    setLoading(true);
    try {
      // Directly use AxiosResponse as a generic here
      const res = await axios.post<ChatResponse>('http://192.168.1.19:5000/chat', { message: userInput });
      setResponse(res.data.response); // Now TypeScript knows res.data is of type ChatResponse
      setUserInput(''); // Clear input field
    } catch (error) {
      console.error(error);
      setResponse('Error getting response. Try again!');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <View style={styles.container}>
      {/* Top container with avatar */}
      <View style={styles.topContainer}>
        <View style={styles.titleContainer}>
          <Avatar
            style={styles.avatarContainer}
            size={60} // Adjust size if needed
            name={username.substring(0, 1)} // Use first letter of username
            colorize={true}
            radius={30} // Control radius for roundness
            badgeColor={getRandomColor()} // Set random badge color
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <SearchBar />
      </View>

      {/* Textbox input for user */}
      <View style={styles.textBoxContainer}>
        <TextInput
          style={styles.textBox}
          placeholder="Ask your question..."
          placeholderTextColor={Colors.light}
          value={userInput}
          onChangeText={setUserInput}
        />
        <Button title="Send" onPress={handleSend} />
      </View>

      {/* Loading indicator */}
      {loading && <ActivityIndicator size="large" color="#00ff00" style={styles.loading} />}

      {/* Display response */}
      {response ? <Text style={styles.responseText}>{response}</Text> : null}
    </View>
  );
};

// Stylesheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 16,
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 60,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  textBoxContainer: {
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 20,
  },
  textBox: {
    height: 50,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#444',
  },
  loading: {
    marginTop: 20,
  },
  responseText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
});

export default Index;
