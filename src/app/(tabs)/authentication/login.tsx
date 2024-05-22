import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <View style = {styles.loginContainer}>
      <Text style={styles.login}>{isSignIn ? 'Sign In' : 'Sign Up'}</Text>

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

      {/* Add additional fields (email, password) similarly */}
    </View>
  );
};

const styles = StyleSheet.create({
    login: {
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
      loginContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: Colors.white
      }

});

export default Login;
