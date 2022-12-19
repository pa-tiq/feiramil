import { useIsFocused, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { findOrDownloadImage } from '../../util/findOrDownloadFile';

const ProductsList = ({ products }) => {
  const [productList, setProductList] = useState(products);
  const navigation = useNavigation();
  function selectProductHandler(id) {
    navigation.navigate('ProductDetails', {
      productId: id,
    });
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <Text style={styles.fallbackText}>Nenhum produto!</Text>
      </View>
    );
  }
  return (
    <FlatList
      style={styles.list}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductItem product={item} onSelect={selectProductHandler} />
      )}
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
