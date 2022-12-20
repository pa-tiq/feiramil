import { useCallback, useLayoutEffect, useState } from 'react';
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
import LoadingOverlay from '../ui/LoadingOverlay';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProductForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [enteredPrice, setEnteredPrice] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(props.editingProduct);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useLayoutEffect(() => {
    if (!editingProduct) return;
    setEnteredTitle(editingProduct.title);
    setEnteredDescription(editingProduct.description);
    setEnteredPrice(`${editingProduct.price}`);
    setSelectedImage(editingProduct.imageUri);
    onRefresh();
  }, [editingProduct]);

  const changeTitleHandler = (enteredText) => {
    setEnteredTitle(enteredText);
  };
  const changeDescriptionHandler = (enteredText) => {
    setEnteredDescription(enteredText);
  };
  const changePriceHandler = (enteredText) => {
    setEnteredPrice(enteredText);
  };

  function imageTakenHandler(imageUri) {
    setSelectedImage(imageUri);
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
    } else if (!editingProduct && !selectedImage) {
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
      image: selectedImage,
    };

    if (editingProduct) {
      if (
        productData.title === props.editingProduct.title &&
        productData.price === `${props.editingProduct.price}` &&
        productData.description === props.editingProduct.description &&
        productData.image === props.editingProduct.imageUri
      )
      {
        Alert.alert(
          'Nenhuma alteração',
          'Você não editou nada!'
        );
        return;
      }
      productData.id = editingProduct.id;
      const newImageChosen = productData.image !== props.editingProduct.imageUri;
      props.onEditProduct(productData, newImageChosen);
    } else {
      props.onCreateProduct(productData);
    }
  }

  if (refreshing) {
    return <LoadingOverlay />;
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
        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={[styles.input]}
          onChangeText={changePriceHandler}
          value={enteredPrice}
          keyboardType={'number-pad'}
        />
      </View>
      <ProductImagePicker
        imagePicked={imageTakenHandler}
        editingProductImageUri={selectedImage}
      />
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
});
