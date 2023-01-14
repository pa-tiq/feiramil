import { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
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
import ImageViewer from '../components/Images/ImageViewer';
import { wait } from '../util/wait';
import { SwipeContext } from '../store/swipe-context';

const ProductDetails = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(null);
  const [fetchedProduct, setFetchedProduct] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [downloadedUserImageURI, setDowloadedUserImageURI] = useState(null);
  const productContext = useContext(ProductContext);
  let selectedProductId = route.params.productId;
  const userContext = useContext(UserContext);
  const swipeContext = useContext(SwipeContext);
  const [refreshingImage, setRefreshingImage] = useState(true);
  const onRefreshImage = useCallback(() => {
    wait(500).then(() => setRefreshingImage(false));
  }, []);

  const getNumbers = (input) => {
    input = input.replace(/\D/g, '');
    return input;
  };

  const setProductId = () => {
    selectedProductId = route.params.productId;
  };

  const removeProductHandler = async () => {
    productContext.removeProduct(selectedProductId);
    navigation.navigate('UserProductsScreen', {
      triggerUserProductsReload: true,
    });
  };

  const favouriteProductHandler = async () => {
    if (!favorite) {
      await productContext.addUserFavourite(selectedProductId);
    } else {
      await productContext.removeUserFavourite(selectedProductId);
    }
    setFavorite((previousValue) => !previousValue);
    //onRefresh();
  };

  const editProductHandler = async () => {
    setIsLoading(true);
    const product = await productContext.fetchProductDetail(selectedProductId);
    navigation.navigate('AddProduct', {
      editingProduct: {
        ...product,
      },
    });
    wait(300).then(() => setIsLoading(false));
  };

  useEffect(() => {
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
                onPress={removeProductHandler}
                style={styles.headerRightButton}
              />
            ),
          });
        } else {
          if (productContext.userFavourites.includes(route.params.productId)) {
            setFavorite(true);
          } else {
            setFavorite(false);
          }
        }
        async function getUserFile(path) {
          try {
            let uri;
            uri = await findOrDownloadImage(path);
            setDowloadedUserImageURI(uri);
          } catch (error) {
            console.log(error);
          }
        }
        if (product.userPhoto) {
          getUserFile(product.userPhoto);
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
    onRefreshImage();
  }, [selectedProductId]);

  useEffect(() => {
    if (favorite === null) return;
    if (favorite) {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon='heart'
            color={'red'}
            size={24}
            onPress={favouriteProductHandler}
            style={styles.headerRightButton}
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: ({ tintColor }) => (
          <IconButton
            icon='heart'
            color={tintColor}
            size={24}
            onPress={favouriteProductHandler}
            style={styles.headerRightButton}
          />
        ),
      });
    }
  }, [favorite]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!fetchedProduct && !isLoading) {
    return <ErrorOverlay reloadFunction={setProductId} />;
  }

  let imagesScrollView = (
    <View style={styles.iconContainer}>
      <Ionicons name={'images-outline'} color={'white'} size={30} />
    </View>
  );

  if (refreshingImage) {
    imagesScrollView = <LoadingOverlay style={{ height: 300 }} />;
  } else if (fetchedProduct.imageUris && fetchedProduct.imageUris.length > 0) {
    imagesScrollView = (
      <ScrollView
        horizontal={true}
        overScrollMode={'always'}
        //onTouchStart={swipeContext.disableSwipe}
        //onTouchEnd={swipeContext.enableSwipeDelay}
        //onScrollEndDrag={swipeContext.enableSwipe}
        style={fetchedProduct.imageUris.length === 1 && styles.singleImage}
      >
        {fetchedProduct.imageUris.map((imageUri, idx) => {
          return <ImageViewer key={idx} uri={imageUri} />;
        })}
      </ScrollView>
    );
  }

  let editButton;

  if (currentUser.id === fetchedProduct.userId) {
    editButton = (
      <Button icon='create-outline' onPress={editProductHandler}>
        Editar
      </Button>
    );
  }

  return (
    <ScrollView style={styles.rootComponent}>
      {imagesScrollView}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {fetchedProduct.description
            ? fetchedProduct.description
            : 'Sem descrição'}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {fetchedProduct.price ? `R$${fetchedProduct.price}` : 'Sem preço'}
        </Text>
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.price}>
          {`${fetchedProduct.city} - ${fetchedProduct.state}`}
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
          <Text
            onPress={() => {
              const phoneNumber = getNumbers(fetchedProduct.userPhone);
              if (
                phoneNumber &&
                (phoneNumber.length === 10 || phoneNumber.length === 11)
              ) {
                Linking.openURL(
                  `https://wa.me/55${phoneNumber}?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20seu%20produto%20${encodeURI(
                    fetchedProduct.title
                  )}`
                );
              }
            }}
            style={[styles.line, styles.normalText, styles.link]}
            selectable={true}
          >
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
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 24,
  },
  headerRightButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginRight: -20,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  descriptionContainer: {
    marginTop: 15,
    padding: 10,
  },
  priceContainer: {
    padding: 10,
  },
  locationContainer: {
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
  link: {
    textDecorationLine: 'underline',
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 15,
    color: 'white',
    flexDirection: 'row',
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 5,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary200,
    borderRadius: 4,
    overflow: 'hidden',
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
  singleImage: {
    alignSelf: 'center',
  },
});
