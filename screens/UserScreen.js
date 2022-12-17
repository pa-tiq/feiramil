import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import UserData from '../components/User/UserData';
import { UserContext } from '../store/user-context';

function UserScreen() {
  const [loadedUser, setLoadedUser] = useState({});
  const isFocused = useIsFocused();
  const userContext = useContext(UserContext);

  useEffect(() => {
    async function loadUser() {
      const user = await userContext.fetchUser();
      setLoadedUser(user);
    }
    if (isFocused) {
      loadUser();
    }
  }, [isFocused]);

  if (userContext.isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ScrollView>
      <View style={styles.rootContainer}>
        <UserData />
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
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
});
