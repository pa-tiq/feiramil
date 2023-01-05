import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import FloatingButton from '../components/ui/FloatingButton';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { ProductContext } from '../store/product-context';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const UserProductsScreen = ({ route, navigation }) => {
  const productContext = useContext(ProductContext);
  const { userProducts } = productContext;
  const { params: routeParams } = route;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    productContext.triggerUserProductsReload();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (routeParams && routeParams.triggerUserProductsReload) {
      onRefresh();
      routeParams.triggerUserProductsReload = null;
    }
  }, [routeParams]);

  useEffect(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  if (refreshing) {
    return <LoadingOverlay />;
  }

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
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
  titleContainer: {
    paddingHorizontal: 20,
  },
});
