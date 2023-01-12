import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/styles';
import ProductImagePicker from '../Device/ProductImagePicker';
import Button from '../ui/Button';
import IconTextButton from '../ui/IconTextButton';
import LoadingOverlay from '../ui/LoadingOverlay';
import { useNavigation } from '@react-navigation/native';
import { wait } from '../../util/wait';
import { ProductContext } from '../../store/product-context';

const ProductForm = (props) => {
  const navigation = useNavigation();
  const productContext = useContext(ProductContext);

  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [enteredPrice, setEnteredPrice] = useState('');
  const [enteredCity, setEnteredCity] = useState('');
  const [enteredState, setEnteredState] = useState('');
  const [imagesArray, setImagesArray] = useState([null]);

  const { editingProduct, selectedCity, selectedState } = props;

  const [refreshing, setRefreshing] = useState(false);
  const [refreshingImage, setRefreshingImage] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(300).then(() => setRefreshing(false));
  }, []);
  const onRefreshImage = useCallback(() => {
    setRefreshingImage(true);
    wait(300).then(() => setRefreshingImage(false));
  }, []);

  useLayoutEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    if (!editingProduct) return;
    if (enteredTitle.length === 0) setEnteredTitle(editingProduct.title);
    if (enteredDescription.length === 0)
      setEnteredDescription(editingProduct.description);
    setEnteredCity(selectedCity ? selectedCity : editingProduct.city);
    setEnteredState(selectedState ? selectedState : editingProduct.state);
    if (enteredPrice.length === 0)
      setEnteredPrice(`${editingProduct.price ? editingProduct.price : ''}`);
    setImagesArray(editingProduct.imageUris);
    onRefresh();
  }, [editingProduct, selectedCity, selectedState]);

  useEffect(() => {
    onRefreshImage();
  }, [imagesArray]);

  const changeTitleHandler = (enteredText) => {
    setEnteredTitle(enteredText);
  };
  const changeDescriptionHandler = (enteredText) => {
    setEnteredDescription(enteredText);
  };

  const changePriceHandler = (enteredText) => {
    setEnteredPrice(enteredText);
  };

  function imageTakenHandler(imageUri, idx) {
    let arr = imagesArray;
    arr[idx] = imageUri;
    setImagesArray(arr);
  }

  function saveProductHandler() {
    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0
    ) {
      Alert.alert(
        'Formulário incompleto',
        'Por favor, preencha os dados do produto.'
      );
      return;
    } else if (!editingProduct && imagesArray.length === 0) {
      Alert.alert(
        'Nenhuma imagem escolhida',
        'Por favor, escolha uma imagem para cadastrar o produto.'
      );
      return;
    }
    if (enteredPrice.trim().length > 0) {
      if (!parseFloat(enteredPrice) || parseFloat(enteredPrice) < 0) {
        Alert.alert(
          'Preço inválido',
          'Por favor, preencha o preço com um valor válido.'
        );
        return;
      }
    }

    const productData = {
      title: enteredTitle,
      price: enteredPrice,
      description: enteredDescription,
      city: props.selectedCity ? props.selectedCity : editingProduct.city,
      state: props.selectedState ? props.selectedState : editingProduct.state,
      images: imagesArray.filter((item)=> item!==null),
    };

    if (editingProduct) {
      const savedProduct = productContext.userProducts.find((product) => {
        return product.id === editingProduct.id;
      });
      let newImagesChosen = [];
      let imagesToDelete = [];
      savedProduct.imageUris.forEach((image, idx) => {
        if(productData.images[idx]){
          const imageAlreadyInProduct = productData.images.find((ima) => {
            return ima === image;
          });
          newImagesChosen.push(!imageAlreadyInProduct);
          imagesToDelete.push(false);
        } else {
          imagesToDelete.push(true);
        }
      });


      if (
        productData.title === props.editingProduct.title &&
        productData.price ===
          (props.editingProduct.price ? `${props.editingProduct.price}` : '') &&
        productData.description === props.editingProduct.description &&
        productData.city === props.editingProduct.city &&
        productData.state === props.editingProduct.state &&
        !newImagesChosen.find((value) => value === true) &&
        !imagesToDelete.find((value) => value === true) &&
        productData.images.length === newImagesChosen.length
      ) {
        Alert.alert('Nenhuma alteração', 'Você não editou nada!');
        return;
      }
      productData.id = editingProduct.id;

      props.onEditProduct(productData, newImagesChosen, imagesToDelete);
    } else {
      props.onCreateProduct(productData);
    }
  }

  const pickCityHandler = () => {
    navigation.navigate('CityPick', { parentScreen: 'AddProduct' });
  };

  const addImagePicker = () => {
    let arr = imagesArray;
    if (arr[arr.length - 1] !== null && arr.length < 6) {
      arr.push(null);
      setImagesArray(arr);
      onRefreshImage();
    }
  };  
  
  const removeImagePicker = (id) => {
    let arrSliced = imagesArray;
    if (imagesArray.length > 1) {
      arrSliced.splice(id,1);
      setImagesArray(arrSliced);
      onRefreshImage();
    }
  };

  if (refreshing) {
    return <LoadingOverlay />;
  }

  let cityView = (
    <View style={styles.cityButton}>
      <IconTextButton icon={'location-outline'} onPress={pickCityHandler} />
    </View>
  );

  if (props.selectedCity && props.selectedState) {
    cityView = (
      <View style={styles.cityButton}>
        <IconTextButton icon={'location-outline'} onPress={pickCityHandler}>
          {`${props.selectedCity} - ${props.selectedState}`}
        </IconTextButton>
      </View>
    );
  }
  if (enteredCity.length !== 0 && enteredState.length !== 0) {
    cityView = (
      <View style={styles.cityButton}>
        <IconTextButton icon={'location-outline'} onPress={pickCityHandler}>
          {`${enteredCity} - ${enteredState}`}
        </IconTextButton>
      </View>
    );
  }

  let imagesScrollView = (
    <ScrollView
      horizontal={true}
      alwaysBounceHorizontal={true}
      overScrollMode={'always'}
      nestedScrollEnabled={true}
    >
      {imagesArray.map((image, idx) => {
        return (
          <ProductImagePicker
            key={idx}
            idx={idx}
            deletableImage={idx!=0}
            deleteImage={removeImagePicker.bind(this,idx)}
            imagePicked={imageTakenHandler}
            editingProductImageUri={image}
          />
        );
      })}
      <Button
        icon={'add'}
        style={styles.addImageButton}
        onPress={addImagePicker}
      ></Button>
    </ScrollView>
  );

  if (refreshingImage) {
    imagesScrollView = <LoadingOverlay style={{ height: 250 }} />;
  }

  return (
    <ScrollView style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { textAlignVertical: 'top' }]}
          onChangeText={changeDescriptionHandler}
          value={enteredDescription}
          multiline={true}
          numberOfLines={6}
        />
        <View style={styles.inputRowContainer}>
          <View style={styles.price}>
            <Text style={styles.label}>Preço</Text>
            <TextInput
              style={[styles.input]}
              onChangeText={changePriceHandler}
              value={enteredPrice}
              keyboardType={'number-pad'}
            />
          </View>
          <View style={styles.city}>
            <Text style={styles.label}>Cidade</Text>
            {cityView}
          </View>
        </View>
      </View>
      {imagesScrollView}
      <View style={styles.buttonContainer}>
        <Button onPress={saveProductHandler}>
          {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProductForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  inputContainer: {
    paddingHorizontal: 5,
  },
  inputRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  price: {
    flex: 1,
    marginRight: 4,
  },
  city: {
    flex: 1,
    marginLeft: 4,
  },
  cityButton: {
    marginVertical: 6,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 14,
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary800,
    borderBottomWidth: 2,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  addImageButton: {
    marginHorizontal: 5,
    marginTop: 5,
  },
});
