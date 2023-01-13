import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../ui/Button';
import Input from '../Auth/Input';
import { UserContext } from '../../store/user-context';
import LoadingOverlay from '../ui/LoadingOverlay';
import ErrorOverlay from '../ui/ErrorOverlay';
import IconTextButton from '../ui/IconTextButton';
import { useNavigation } from '@react-navigation/native';
import { wait } from '../../util/wait';

function UserDataForm(props) {
  const navigation = useNavigation();

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredName, setEnteredName] = useState('');
  const [enteredOm, setEnteredOm] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');
  const [enteredCity, setEnteredCity] = useState('');
  const [enteredState, setEnteredState] = useState('');

  const [editForm, setEditForm] = useState(false);
  const [error, setError] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  function editFormHandler() {
    setEditForm(true);
  }
  function cancelEditFormHandler() {
    setEditForm(false);
    setEnteredEmail(user.email);
    setEnteredName(user.name);
    setEnteredOm(user.om);
    setEnteredPhone(user.phone);
    setEnteredCity(user.city);
    setEnteredState(user.state);
    if(!editForm){
      navigation.navigate('User', {
        city: user.city,
        state: user.state,
      });
    }
  }

  const userContext = useContext(UserContext);
  const { user } = userContext;

  useEffect(() => {
    setEnteredEmail(user.email);
    setEnteredName(user.name);
    setEnteredOm(user.om);
    setEnteredPhone(user.phone);
    setEnteredCity(user.city);
    setEnteredState(user.state);
  }, [user]);

  useEffect(() => {
    if (!enteredEmail || enteredEmail.length === 0) {
      setEnteredEmail(
        props.credentials && props.credentials.email
          ? props.credentials.email
          : user.email
      );
    }

    if (!enteredName || enteredName.length === 0) {
      setEnteredName(
        props.credentials && props.credentials.name
          ? props.credentials.name
          : user.name
      );
    }
    if (!enteredOm || enteredOm.length === 0) {
      setEnteredOm(
        props.credentials && props.credentials.om
          ? props.credentials.om
          : user.om
      );
    }
    if (!enteredPhone || enteredPhone.length === 0) {
      setEnteredPhone(
        props.credentials && props.credentials.phone
          ? props.credentials.phone
          : user.phone
      );
    }
    setEnteredCity(
      props.selectedCity ? props.selectedCity : user.city ? user.city : ''
    );
    setEnteredState(
      props.selectedState ? props.selectedState : user.state ? user.state : ''
    );
    setEditForm(
      props.editForm ||
        (props.selectedCity ? props.selectedCity !== user.city : false) ||
        (props.selectedCity ? props.selectedState !== user.state : false)
    );
  }, [user, props]);

  let {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    name: nameIsInvalid,
    om: omIsInvalid,
    phone: phoneIsInvalid,
  } = props.credentialsInvalid;

  function phoneMask(input) {
    input = input.replace(/\D/g, '');
    input = input.replace(/^(\d{2})(\d)/g, '($1)$2');
    input = input.replace(/(\d)(\d{4})$/, '$1-$2');
    return input;
  }

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
        setEnteredPhone(phoneMask(enteredValue));
        break;
    }
  }

  function submitHandler() {
    //const emailIsValid = enteredEmail.includes('@');
    //const passwordIsValid = enteredPassword.length > 6 || enteredPassword.length === 0;
    //const nameIsValid = enteredName.length > 2;
    //const omIsValid = enteredOm.length > 1;
    //const phoneIsValid = enteredPhone.length > 9;
    //if (
    //  !emailIsValid ||
    //  !passwordIsValid ||
    //  !nameIsValid ||
    //  !omIsValid ||
    //  !phoneIsValid
    //) {
    //  Alert.alert('Dados inválidos', 'Por favor verifique os dados inseridos.');
    //  emailIsInvalid =  !emailIsValid;
    //  passwordIsInvalid = !passwordIsValid;
    //  nameIsInvalid = !nameIsValid;
    //  omIsInvalid = !omIsValid;
    //  phoneIsInvalid = !phoneIsValid;
    //  return;
    //}

    props.onSubmit({
      email: enteredEmail,
      password: enteredPassword,
      name: enteredName,
      om: enteredOm,
      phone: enteredPhone,
      city: props.selectedCity,
      state: props.selectedState,
    });
    cancelEditFormHandler();
  }

  function deleteErrorHandler() {
    setError(null);
  }

  const pickCityHandler = () => {
    navigation.navigate('UserCityPick', { parentScreen: 'User' });
  };

  if (userContext.isLoading || refreshing) {
    return <LoadingOverlay style={{ height: 500 }} />;
  }

  if (!userContext.isLoading && error) {
    return (
      <ErrorOverlay message={userContext.error} reload={deleteErrorHandler} />
    );
  }

  let cityView = (
    <View style={styles.cityButton}>
      <IconTextButton
        icon={'location-outline'}
        onPress={pickCityHandler}
        disabled={!editForm}
      />
    </View>
  );

  if (props.selectedCity && props.selectedState) {
    cityView = (
      <View style={styles.cityButton}>
        <IconTextButton
          icon={'location-outline'}
          onPress={pickCityHandler}
          disabled={!editForm}
        >
          {`${props.selectedCity} - ${props.selectedState}`}
        </IconTextButton>
      </View>
    );
  }
  if (
    enteredCity &&
    enteredState &&
    enteredCity.length !== 0 &&
    enteredState.length !== 0
  ) {
    cityView = (
      <View style={styles.cityButton}>
        <IconTextButton
          icon={'location-outline'}
          onPress={pickCityHandler}
          disabled={!editForm}
        >
          {`${enteredCity} - ${enteredState}`}
        </IconTextButton>
      </View>
    );
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
        autoComplete={'email'}
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
        autoComplete={'name'}
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
        keyboardType='numeric'
        isInvalid={phoneIsInvalid}
        editable={editForm}
        maxLength={14}
        autoComplete={'tel'}
        placeholder={'(99)99999-9999'}
      />
      <View style={styles.city}>
        <Text style={styles.label}>Cidade</Text>
        {cityView}
      </View>
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
  form: {
    paddingHorizontal: 5,
  },
  buttons: {
    marginTop: 12,
    marginBottom: 10,
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
  city: {
    flex: 1,
    marginLeft: 0,
  },
  cityButton: {
    marginVertical: 6,
    flex: 1,
  },
  label: {
    marginTop: 4,
    color: 'white',
  },
});
