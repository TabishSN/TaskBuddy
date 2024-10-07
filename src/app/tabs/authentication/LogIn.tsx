import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faEye, faUser, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LogIn = () => {
  const [username, setUsername] = useState('@');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const navigation = useNavigation();

  const handleUsernameChange = (text: string) => {
    if (text.startsWith('@')) {
      setUsername(text);
    } else {
      setUsername('@' + text);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post<{ success: boolean; message: string }>(
        'http://204.236.195.55:8000/login',
        {
          username,
          password,
        } 
      );
      console.log(response.data); // Handle successful response
      if (response.data.success) {
        Alert.alert('Success', 'Logged in Successfully');
        navigation.navigate('index' as never, {username} as never)
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data); // Handle error response
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('SplashScreen' as never)}>
        <FontAwesomeIcon icon={faArrowLeft} size={25} />
      </TouchableOpacity>
      <Text style={styles.signinTitle}>Welcome{'\n'}Back!</Text>
      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faUser} size={20} color='grey' />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={handleUsernameChange}
          placeholder="@Username"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faLock} size={20} color='grey' />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={secureEntry}
        />
        <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
          <FontAwesomeIcon icon={faEye} size={20} color='grey' />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpContainer}>
        <Text>Don't have an account yet? </Text>
        <TouchableOpacity style={styles.linkSignUpContainer} onPress={() => navigation.navigate('SignUp' as never)}>
          <Text style={styles.linkSignUp}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signinTitle: {
    fontSize: 40,
    alignSelf: 'flex-start',
    paddingLeft: 40,
    padding: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 10,
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color:"white"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: 'black',
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signUpContainer: {
    width: '90%', 
    alignItems: 'center',
  },
  linkSignUp: {
    color: 'white',
    fontSize: 16,
  },
  linkSignUpContainer: {
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#007bff',
    marginTop:15
  },
  backArrow: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    backgroundColor: '#EDEDED',
    padding: 10,
    borderRadius: 50,
  },
});

export default LogIn;
