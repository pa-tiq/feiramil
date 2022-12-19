import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import { ProductContext } from '../store/product-context';

const UserProductsScreen = () => {
  const productContext = useContext(ProductContext);
  const { userProducts } = productContext;

  return <ProductsList products={userProducts} isLoading={productContext.isLoading}/>;
};

export default UserProductsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
