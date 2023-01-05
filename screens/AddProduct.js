import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import ProductForm from '../components/Products/ProductForm';
import { ProductContext } from '../store/product-context';
import { AuthContext } from '../store/auth-context';
import { uploadProductImage } from '../util/findOrDownloadFile';

const AddProduct = ({ route, navigation }) => {
  const productContext = useContext(ProductContext);
  const authContext = useContext(AuthContext);
  const [editingProduct, setEditingProduct] = useState(route.params?.editingProduct);
  console.log(route.params);

  useLayoutEffect(()=>{
    if(!editingProduct) return;
    navigation.setOptions({
      title: `Editando ${editingProduct.title}`,
    });
  },[editingProduct]);

  async function uploadImage(imageUri){
    const result = await uploadProductImage(imageUri, authContext.token);
    return result;
  }

  async function createProductHandler(product) {
    try {
      const insertedProductId = await productContext.addProduct(product);
      const result = await uploadImage(product.image);
      const response = await productContext.addProductImagePath({
        path: result.path.substring(1, result.path.length),
        productId: insertedProductId,
      });
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('UserProductsScreen', { triggerUserProductsReload: true });
  }  

  async function editProductHandler(product, newImageChosen) {
    try {
      const updateResult = await productContext.updateProduct(product);
      if(newImageChosen){
        const imageUploadResult = await uploadImage(product.image);
        const response = await productContext.updateProductImagePath({
          path: imageUploadResult.path.substring(1, imageUploadResult.path.length),
          oldpath: editingProduct.imagePath,
          productId: `${product.id}`,
        });        
      }
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('UserProductsScreen', { triggerUserProductsReload: true });
  }

  return (
    <ProductForm
      onCreateProduct={createProductHandler}
      onEditProduct={editProductHandler}
      editingProduct={editingProduct}
      selectedCity={route.params ? route.params.city : null}
      selectedState={route.params ? route.params.state : null}
    />
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
