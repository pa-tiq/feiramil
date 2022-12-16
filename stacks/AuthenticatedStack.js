import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect } from "react";
import { AuthContext } from "../store/auth-context";
import * as Notifications from 'expo-notifications';
import WelcomeScreen from '../screens/WelcomeScreen';
import { Colors } from '../constants/styles';
import IconButton from '../components/ui/IconButton';

const Stack = createNativeStackNavigator();

export default function AuthenticatedStack() {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const notificationGenerationListener =
      Notifications.addNotificationReceivedListener((notification) => {
        //const placeId = notification.request.content.data.placeId;
        //console.log('notification generated - placeId=',placeId);
      });
    const notificationUserInteractionListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //const placeId = response.notification.request.content.data.placeId;
        //console.log('notification touched by user - placeId=',placeId);
        navigation.navigate('Welcome');
      });
    return () => {
      notificationGenerationListener.remove();
      notificationUserInteractionListener.remove();
    };
  }, []);

  const welcomeStackScreen = (
    <Stack.Screen
      name='Welcome'
      component={WelcomeScreen}
      options={{
        headerRight: ({ tintColor }) => (
          <IconButton
            icon='exit'
            color={tintColor}
            size={24}
            onPress={authContext.logout}
          />
        ),
      }}
    />
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary700 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      {welcomeStackScreen}
    </Stack.Navigator>
  );
}