import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from './tabs/SplashScreen';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <NavigationContainer independent={true} options={{ headerShown: false }}>
      <Stack.Navigator>
        <Stack.Screen name='tabs/SplashScreen' component={SplashScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
