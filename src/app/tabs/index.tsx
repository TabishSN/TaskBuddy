import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Avatar } from '@kolking/react-native-avatar';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

interface IndexScreenRouteParams {
  username: string;
}

const MyStack = createNativeStackNavigator();

type IndexScreenRouteProp = RouteProp<{ Index: IndexScreenRouteParams }, 'Index'>;

const Index = () => {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const route = useRoute<IndexScreenRouteProp>();
  const { username } = route.params;

  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const res = await axios.post('http://192.168.1.19:5000/chat', { message: userInput });
      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.titleContainer}>
          <Avatar 
            style={styles.avatarContainer}
            size={45}
            name={username.substring(1)}
            colorize={true}
            radius={20}
            badgeColor={getRandomColor()}
          />
        </View>
      </View>
      
      <View style={styles.textBoxContainer}>
        <TextInput
          style={styles.textBox}
          placeholder="Can't find what you're looking for? Ask AI!"
          placeholderTextColor={Colors.light}
          value={userInput}
          onChangeText={setUserInput}
        />
        <Button title="Send" onPress={handleSend} />
      </View>

      {response ? <Text style={styles.responseText}>{response}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    borderRadius: 70,
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    color: 'white',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 16,
  },
  textBoxContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#333',
  },
  textBox: {
    height: 40,
    borderColor: Colors.light,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: Colors.white,
    backgroundColor: '#444',
  },
  responseText: {
    marginTop: 20,
    color: Colors.white,
  },
});

export default Index;
