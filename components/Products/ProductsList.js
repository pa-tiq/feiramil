import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { findOrDownloadImage } from '../../util/findOrDownloadFile';

const ProductsList = ({ products }) => {
  const [productList, setProductList] = useState([]);
  const navigation = useNavigation();
  function selectProductHandler(id) {
    navigation.navigate('ProductDetails', {
      productId: id,
    });
  }

  useLayoutEffect(() => {
    async function getFile(product) {
      try {
        let uri;
        uri = await findOrDownloadImage(product.imagePath);
        product.imageUri = uri;
      } catch (error) {
        console.log(error);
      }
    }
    let prod = [];
    if (!products || products.length === 0) return;
    products.forEach((product) => {
      if (!product.imagePath) {
        product.imageUri = null;
      } else {
        getFile(product);
      }
      prod.push(product);
    });
    setProductList(prod);
  }, [products]);

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
      data={productList}
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
