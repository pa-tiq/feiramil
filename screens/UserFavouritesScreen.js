import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { ProductContext } from '../store/product-context';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const UserFavouritesScreen = ({ route, navigation }) => {
  const productContext = useContext(ProductContext);
  const { userFavourites, products } = productContext;
  const { params: routeParams } = route;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    productContext.triggerReload();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (routeParams && routeParams.triggerReload) {
      onRefresh();
      routeParams.triggerReload = null;
    }
  }, [routeParams]);

  useEffect(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  if (refreshing || productContext.isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <ProductsList
        products={products.filter((product) => 
          userFavourites.includes(product.id)
        )}
        isLoading={productContext.isLoading}
      />
    </>
  );
};

export default UserFavouritesScreen;

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
