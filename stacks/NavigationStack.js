import { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../store/auth-context';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import AuthStack from './AuthStack';
import AuthenticatedStack from './AuthenticatedStack';
import UserContextProvider from '../store/user-context';
import ProductContextProvider from '../store/product-context';
import SwipeContextProvider from '../store/swipe-context';

export default function NavigationStack() {
  const authContext = useContext(AuthContext);

  if (authContext.isLoading) {
    return <LoadingOverlay message={'Entrando...'} />;
  }

  return (
    <NavigationContainer>
      {!authContext.isAuthenticated && <AuthStack />}
      {authContext.isAuthenticated && (
        <SwipeContextProvider>
          <UserContextProvider>
            <ProductContextProvider>
              <AuthenticatedStack />
            </ProductContextProvider>
          </UserContextProvider>
        </SwipeContextProvider>
      )}
    </NavigationContainer>
  );
}
