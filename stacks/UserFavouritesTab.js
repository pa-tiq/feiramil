import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from '../constants/styles';
import UserFavouritesScreen from '../screens/UserFavouritesScreen.js';
import ProductDetails from '../screens/ProductDetails';

const Stack = createNativeStackNavigator();

export default function UserFavouritesTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name='UserFavouritesScreen'
        component={UserFavouritesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='ProductDetails'
        component={ProductDetails}
        options={{ title: 'Carregando produto...', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}
