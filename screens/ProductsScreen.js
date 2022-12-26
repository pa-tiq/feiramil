import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ProductsList from '../components/Products/ProductsList';
import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import SearchBar from '../components/ui/SearchBar';
import { ProductContext } from '../store/product-context';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProductsScreen = ({ route, navigation }) => {
  const productContext = useContext(ProductContext);
  const { products } = productContext;
  const { params: routeParams } = route;
  const [searchText, setSearchText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    productContext.triggerFeedReload();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (routeParams && routeParams.triggerReload) {
      onRefresh();
      routeParams.trigger = null;
    }
  }, [routeParams]);

  useEffect(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const updateSearchValue = (enteredText) => {
    setSearchText(enteredText);
  };

  const updateFilters = (enteredFilters) => {
    console.log(enteredFilters);
  };

  const showFilterScreen = () => {
    setShowFilter(true);
  };

  if (refreshing) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <SearchBar
            placeholder={'Pesquisa'}
            onUpdateValue={updateSearchValue}
          />
        </View>
        <View style={styles.filterButton}>
          <Button
            icon={'filter'}
            style={styles.button}
            onPress={showFilterScreen}
          >
            Filtros
          </Button>
        </View>
      </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  searchBar: {
    flex: 3,
    marginRight: 5,
  },
  filterButton: {
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
  },
});
