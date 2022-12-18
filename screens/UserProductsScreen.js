import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ProductsList from '../components/Products/ProductsList';

const UserProductsScreen = () => {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const isFocused = useIsFocused();
  
  //useEffect(() => {
  //  async function loadPlaces(){
  //    const places = await fetchPlaces();
  //    setLoadedPlaces(places);
  //  }
  //  if (isFocused) {
  //    loadPlaces();
  //  }
  //}, [isFocused]);
  return <ProductsList products={loadedProducts}/>;
};

export default UserProductsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
