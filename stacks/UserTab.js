import { useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../store/auth-context';
import { Colors } from '../constants/styles';
import IconButton from '../components/ui/IconButton';
import UserScreen from '../screens/UserScreen';

const Stack = createNativeStackNavigator();

export default function UserTab() {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const userScreen = (
    <Stack.Screen
      name='User'
      component={UserScreen}
      options={{
        headerRight: ({ tintColor }) => (
          <IconButton
            icon='exit-outline'
            color={tintColor}
            size={24}
            onPress={authContext.logout}
          />
        ),
      }}
    />
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary700 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary700 },
      }}
    >
      {userScreen}
    </Stack.Navigator>
  );
}
