import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './SplashScreen';
import SignUp from './authentication/SignUp';
import LogIn from './authentication/LogIn';
import TabLayout from './_layout';

// Create the stack navigator
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator>
      {/* Splash Screen */}
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Log In Screen */}
      <Stack.Screen
        name="LogIn"
        component={LogIn}
        options={{
          headerShown: false,
          headerBackTitle: 'Go Back',
          headerBackTitleStyle: { fontSize: 20 },
        }}
      />

      {/* Sign Up Screen */}
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />

      {/* Main Tab Navigation */}
      <Stack.Screen
        name="(tabs)"
        component={TabLayout}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}