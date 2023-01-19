import { useContext } from 'react';
import { Alert, ScrollView } from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

function LoginScreen() {
  const authContext = useContext(AuthContext);

  async function loginHandler({ email, password, confirmationCode }) {
    try {
      authContext.setEnteredEmailAndPassword(email,password);
      await authContext.login(email, password, confirmationCode);
    } catch (error) {
      if (!authContext.isAuthenticated)
        Alert.alert('Falha no login!', error.message);
    }
  }

  if (authContext.isLoading) {
    return <LoadingOverlay message='Entrando...' />;
  }

  return (
    <ScrollView>
      <AuthContent isLogin onAuthenticate={loginHandler} />
    </ScrollView>
  );
}

export default LoginScreen;
