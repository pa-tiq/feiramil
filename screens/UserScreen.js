import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import UserData from '../components/User/UserData';
import { UserContext } from '../store/user-context';

function UserScreen({ route }) {
  const [loadedUser, setLoadedUser] = useState({});
  const isFocused = useIsFocused();
  const userContext = useContext(UserContext);

  //useEffect(() => {
  //  async function loadUser() {
  //    try {
  //      const user = await userContext.fetchUser();
  //      setLoadedUser(user);
  //    } catch (err) {}
  //  }
  //  if (isFocused) {
  //    loadUser();
  //  }
  //}, [isFocused]);

  return (
    <ScrollView>
      <View style={styles.rootContainer}>
        <UserData
          selectedCity={route.params ? route.params.city : null}
          selectedState={route.params ? route.params.state : null}
        />
      </View>
    </ScrollView>
  );
}

export default UserScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
});
