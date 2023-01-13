import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants/styles';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary700 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary700 },
      }}
    >
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ title: '', }}
      />
      <Stack.Screen
        name='Signup'
        component={SignupScreen}
        options={{ title: '', }}
      />      
    </Stack.Navigator>
  );
}
