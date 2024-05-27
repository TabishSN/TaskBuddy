import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { faArrowLeft, faEnvelope, faEye, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import GoogleSignIn from '@/src/components/socials/GoogleSignInButton';

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
        Alert.alert('Success', 'User registered successfully', [
          { text: 'OK', onPress: () => navigation.navigate('LogIn' as never) }
        ]);
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
      <TouchableOpacity style={styles.backArrow}  onPress={navigation.goBack} >
        <FontAwesomeIcon icon={faArrowLeft} size={25}/>
      </TouchableOpacity>
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
      <View style={styles.loginContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LogIn' as never)}>
          <Text style={styles.linkText}>Login here</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.authContainer}>
        <View style={styles.line} />
        <View>
          <Text style={styles.authText}>Or Register with</Text>
        </View>
        <View style={styles.line} />
      </View> */}


    </View>
  );
};



const styles = StyleSheet.create({
  signinTitle:{
    fontSize:40,
    alignSelf:'flex-start',
    padding:30,
    fontWeight:'bold',
    marginTop:30
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
    borderRadius:10,
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
    padding:5,
    width:'90%',
    alignItems:'center'
  },
  buttonText:{
    color:'white',
    fontSize:18,

  },
  backArrow:{
    alignSelf:'flex-start',
    marginLeft:20,
    backgroundColor:'#EDEDED',
    padding:10,
    borderRadius:50
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SignUp;
