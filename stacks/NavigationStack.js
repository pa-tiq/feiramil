import { useContext, useState } from "react";

import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AuthStack from './AuthStack';
import AuthenticatedStack from './AuthenticatedStack';

export default function NavigationStack() {
  const authContext = useContext(AuthContext);

  if (authContext.isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <NavigationContainer>
      {!authContext.isAuthenticated && <AuthStack />}
      {authContext.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}