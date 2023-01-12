import { useContext } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../store/auth-context';
import { Colors } from '../constants/styles';
import IconButton from '../components/ui/IconButton';
import UserScreen from '../screens/UserScreen';
import CityPick from '../screens/CityPick';

const Stack = createNativeStackNavigator();

export default function UserTab() {
  const authContext = useContext(AuthContext);

  const userScreen = (
    <Stack.Screen
      name='User'
      component={UserScreen}
      options={{
        headerShown: false,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon='exit-outline'
            color={tintColor}
            size={24}
            onPress={authContext.logout}
          />
        ),
        title: 'Usuário'
      }}
    />
    
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      {userScreen}
      <Stack.Screen
        name='UserCityPick'
        component={CityPick}
        options={{ title: 'Selecione a cidade', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}
