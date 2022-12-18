import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';
import Button from './Button';

function ErrorOverlay({ message, reloadFunction }) {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <Button onPress={reloadFunction}>{'Tentar de novo'}</Button>
    </View>
  );
}

export default ErrorOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.primary700
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color:'white',
    fontWeight:'bold'
  },
});
