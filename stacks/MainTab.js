import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductsScreen from '../screens/ProductsScreen';
import { Colors } from '../constants/styles';
import IconButton from '../components/ui/IconButton';
import AddProduct from '../screens/AddProduct';
import ProductDetails from '../screens/ProductDetails';

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
      <Stack.Screen
        name='PoductsScreen'
        component={ProductsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='AddProduct'
        component={AddProduct}
        options={{ title: 'Adicione um produto', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name='ProductDetails'
        component={ProductDetails}
        options={{ title: 'Carregando produto...', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}
