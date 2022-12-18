import { useContext, useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../store/auth-context';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import AuthStack from './AuthStack';
import AuthenticatedStack from './AuthenticatedStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContextProvider from '../store/user-context';
import ProductContextProvider from '../store/product-context';

export default function NavigationStack() {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        authContext.authenticate(storedToken);
      }
      setIsLoading(false);
    }
    fetchToken();
  }, []);

  if (isLoading || authContext.isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <NavigationContainer>
      {!authContext.isAuthenticated && <AuthStack />}
      {authContext.isAuthenticated && (
        <UserContextProvider>
          <ProductContextProvider>
            <AuthenticatedStack />
          </ProductContextProvider>
        </UserContextProvider>
      )}
    </NavigationContainer>
  );
}
