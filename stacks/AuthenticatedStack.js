import { useContext, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

import MainTab from './MainTab';
import { Colors } from '../constants/styles';
import UserTab from './UserTab';
import UserProductsTab from './UserProductsTab';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomTabBar from '../components/ui/CustomTabBar';
import { StyleSheet } from 'react-native';
import UserFavouritesTab from './UserFavouritesTab';
import { SwipeContext } from '../store/swipe-context';

const Tab = createMaterialTopTabNavigator();

export default function AuthenticatedStack() {
  const navigation = useNavigation();
  const swipeContext = useContext(SwipeContext)

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
    <>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ swipeEnabled: swipeContext.swipe }}
      >
        <Tab.Screen
          name='UserProductsTab'
          component={UserProductsTab}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='layers-outline' color={color} size={size} />
            ),
            tabBarLabel: 'Seus produtos',
            tabBarStyle: { flex: 1.5 },
          }}
        />
        <Tab.Screen
          name='UserFavouritesTab'
          component={UserFavouritesTab}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='layers-outline' color={color} size={size} />
            ),
            tabBarLabel: 'Favoritos',
          }}
        />
        <Tab.Screen
          name='MainTab'
          component={MainTab}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='home-outline' color={color} size={size} />
            ),
            tabBarLabel: 'Produtos',
          }}
        />
        <Tab.Screen
          name='UserTab'
          component={UserTab}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='person-outline' color={color} size={size} />
            ),
            tabBarLabel: String.fromCharCode(9881),
            //tabBarLabel: String.fromCodePoint(0x1F464),
            tabBarStyle: { flex: 0.5 },
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  headerButtonsContainer: {
    backgroundColor: Colors.background,
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingRight: 15,
  },
  addProductIcon: {
    color: 'white',
    marginTop: 19,
  },
});
