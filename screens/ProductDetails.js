import { useContext, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import ErrorOverlay from '../components/ui/ErrorOverlay';
import IconButton from '../components/ui/IconButton';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Colors } from '../constants/styles';
import { URLs } from '../constants/URLs';
import { ProductContext } from '../store/product-context';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import useFileSystem from '../hooks/use-FileSystem';
import { UserContext } from '../store/user-context';

const ProductDetails = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState();
  const [downloadedUserImageURI, setDowloadedUserImageURI] = useState(null);
  const [downloadedProductImageURI, setDowloadedProductImageURI] =
    useState(null);
  const productContext = useContext(ProductContext);
  let selectedProductId = route.params.productId;
  const userContext = useContext(UserContext);
  const fileSystemObj = useFileSystem();

  const setProductId = () => {
    selectedProductId = route.params.productId;
  };

  useLayoutEffect(() => {
    async function loadPlaceData() {
      try {
        const product = await productContext.fetchProductDetail(
          selectedProductId
        );
        setFetchedProduct(product);
        navigation.setOptions({
          title: product.title,
        });
        const currentUser = await userContext.fetchUser();
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
        if (product.userPhoto) {
          const userProfilePicturePath = URLs.base_url + product.userPhoto;
          const fileName = product.userPhoto.split('/')[2];
          const fileInfo = await FileSystem.getInfoAsync(
            FileSystem.documentDirectory + fileName
          );
          if (fileInfo.exists) {
            setDowloadedUserImageURI(fileInfo.uri);
          } else {
            const createTask = (uri) => {
              setDowloadedUserImageURI(uri);
            };
            fileSystemObj.downloadImage(
              userProfilePicturePath,
              fileName,
              createTask
            );
          }
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
    loadPlaceData();
  }, [selectedProductId]);

  const mySQLTimeStampToDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    return `${day}/${month}/${year}`;
  };

  const removePlaceHandler = async () => {};

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
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  rootComponent: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  productImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    marginBottom: 15,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary200,
    overflow: 'hidden',
  },  
  image: {
    width: '100%',
    height: '100%',
    marginVertical: 8,
  },
  descriptionContainer: {
    padding: 20,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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
