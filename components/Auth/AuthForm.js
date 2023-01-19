import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthContext } from '../../store/auth-context';

import Button from '../ui/Button';
import Input from './Input';

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const authContext = useContext(AuthContext);
  const { enteredEmail : contextEmail, enteredPassword: contextPassword } = authContext;

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
  const [enteredConfirmationCode, setEnteredConfirmationCode] = useState('');

  useEffect(()=>{
    setEnteredEmail(contextEmail);
    setEnteredPassword(contextPassword);
  },[contextEmail, contextPassword]);

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
    confirmationCode: confirmationCodeIsInvalid,
  } = credentialsInvalid;

  function confirmationCodeMask(input) {
    input = input.replace(/\D/g, '');
    return input;
  }

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'confirmEmail':
        setEnteredConfirmEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
      case 'confirmationCode':
        setEnteredConfirmationCode(confirmationCodeMask(enteredValue));
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
      confirmationCode: enteredConfirmationCode,
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
        {!isLogin && (
          <Input
            label='Confirme seu e-mail'
            onUpdateValue={updateInputValueHandler.bind(this, 'confirmEmail')}
            value={enteredConfirmEmail}
            keyboardType='email-address'
            isInvalid={emailsDontMatch}
          />
        )}
        <Input
          label='Senha'
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {isLogin && !authContext.emailConfirmed && (
          <Input
            label='Código de confirmação de e-mail'
            onUpdateValue={updateInputValueHandler.bind(
              this,
              'confirmationCode'
            )}
            value={enteredConfirmationCode}
            isInvalid={confirmationCodeIsInvalid}
            maxLength={5}
          />
        )}
        {!isLogin && (
          <Input
            label='Confirme sua senha'
            onUpdateValue={updateInputValueHandler.bind(
              this,
              'confirmPassword'
            )}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? 'Entrar' : 'Criar conta'}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
