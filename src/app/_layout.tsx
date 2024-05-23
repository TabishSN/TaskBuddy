import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from './tabs/SplashScreen';
import SignUp from './tabs/authentication/SignUp';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name='SplashScreen' component={SplashScreen}/>
        <Stack.Screen name='SignUp' component={SignUp}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
