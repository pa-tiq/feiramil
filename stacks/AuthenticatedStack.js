import { useContext, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../store/auth-context';
import MainTab from './MainTab';
import { Colors } from '../constants/styles';
import UserTab from './UserTab';
import UserProductsTab from './UserProductsTab';

const BottomTab = createBottomTabNavigator();

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

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.primary500, borderTopColor: Colors.primary700},
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: Colors.primary200,
        tabBarHideOnKeyboard: true
      }}
      initialRouteName='MainTab'
    >
      <BottomTab.Screen
        name='UserProductsTab'
        component={UserProductsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='layers-outline' color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <BottomTab.Screen
        name='MainTab'
        component={MainTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <BottomTab.Screen
        name='UserTab'
        component={UserTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person-outline' color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </BottomTab.Navigator>
  );
}
