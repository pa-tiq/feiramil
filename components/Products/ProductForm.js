import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { Colors } from '../../constants/styles';
import ProductImagePicker from '../Device/ProductImagePicker';
import Button from '../ui/Button';

const ProductForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [pickedLocation, setPickedLocation] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const changeTitleHandler = (enteredText) => {
    setEnteredTitle(enteredText);
  };  
  const changeDescriptionHandler = (enteredText) => {
    setEnteredDescription(enteredText);
  };

  function imageTakenHandler(imageUri) {
    setSelectedImage(imageUri);
  }
  function locationPickedHandler(location) {
    setPickedLocation(location);
  }
  function saveProductHandler() {
    //const placeData = new Place(enteredTitle,selectedImage,pickedLocation);
    //props.onCreatePlace(placeData)
  }

  return (
    <ScrollView style={styles.form}>
      <View style={styles.titleContainer}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, {textAlignVertical:'top'}]}
          onChangeText={changeDescriptionHandler}
          value={enteredDescription}
          multiline={true}
          numberOfLines={6}
        />
      </View>
      <ProductImagePicker onImageTaken={imageTakenHandler} />
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
  titleContainer: {
    paddingHorizontal: 4,
  },    
  descriptionContainer: {
    paddingHorizontal: 4,
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
