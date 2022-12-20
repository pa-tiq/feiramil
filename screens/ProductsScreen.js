import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import FloatingButton from '../components/ui/FloatingButton';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { ProductContext } from '../store/product-context';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProductsScreen = ({route, navigation}) => {
  const productContext = useContext(ProductContext);
  const { products } = productContext;
  const { params:routeParams } = route;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    productContext.triggerFeedReload();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(()=>{
    if(routeParams && routeParams.triggerReload){
      onRefresh();
      routeParams.trigger = null;
    }
  },[routeParams]);

  useEffect(()=>{
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  },[]);

  if (refreshing) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <ProductsList
        products={products}
        isLoading={productContext.isLoading}
      />
    </>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
