import { useContext, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
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

  async function editProductHandler(product, newImagesChosen, imagesToDelete) {
    try {
      const updateResult = await productContext.updateProduct(product);
      const savedProduct = productContext.userProducts.find((prod) => {
        return prod.id === product.id;
      });
      if (
        newImagesChosen.find((item) => {
          return item === true;
        })
      ) {
        const imagesToUpdate = [];
        product.images.forEach((image, idx) => {
          if (newImagesChosen[idx] === true) {
            imagesToUpdate.push(image);
          }
          if(idx > (newImagesChosen.length - 1)){
            imagesToUpload.push(image);
          }
        });
        if (imagesToUpdate.length > 0){
          const imagePathArr = await uploadImageArr(imagesToUpdate);
          const imagePathsToDelete = [];
          savedProduct.imagePaths.forEach((image, idx) => {
            if (newImagesChosen[idx] === true) {
              imagePathsToDelete.push(image);
            }
          });
          const response = await productContext.updateProductImagePaths({
            paths: imagePathArr,
            oldpaths: imagePathsToDelete,
            productId: `${product.id}`,
          });
        }
      }
      if(imagesToDelete.length > 0){
        const imagePathsToDelete = [];
        savedProduct.imagePaths.forEach((image, idx) => {
          if (imagesToDelete[idx] === true) {
            imagePathsToDelete.push(image);
          }
        });
        await productContext.removeProductImagePaths({
          paths: imagePathsToDelete,
          productId: `${product.id}`
        });
      }
      if (product.images.length > newImagesChosen.length){
        const imagesToUpload = [];
        product.images.forEach((image, idx) => {
          if(idx > (newImagesChosen.length - 1)){
            imagesToUpload.push(image);
          }
        });
        if (imagesToUpload.length > 0){
          const imagePathArr = await uploadImageArr(imagesToUpload);
          const response = await productContext.addProductImagePaths({
            paths: imagePathArr,
            productId: `${product.id}`,
          });
        }
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
