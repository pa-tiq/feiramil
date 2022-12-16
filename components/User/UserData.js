import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/styles';
import UserDataForm from './UserDataForm';

function UserData(props) {

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    name: false,
    om: false,
  });

  function submitHandler(credentials) {
    let { email, password, name, om } = credentials;

    email = email.trim();
    password = password.trim();
    name = password.trim();
    om = om.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const nameIsValid = name.length > 4;
    const omIsValid = om.length > 1;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      !nameIsValid ||
      !omIsValid
    ) {
      Alert.alert('Dados inválidos', 'Por favor verifique os dados inseridos.');
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
        name: !nameIsValid,
        om: !omIsValid
      });
      return;
    }
  }

  return (
    <View style={styles.authContent}>
      <UserDataForm
        user={props.user}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
    </View>
  );
}

export default UserData;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 10,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
