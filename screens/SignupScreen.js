import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { createUser } from '../util/auth';

function SignupScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    try {
      const token = await createUser(email, password);
      authContext.authenticate(token);
    } catch (error) {
      Alert.alert('User creation failed', 'Could not create user.');
      setIsLoading(false);
      return;
    }
  }

  if (isLoading) {
    return <LoadingOverlay message='Creating user...' />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
