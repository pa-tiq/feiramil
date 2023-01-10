import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import ProductForm from '../components/Products/ProductForm';
import { ProductContext } from '../store/product-context';
import { AuthContext } from '../store/auth-context';
import { uploadProductImages } from '../util/findOrDownloadFile';

const AddProduct = ({ route, navigation }) => {
  const productContext = useContext(ProductContext);
  const authContext = useContext(AuthContext);
  let editingProduct = route.params ? route.params.editingProduct : null;

  useLayoutEffect(() => {
    if (!editingProduct) return;
    navigation.setOptions({
      title: `Editando ${editingProduct.title}`,
    });
  }, [editingProduct]);

  async function uploadImageArr(imageUriArr) {
    const result = await uploadProductImages(imageUriArr, authContext.token);
    return result;
  }

  async function createProductHandler(product) {
    try {
      const insertedProductId = await productContext.addProduct(product);
      const imagePathArr = await uploadImageArr(product.images);
      console.log(imagePathArr);
      const response = await productContext.addProductImagePaths({
        paths: imagePathArr,
        productId: insertedProductId,
      });
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('UserProductsScreen', {
      triggerUserProductsReload: true,
    });
  }

  async function editProductHandler(product, newImageChosen) {
    try {
      const updateResult = await productContext.updateProduct(product);
      if (newImageChosen) {
        const imageUploadResult = await uploadImage(product.image);
        const response = await productContext.updateProductImagePath({
          path: imageUploadResult.path.substring(
            1,
            imageUploadResult.path.length
          ),
          oldpath: editingProduct.imagePath,
          productId: `${product.id}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('UserProductsScreen', {
      triggerUserProductsReload: true,
    });
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
