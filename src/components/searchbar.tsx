// SearchBar.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// Define the structure of a search result
interface User {
  id: number;        // Assuming 'id' is of type number
  username: string;  // Assuming 'username' is a string
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<User[]>([]); // Use the User interface
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // Prevent empty searches
    setLoading(true);
    try {
      const response = await axios.get<User[]>(`http://192.168.1.19:8000/search?q=${searchTerm}`); // Specify response type
      setResults(response.data); // Set the response data
    } catch (error) {
      console.error('Error searching for users:', error);
      setResults([]); // Reset results on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Users..."
        placeholderTextColor={Colors.light}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch} // Search on pressing enter
      />
      <Button title="Search" onPress={handleSearch} />
      
      {loading ? (
        <ActivityIndicator size="small" color="#00ff00" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()} // Assuming each user has a unique ID
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem}>
              <Text style={styles.resultText}>{item.username}</Text>
            </TouchableOpacity>
          )}
          style={styles.resultsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.black,
  },
  input: {
    height: 40,
    borderColor: Colors.light,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: Colors.white,
    backgroundColor: '#444',
    marginBottom: 10,
  },
  resultsList: {
    marginTop: 10,
  },
  resultItem: {
    padding: 10,
    backgroundColor: '#555',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  resultText: {
    color: Colors.white,
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default SearchBar;
