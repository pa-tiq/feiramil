import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/styles';

function ProductsScreen() {

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.title}>You authenticated successfully!</Text>
    </View>
  );
}

export default ProductsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white'
  },
});
