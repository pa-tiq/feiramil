import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { Colors } from '../../constants/styles';
import ProductImagePicker from '../Device/ProductImagePicker';
import Button from '../ui/Button';

const ProductForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [enteredPrice, setEnteredPrice] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  
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
  };

  function saveProductHandler() {
    const productData = {
      title:enteredTitle,
      price: enteredPrice,
      description: enteredDescription,
      image: selectedImage
    }
    props.onCreateProduct(productData);
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
          style={[styles.input, {textAlignVertical:'top'}]}
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
      <ProductImagePicker imagePicked={imageTakenHandler} />
      <View style={styles.buttonContainer}>
        <Button onPress={saveProductHandler}>Adicionar Produto</Button>
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
    marginBottom: 14
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
