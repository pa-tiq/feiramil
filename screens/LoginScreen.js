import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';

function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsLoading(true);
    try {
      const token = await login(email, password);
      authContext.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Login failed!',
        'Check your credentials or try again later.'
      );
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingOverlay message='Loggin in...' />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
