import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SignUp = () => {
  const [username, setUsername] = useState('@');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  const handleUsernameChange = (text: string) => {
    // Ensure username is always lowercase and has '@' symbol
    setUsername('@' + text.toLowerCase());
  };

  return (
    <View style = {styles.signinContainer}>
      <Text style={styles.signin}>{isSignIn ? 'Sign In' : 'Sign Up'}</Text>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="@Username"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />
      <View style={styles.buttonContainer}>
        <Button title={isSignIn ? 'Sign In' : 'Sign Up'}></Button>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
    signin: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingLeft: 10,
        width:'80%',
        color: 'black',
      },
      signinContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: Colors.white
      },
      buttonContainer:{
        backgroundColor: '#007bff',
        borderRadius: 5
      }

});

export default SignUp;
