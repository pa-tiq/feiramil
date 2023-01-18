import { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../store/auth-context';

function AuthContent({ isLogin, onAuthenticate }) {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.navigate('Signup'); // navigate has a back button, replace doesn't
    } else {
      navigation.navigate('Login');
    }
  }  
  
  function forgotPasswordHandler() {
    navigation.navigate('ForgotPassword');      
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword, confirmationCode} = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;
    const confirmationCodeIsValid = confirmationCode.length > 0;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual)) ||
      ((!isLogin && !authContext.emailConfirmed) && !confirmationCodeIsValid)
    ) {
      Alert.alert(
        'Dados inválidos',
        'Por favor, verifique os dados inseridos.'
      );
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
        confirmationCode: !confirmationCodeIsValid
      });
      return;
    }
    onAuthenticate({ email, password, confirmationCode });
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Feiramil</Text>
      </View>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          <FlatButton onPress={switchAuthModeHandler}>
            {isLogin ? 'Criar um novo usuário' : 'Fazer login'}
          </FlatButton>          
          <FlatButton onPress={forgotPasswordHandler}>
            {'Esqueceu sua senha?'}
          </FlatButton>
        </View>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  rootContainer:{
    marginVertical:40,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 25
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
    marginTop: 8,
  },
});
