import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import FloatingButton from '../components/ui/FloatingButton';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import SearchBar from '../components/ui/SearchBar';
import { ProductContext } from '../store/product-context';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProductsScreen = ({route, navigation}) => {
  const productContext = useContext(ProductContext);
  const { products } = productContext;
  const { params:routeParams } = route;
  const [searchText, setSearchText] = useState('');

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

  const updateSearchValue = (enteredText) => {
    setSearchText(enteredText);
  }

  if (refreshing) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <SearchBar
        placeholder={'Pesquisa'}
        onUpdateValue={updateSearchValue}
      />
      <ProductsList
        products={products}
        searchText={searchText}
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
