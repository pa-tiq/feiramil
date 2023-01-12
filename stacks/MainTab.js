import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductsScreen from '../screens/ProductsScreen';
import { Colors } from '../constants/styles';
import ProductDetails from '../screens/ProductDetails';
import FiltersScreen from '../screens/FiltersScreen';
import CityPick from '../screens/CityPick';

const Stack = createNativeStackNavigator();

export default function MainTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background },
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
        name='ProductDetails'
        component={ProductDetails}
        options={{ title: 'Carregando produto...', headerTitleAlign: 'center' }}
      />      
      <Stack.Screen
        name='FiltersScreen'
        component={FiltersScreen}
        options={{ title: 'Filtros', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name='FiltersCityPick'
        component={CityPick}
        options={{ title: 'Selecione a cidade', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}
