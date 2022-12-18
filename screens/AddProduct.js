import { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import ProductForm from '../components/Products/ProductForm';
import { ProductContext } from '../store/product-context';

const AddProduct = ({ navigation }) => {
  const productContext = useContext(ProductContext);

  async function createProductHandler(product) {
    const insertedProduct = await productContext.addProduct(product);
    console.log(insertedProduct);
    //  sendPushNotification(insertedPlace);
    navigation.navigate('UserProductsTab');
  }

  return <ProductForm onCreateProduct={createProductHandler} />;
};

export default AddProduct;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
