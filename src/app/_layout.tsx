import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from './tabs/SplashScreen';
import SignUp from './tabs/authentication/SignUp';
import LogIn from './tabs/authentication/LogIn';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
         options={{
          headerShown:false
         }}
        name='SplashScreen' component={SplashScreen}/>
        <Stack.Screen
        options={{
          headerShown:false,
          headerBackTitle:'Go Back',
          headerBackTitleStyle: { fontSize: 20 }}}
        name='LogIn' 
        component={LogIn}
        />
        <Stack.Screen 
        options={{
        headerShown:false
        }}
        name='SignUp' 
        component={SignUp}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
