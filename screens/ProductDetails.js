import { useContext, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import ErrorOverlay from '../components/ui/ErrorOverlay';
import IconButton from '../components/ui/IconButton';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Colors } from '../constants/styles';
import { ProductContext } from '../store/product-context';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../store/user-context';
import Button from '../components/ui/Button';
import { findOrDownloadImage } from '../util/findOrDownloadFile';
import { mySQLTimeStampToDate } from '../util/mySQLTimeStampToDate';

const ProductDetails = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [downloadedUserImageURI, setDowloadedUserImageURI] = useState(null);
  const [downloadedProductImageURI, setDowloadedProductImageURI] =
    useState(null);
  const productContext = useContext(ProductContext);
  let selectedProductId = route.params.productId;
  const userContext = useContext(UserContext);

  const setProductId = () => {
    selectedProductId = route.params.productId;
  };

  const removePlaceHandler = async () => {
    productContext.removeProduct(selectedProductId);
    navigation.navigate('UserProductsScreen');
  };

  useLayoutEffect(() => {
    async function loadProductData() {
      try {
        const product = await productContext.fetchProductDetail(
          selectedProductId
        );
        setFetchedProduct(product);
        navigation.setOptions({
          title: product.title,
        });
        const currentUser = await userContext.fetchUser();
        setCurrentUser(currentUser);
        if (product.userId === currentUser.id) {
          navigation.setOptions({
            headerRight: ({ tintColor }) => (
              <IconButton
                icon='trash'
                color={tintColor}
                size={24}
                onPress={removePlaceHandler}
              />
            ),
          });
        }
        async function getUserFile(path){
          try {
            let uri;
            uri = await findOrDownloadImage(path);
            setDowloadedUserImageURI(uri);
          } catch (error) {
            console.log(error);
          }
        }        
        async function getProductFile(path){
          try {
            let uri;
            uri = await findOrDownloadImage(path);
            setDowloadedProductImageURI(uri);
          } catch (error) {
            console.log(error);
          }
        }
        if (product.userPhoto){
          getUserFile(product.userPhoto);
        }        
        if (product.imagePath){
          getProductFile(product.imagePath);
        }
      } catch (error) {
        navigation.setOptions({
          title: 'Erro ao buscar o produto.',
        });
        console.log(error);
      }
      setIsLoading(false);
    }
    setIsLoading(true);
    loadProductData();
  }, [selectedProductId]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!fetchedProduct && !isLoading) {
    return <ErrorOverlay reloadFunction={setProductId} />;
  }

  let imagePreview = (
    <Ionicons
      style={styles.icon}
      name={'images-outline'}
      color={'white'}
      size={30}
    />
  );

  if (downloadedProductImageURI) {
    imagePreview = (
      <Image
        style={styles.productImage}
        source={{ uri: downloadedProductImageURI }}
      />
    );
  }

  let editButton = ( <> </> );

  if (currentUser.id === fetchedProduct.userId) {
    editButton = (
      <Button icon='create-outline'>Editar</Button>
    );
  }

  return (
    <ScrollView style={styles.rootComponent}>
      <View style={styles.productImageContainer}>
        <View style={styles.productImage}>{imagePreview}</View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {fetchedProduct.description
            ? fetchedProduct.description
            : 'Sem descrição'}
        </Text>
      </View>      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {fetchedProduct.price
            ? `R$${fetchedProduct.price}`
            : 'Sem preço'}
        </Text>
      </View>
      <View style={styles.userData}>
        <View style={styles.userImageContainer}>
          <Image
            style={styles.userImage}
            source={{ uri: downloadedUserImageURI }}
          />
        </View>
        <View style={styles.userTextContainer}>
          <Text style={[styles.line, styles.normalText]}>
            {`Postado por `}
            <Text
              style={styles.specialText}
            >{`${fetchedProduct.userName}`}</Text>
            <Text style={styles.normalText}>{` em `}</Text>
            <Text style={styles.specialText}>{`${mySQLTimeStampToDate(
              fetchedProduct.created_at
            )}`}</Text>
            <Text style={styles.normalText}>{'.'}</Text>
          </Text>
          <Text style={[styles.line, styles.normalText]} selectable={true}>
            {'Telefone: '}
            <Text
              style={styles.specialText}
              selectable={true}
            >{`${fetchedProduct.userPhone}`}</Text>
          </Text>
          <Text style={[styles.line, styles.normalText]}>
            {'Organização Militar: '}
            <Text style={styles.specialText}>{`${fetchedProduct.userOm}`}</Text>
          </Text>
        </View>
      </View>
      {editButton}
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  rootComponent: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  productImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  productImage: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary200,
    overflow: 'hidden',
  },  
  image: {
    width: '100%',
    height: '100%',
    marginVertical: 0,
  },
  descriptionContainer: {
    marginTop: 15,
    padding: 10,
  },  
  priceContainer: {
    padding: 10,
    marginBottom: 10,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },  
  price: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  userData: {
    flexDirection: 'row',
    borderRadius: 6,
    marginVertical: 7,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 200,
    minHeight: 100,
  },
  userImageContainer: {
    margin: 10,
    marginLeft: 15,
    flex: 2,
  },
  userImage: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary200,
    borderRadius: 240,
    overflow: 'hidden',
  },
  userTextContainer: {
    flex: 4,
    marginLeft: 40,
    marginVertical: 10,
    padding: 5,
    justifyContent: 'center',
  },
  line: {
    paddingVertical: 1,
  },
  specialText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.primary50,
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 15,
    color: 'white',
    flexDirection: 'row',
  },
});
