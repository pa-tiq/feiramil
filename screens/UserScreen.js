import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../components/ui/Button';
import UserData from '../components/User/UserData';
import { Colors } from '../constants/styles';
import { AuthContext } from '../store/auth-context';

function UserScreen({ route }) {
  const authContext = useContext(AuthContext);

  return (
    <ScrollView>
      <View style={styles.rootContainer}>
        <UserData
          selectedCity={route.params ? route.params.city : null}
          selectedState={route.params ? route.params.state : null}
        />
        <Button
          style={styles.logoutButton}
          icon={'exit-outline'}
          onPress={authContext.logout}
        >
          {'Sair'}
        </Button>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  logoutButton: {
    backgroundColor: Colors.primary800,
    borderWidth: 0,
    margin:20
  },
});
