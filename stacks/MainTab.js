import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductsScreen from '../screens/ProductsScreen';
import { Colors } from '../constants/styles';

const Stack = createNativeStackNavigator();

export default function MainTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary700 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary700 },
      }}
    >
      <Stack.Screen name='Poducts' component={ProductsScreen} />
    </Stack.Navigator>
  );
}
