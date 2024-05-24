import React from 'react';
import { View, Image, StyleSheet, Text, Touchable, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';



const SplashScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      {/* <Image style = {styles.splashWave} source={require('@/assets/images/Wave.png')}/> */}
      <Image style={styles.splashLogo} source={require("@/assets/images/TaskBuddyLogo.png")} />
      <View style={styles.textContainer}>
        <Text style={styles.splashSubtitle}>Your ultimate companion for staying organized, productive, and connected with friends.</Text>
      </View>
      <View>
        <TouchableOpacity onPress={(()=> navigation.navigate('LogIn' as never))}>
            <Text style={styles.splashSignIn}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
            <Text style={styles.splashSignUp}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {/* <Image style = {styles.splashCircleBlue} source={require('@/assets/images/circles/blueCircle.png')}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  splashLogo: {
    height: 200,
    width: 300,
    marginTop: 100
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  splashSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color:'grey'
  },
  splashButtons:{
    fontSize: 16,
  },
  splashSignIn:{
    fontSize:16,
    padding:20,
    paddingLeft:80,
    paddingRight:80,
    backgroundColor:'#66b3ff',
    borderRadius: 50,
    marginTop: 20,
    color:'white'
  },
  splashSignUp:{
    borderWidth:1,
    borderColor:'#66b3ff',
    fontSize:16,
    padding:20,
    paddingLeft:80,
    paddingRight:80,
    marginTop: 20,
    color:'#66b3ff'
  },
  splashCircleBlue:{
    height:300,
    width:300,
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  splashWave:{
    width:450,
    height: undefined,
    aspectRatio: 3,
    zIndex: -1
  }
});

export default SplashScreen;
