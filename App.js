import { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import LoadingOverlay from './components/ui/LoadingOverlay';
import NavigationStack from './stacks/NavigationStack';
import AuthContextProvider from './store/auth-context';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Notificações push precisam de permissão.'
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      //console.log(pushTokenData);
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotifications();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <StatusBar style='light' />
      <AuthContextProvider>
        <NavigationStack/>
      </AuthContextProvider>
    </>
  );
}