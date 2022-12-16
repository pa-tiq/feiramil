import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/styles';

function UserScreen() {

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>User!</Text>
    </View>
  );
}

export default UserScreen;

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
