import { useContext, useState } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AuthStack from './AuthStack';
import AuthenticatedStack from './AuthenticatedStack';

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

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <NavigationContainer>
      {!authContext.isAuthenticated && <AuthStack />}
      {authContext.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}