import { useContext } from 'react';
import { Alert, ScrollView } from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

function LoginScreen() {
  const authContext = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    try {
      await authContext.login(email, password);
    } catch (error) {
      if(!authContext.isAuthenticated)
        Alert.alert('Falha no login!', error.message);
    }
  }

  return (
    <ScrollView>
      {authContext.isLoading && <LoadingOverlay message='Entrando...' />}
      <AuthContent isLogin onAuthenticate={loginHandler} />
    </ScrollView>
  );
}

export default LoginScreen;
