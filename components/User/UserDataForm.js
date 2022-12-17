import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '../ui/Button';
import Input from '../Auth/Input';
import { UserContext } from '../../store/user-context';
import LoadingOverlay from '../ui/LoadingOverlay';
import ErrorOverlay from '../ui/ErrorOverlay';

function UserDataForm(props) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredName, setEnteredName] = useState('');
  const [enteredOm, setEnteredOm] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');

  const [editForm, setEditForm] = useState(false);
  const [error, setError] = useState(null)

  function editFormHandler() {
    setEditForm(true);
  }
  function cancelEditFormHandler() {
    setEditForm(false);
  }

  const userContext = useContext(UserContext);
  const { user } = userContext;

  useLayoutEffect(() => {
    setEnteredEmail(user.email);
    setEnteredName(user.name);
    setEnteredOm(user.om);
    setEnteredPhone(user.phone);
  }, [user]);

  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    name: nameIsInvalid,
    om: omIsInvalid,
    phone: phoneIsInvalid,
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
      case 'phone':
        setEnteredPhone(enteredValue);
        break;
    }
  }

  function submitHandler() {
    props.onSubmit({
      email: enteredEmail,
      password: enteredPassword,
      name: enteredName,
      om: enteredOm,
      phone: enteredPhone,
    });
  }

  function deleteErrorHandler(){
    setError(null);
  }

  if (userContext.isLoading) {
    return <LoadingOverlay />;
  }

  if (!userContext.isLoading && error) {
    return <ErrorOverlay message={userContext.error} reload={deleteErrorHandler}/>;
  }

  return (
    <View style={styles.form}>
      <Input
        label='E-mail'
        onUpdateValue={updateInputValueHandler.bind(this, 'email')}
        value={enteredEmail}
        keyboardType='email-address'
        isInvalid={emailIsInvalid}
        editable={editForm}
      />
      <Input
        label='Senha'
        onUpdateValue={updateInputValueHandler.bind(this, 'password')}
        secure
        value={enteredPassword}
        isInvalid={passwordIsInvalid}
        editable={editForm}
        placeholder={'Edite para trocar de senha'}
      />
      <Input
        label='Nome'
        onUpdateValue={updateInputValueHandler.bind(this, 'name')}
        value={enteredName}
        keyboardType='text'
        isInvalid={nameIsInvalid}
        editable={editForm}
      />
      <Input
        label='Organização Militar'
        onUpdateValue={updateInputValueHandler.bind(this, 'om')}
        value={enteredOm}
        keyboardType='text'
        isInvalid={omIsInvalid}
        editable={editForm}
      />
      <Input
        label='Número de celular'
        onUpdateValue={updateInputValueHandler.bind(this, 'phone')}
        value={enteredPhone}
        keyboardType='phone-pad'
        isInvalid={phoneIsInvalid}
        editable={editForm}
      />
      <View style={styles.buttons}>
        {!editForm ? (
          <Button onPress={editFormHandler}>{'Editar'}</Button>
        ) : (
          <View style={styles.buttons_row}>
            <View style={styles.buttonLeft}>
              <Button onPress={cancelEditFormHandler}>{'Cancelar'}</Button>
            </View>
            <View style={styles.buttonRight}>
              <Button onPress={submitHandler}>{'Salvar'}</Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export default UserDataForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  buttonLeft: {
    flex: 1,
    marginRight: 2,
  },
  buttonRight: {
    flex: 1,
    marginLeft: 2,
  },
  buttons_row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
});
