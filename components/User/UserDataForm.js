import { useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '../ui/Button';
import Input from '../Auth/Input';

function UserDataForm(props) {
  const [enteredEmail, setEnteredEmail] = useState(props.user.email);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredName, setEnteredName] = useState(props.user.name);
  const [enteredOm, setEnteredOm] = useState(props.user.om);

  useLayoutEffect(() => {
    setEnteredEmail(props.user.email);
    setEnteredName(props.user.name);
    setEnteredOm(props.user.om);
  }, []);

  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    name: nameIsInvalid,
    om: omIsInvalid,
  } = props.credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'name':
        setEnteredName(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'om':
        setEnteredOm(enteredValue);
        break;
    }
  }

  function submitHandler() {
    props.onSubmit({
      email: enteredEmail,
      password: enteredPassword,
      name: enteredName,
      om: enteredOm,
    });
  }

  return (
    <View style={styles.form}>
      <View>
        <Input
          label='E-mail'
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          keyboardType='email-address'
          isInvalid={emailIsInvalid}
        />
        <Input
          label='Senha'
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        <Input
          label='Nome'
          onUpdateValue={updateInputValueHandler.bind(this, 'name')}
          value={enteredName}
          keyboardType='text'
          isInvalid={nameIsInvalid}
        />
        <Input
          label='Organização Militar'
          onUpdateValue={updateInputValueHandler.bind(this, 'om')}
          value={enteredOm}
          keyboardType='text'
          isInvalid={omIsInvalid}
        />
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>{'Salvar'}</Button>
        </View>
      </View>
    </View>
  );
}

export default UserDataForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
