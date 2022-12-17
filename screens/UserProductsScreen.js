import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/styles';

function UserProductsScreen() {

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Oie!</Text>
      <Text style={styles.title}>You authenticated successfully!</Text>
    </View>
  );
}

export default UserProductsScreen;

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
