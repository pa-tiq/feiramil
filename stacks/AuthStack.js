import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants/styles';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background },
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
      <Stack.Screen
        name='ForgotPassword'
        component={ForgotPasswordScreen}
        options={{ title: '', }}
      />      
    </Stack.Navigator>
  );
}
