import { useContext } from 'react';
import { Alert, ScrollView, ToastAndroid } from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

function SignupScreen() {
  const authContext = useContext(AuthContext);

  async function signupHandler({ email, password, name, om }) {
    try {
      await authContext.signup(email, password, name, om);
      ToastAndroid.show('Usuário criado e e-mail de confirmação enviado.', ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert('Criação de usuário falhou.', error.message);
    }
  }

  if (authContext.isLoading) {
    return <LoadingOverlay message='Criando Usuário...' />;
  }

  return <ScrollView><AuthContent onAuthenticate={signupHandler} /></ScrollView>;
}

export default SignupScreen;
