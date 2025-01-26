import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './tabs/SplashScreen';
import SignUp from './tabs/authentication/SignUp';
import LogIn from './tabs/authentication/LogIn';
import Index from './tabs';

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
          headerShown: false, // Hide the header
        }}
      />

      {/* Log In Screen */}
      <Stack.Screen
        name="LogIn"
        component={LogIn}
        options={{
          headerShown: false,
          headerBackTitle: 'Go Back', // Customize the back title
          headerBackTitleStyle: { fontSize: 20 }, // Customize the back button text style
        }}
      />

      {/* Sign Up Screen */}
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false, // Hide the header
        }}
      />

      {/* Main Index Screen */}
      <Stack.Screen
        name="index"
        component={Index}
        options={{
          headerShown: false, // Hide the header
        }}
      />
    </Stack.Navigator>
  );
}
