import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import FloatingButton from '../components/ui/FloatingButton';
import { ProductContext } from '../store/product-context';

const UserProductsScreen = ({navigation}) => {
  const productContext = useContext(ProductContext);
  const { userProducts } = productContext;

  return (
    <>
      <ProductsList
        products={userProducts}
        isLoading={productContext.isLoading}
      />
      <FloatingButton
        icon={'add'}
        color={'white'}
        size={24}
        onPress={() => navigation.navigate('AddProduct')}
      />
    </>
  );
};

export default UserProductsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
