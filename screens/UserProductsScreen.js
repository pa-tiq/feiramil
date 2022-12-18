import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import { AuthContext } from '../store/auth-context';
import { ProductContext } from '../store/product-context';

const UserProductsScreen = () => {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const isFocused = useIsFocused();
  const productContext = useContext(ProductContext);
  const authContext = useContext(AuthContext);
  const { userProducts } = productContext;
  
  useEffect(() => {
    async function loadUserProducts(){
      await productContext.fetchUserProducts(authContext.userId);
    }
    if (isFocused) {
      loadUserProducts();
    }
  }, [isFocused]);
  return <ProductsList products={userProducts} />;
};

export default UserProductsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
