import { StyleSheet, Text } from 'react-native';
import ProductForm from '../components/Products/ProductForm';

const AddProduct = ({ navigation }) => {

  async function createPlaceHandler(place) {
  //  const insertedPlace = await insertPlace(place);
  //  sendPushNotification(insertedPlace);   
  //  navigation.navigate('AllPlaces');
  }
  
  return <ProductForm onCreatePlace={createPlaceHandler} />;
};

export default AddProduct;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
