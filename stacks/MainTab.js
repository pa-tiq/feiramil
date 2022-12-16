import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductsScreen from '../screens/ProductsScreen';
import { Colors } from '../constants/styles';
import IconButton from '../components/ui/IconButton';
import AddProduct from '../screens/AddProduct';

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
        options={({ navigation }) => ({
          headerRight: ({ tintColor }) => (
            <IconButton
              icon='add'
              color={tintColor}
              size={24}
              onPress={() => navigation.navigate('AddProduct')}
            />
          ),
          title: 'Produtos'
        })}
      />
      <Stack.Screen
        name='AddProduct'
        component={AddProduct}
        options={{ title: 'Adicione um produto', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}
