import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { faEnvelope, faEye, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import axios from 'axios';
import { useNavigation } from 'expo-router';

const SignUp = () => {
  const [username, setUsername] = useState('@');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const navigation = useNavigation();
  const handleUsernameChange = (text: string) => {
    if(text.startsWith('@')){
      setUsername(text);
    } else {
      setUsername('@' + text);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post<{ success: boolean; message: string }>(
        'http://204.236.195.55:8000/register',
        {
          email,
          username,
          password,
        }
      );
      console.log(response.data); // Handle successful response
      if (response.data.success) {
        Alert.alert('Success', 'User registered successfully');
        // Additional actions after successful registration
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data); // Handle error response
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={styles.signinContainer}>
      <Text style={styles.signinTitle}>Let's get {'\n'}started</Text>
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
        <FontAwesomeIcon icon={faEnvelope} size={20} color='grey' />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType='email-address'
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
        <TouchableOpacity onPress={()=>{setSecureEntry((prev)=> !prev)}}>
          <FontAwesomeIcon icon={faEye} size={20} color='grey' />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signinTitle:{
    fontSize:40,
    alignSelf:'flex-start',
    paddingLeft:40,
    padding:30,
    fontWeight:'bold'
  },
  signinContainer:{
    flex: 1,
    alignItems: 'center',
    paddingTop:50,
    backgroundColor: Colors.white
  },
  inputContainer: {
    padding:10,
    height:50,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingLeft: 10,
    width:'80%',
    borderRadius:20,
    flexDirection: 'row',
    alignItems:'center'
  },
  input:{
    flex:1,
    paddingHorizontal:10,
    fontSize:16
  },
  buttonContainer:{
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding:10,
    paddingRight:40,
    paddingLeft:40,
  },
  buttonText:{
    color:'white',
    fontSize:18
  },
});

export default SignUp;
