import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import Input from '../components/Auth/Input';
import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Colors } from '../constants/styles';
import { AuthContext } from '../store/auth-context';

function ForgotPasswordScreen() {
  const authContext = useContext(AuthContext);
  const [enteredConfirmationCode, setEnteredConfirmationCode] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredPasswordConfirm, setEnteredPasswordConfirm] = useState('');
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
  const [confirmationCodeInvalid, setConfirmationCodeInvalid] = useState(false);
  const navigation = useNavigation();

  useEffect(()=>{
    if((!enteredEmail || enteredEmail.length === 0) && authContext.requestedPasswordChange){
      authContext.cancelForgotPasswordRequest();
    }
  },[])

  async function forgotPasswordRequest() {
    try {
      if (enteredEmail.includes('@')) {
        await authContext.forgotPasswordRequest(enteredEmail);
        Alert.alert(
          'Código de confirmação enviado!',
          'Insira o código de confirmação para alterar a sua senha'
        );
      } else {
        Alert.alert(
          'E-mail inválido',
          'Insira um e-mail válido para continuar.'
        );
      }
    } catch (error) {
      Alert.alert('Falha na alteração de senha', error.message);
    }
  }

  function confirmationCodeMask(input) {
    input = input.replace(/\D/g, '');
    return input;
  }

  const confirmationCodeChangeHandler = (value) => {
    setConfirmationCodeInvalid(false);
    setEnteredConfirmationCode(confirmationCodeMask(value));
  };

  const emailChangeHandler = (value) => {
    setEnteredEmail(value);
  };

  const passwordChangeHandler = (value) => {
    setPasswordsDontMatch(false);
    setEnteredPassword(value);
  };

  const passwordConfirmChangeHandler = (value) => {
    setPasswordsDontMatch(false);
    setEnteredPasswordConfirm(value);
  };

  const changePasswordHandler = async () => {
    if (!enteredConfirmationCode || enteredConfirmationCode.length !== 5) {
      setConfirmationCodeInvalid(true);
      Alert.alert(
        'Código de confirmação inválido',
        'Insira o código de confirmação enviado ao seu e-mail.'
      );
      return;
    }
    if (
      !enteredPassword ||
      !enteredPasswordConfirm ||
      enteredPassword.length === 0 ||
      enteredPasswordConfirm.length === 0
    ) {
      Alert.alert('Senha inválida', 'Insira uma senha válida para continuar.');
      return;
    }
    if (enteredPassword !== enteredPasswordConfirm) {
      setPasswordsDontMatch(true);
      Alert.alert('Senha inválida', 'As senhas não são iguais.');
      return;
    }

    try {
      await authContext.changePassword(
        enteredEmail,
        enteredPassword,
        enteredConfirmationCode,
      );
      navigation.navigate('Login');
      ToastAndroid.show('Senha alterada.', ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert('Falha na alteração de senha', error.message);
    }
  };

  if (authContext.isLoading && !authContext.requestedPasswordChange) {
    return <LoadingOverlay message='Enviando e-mail...' />;
  }

  if (authContext.isLoading && authContext.requestedPasswordChange) {
    return <LoadingOverlay message='Alterando senha...' />;
  }

  return (
    <ScrollView>
      <View style={styles.rootContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {authContext.requestedPasswordChange
              ? 'Insira o código de confirmação enviado ao seu e-mail'
              : 'Confirme o seu e-mail'}
          </Text>
        </View>
        <View style={styles.authContent}>
          {!authContext.requestedPasswordChange ? (
            <>
              <Input
                label='E-mail'
                onUpdateValue={emailChangeHandler}
                value={enteredEmail}
                keyboardType='email-address'
              />
              <View style={styles.buttons}>
                <Button onPress={forgotPasswordRequest}>
                  {'Enviar código de confirmação para o e-mail'}
                </Button>
              </View>
            </>
          ) : (
            <>
              <Input
                label='E-mail'
                editable={false}
                value={enteredEmail}
                keyboardType='email-address'
              />
              <Input
                label='Código de confirmação'
                onUpdateValue={confirmationCodeChangeHandler}
                value={enteredConfirmationCode}
                maxLength={5}
                isInvalid={confirmationCodeInvalid}
              />
              <Input
                label='Nova senha'
                onUpdateValue={passwordChangeHandler}
                secure
                value={enteredPassword}
                isInvalid={passwordsDontMatch}
              />
              <Input
                label='Confirme sua nova senha'
                onUpdateValue={passwordConfirmChangeHandler}
                secure
                value={enteredPasswordConfirm}
                isInvalid={passwordsDontMatch}
              />
              <View style={styles.buttons}>
                <Button onPress={changePasswordHandler}>
                  {'Alterar senha'}
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 25,
  },
  authContent: {
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary900,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 12,
  },
});
