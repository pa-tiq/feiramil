import { StyleSheet, Text } from 'react-native';

const AddProduct = ({ navigation }) => {

  //async function createPlaceHandler(place) {
  //  const insertedPlace = await insertPlace(place);
  //  sendPushNotification(insertedPlace);   
  //  navigation.navigate('AllPlaces');
  //}
  
  //return <PlaceForm onCreatePlace={createPlaceHandler} />;
  return <Text style={styles.title}>User!</Text>;
};

export default AddProduct;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
