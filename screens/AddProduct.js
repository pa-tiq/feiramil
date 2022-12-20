import { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import ProductForm from '../components/Products/ProductForm';
import { URLs } from '../constants/URLs';
import { ProductContext } from '../store/product-context';
import * as FileSystem from 'expo-file-system';
import { AuthContext } from '../store/auth-context';

const AddProduct = ({ navigation }) => {
  const productContext = useContext(ProductContext);
  const authContext = useContext(AuthContext);

  async function createProductHandler(product) {
    try {
      const insertedProductId = await productContext.addProduct(product);
      const uploadResult = await FileSystem.uploadAsync(
        URLs.add_product_image_url,
        product.image.uri,
        {
          fieldName: 'productphoto',
          httpMethod: 'PATCH',
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          headers: {
            Authorization: 'Bearer ' + authContext.token,
          },
        }
      );
      const result = JSON.parse(uploadResult.body);
      const response = await productContext.addProductImagePath({
        path: result.path.substring(1, result.path.length),
        productId: insertedProductId
      });      
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('UserProductsScreen',{ triggerReload: true });
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
