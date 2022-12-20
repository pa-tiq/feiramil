import { useNavigation } from '@react-navigation/native';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { View, StyleSheet, Text, FlatList, RefreshControl } from 'react-native';
import { ProductContext } from '../../store/product-context';
import LoadingOverlay from '../ui/LoadingOverlay';
import ProductItem from './ProductItem';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProductsList = ({ products, isLoading }) => {
  const [productList, setProductList] = useState([]);
  const navigation = useNavigation();
  function selectProductHandler(id) {
    navigation.navigate('ProductDetails', {
      productId: id,
    });
  }
  const productContext = useContext(ProductContext);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    productContext.triggerReload();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useLayoutEffect(() => {
    setProductList(products);
  }, [products]);

  if (isLoading || refreshing) {
    return <LoadingOverlay />;
  }

  if (!productList || productList.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <Text style={styles.fallbackText}>Nenhum produto!</Text>
      </View>
    );
  }
  return (
    <FlatList
      style={styles.list}
      data={productList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductItem
          product={item}
          onSelect={selectProductHandler}
          isLoading={isLoading}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default ProductsList;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
