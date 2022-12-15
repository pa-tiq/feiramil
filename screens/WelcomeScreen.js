import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { loginMessage } from '../util/auth';

function WelcomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedMessage, setFetchedMessage] = useState('');
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useLayoutEffect(() => {
    async function getMessage() {
      setIsLoading(true);
      const message = await loginMessage(token);
      setIsLoading(false);
      setFetchedMessage(message);
    }
    getMessage();
  }, [token]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text>{fetchedMessage}</Text>
    </View>
  );
}

export default WelcomeScreen;

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
  },
});
