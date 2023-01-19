import { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../store/auth-context';
import AuthStack from './AuthStack';
import AuthenticatedStack from './AuthenticatedStack';
import UserContextProvider from '../store/user-context';
import ProductContextProvider from '../store/product-context';

export default function NavigationStack() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && (
        <UserContextProvider>
          <ProductContextProvider>
            <AuthenticatedStack />
          </ProductContextProvider>
        </UserContextProvider>
      )}
    </NavigationContainer>
  );
}
