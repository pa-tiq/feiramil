import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Alert, ScrollView, ToastAndroid } from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

function SignupScreen() {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  async function signupHandler({ email, password, name, om }) {
    try {
      await authContext.signup(email, password, name, om);
      authContext.setEnteredEmailAndPassword(email,password);
      ToastAndroid.show('Usuário criado e e-mail de confirmação enviado.', ToastAndroid.SHORT);
      navigation.navigate('Login');
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
