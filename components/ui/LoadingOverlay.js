import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';

function LoadingOverlay({ message, style}) {
  return (
    <View style={[styles.rootContainer, style]}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.background
  },
  message: {
    color:'white',
    fontSize: 16,
    marginBottom: 12,
  },
});
