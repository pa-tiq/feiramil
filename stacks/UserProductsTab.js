import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from '../constants/styles';
import AddProduct from '../screens/AddProduct';
import UserProductsScreen from '../screens/UserProductsScreen';
import ProductDetails from '../screens/ProductDetails';
import CityPick from '../screens/CityPick';

const Stack = createNativeStackNavigator();

export default function UserProductsTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background },
      }}      
    >
      <Stack.Screen
        name='UserProductsScreen'
        component={UserProductsScreen}
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
        name='CityPick'
        component={CityPick}
        options={{ title: 'Selecione a cidade', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name='ProductDetails'
        component={ProductDetails}
        options={{ title: 'Carregando produto...', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}
