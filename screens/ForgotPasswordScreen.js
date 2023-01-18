import { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Input from '../components/Auth/Input';
import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Colors } from '../constants/styles';
import { AuthContext } from '../store/auth-context';

function ForgotPasswordScreen() {
  const authContext = useContext(AuthContext);
  const [enteredConfirmationCode, setEnteredConfirmationCode] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');

  async function forgotPasswordRequest() {
    try {
      if (enteredEmail.includes('@')){
        await authContext.forgotPasswordRequest(enteredEmail);
        Alert.alert(
          'Código de confirmação enviado!',
          'Insira o código de confirmação para alterar a sua senha'
        );
      }
      else{
        Alert.alert(
          'E-mail inválido',
          'Insira um e-mail válido para continuar.'
        );
      }
    } catch (error) {
      Alert.alert('Falha na alteração de senha', error.message);
    }
  }

  const confirmationCodeChangeHandler = (value) => {
    setEnteredConfirmationCode(value);
  };

  const emailChangeHandler = (value) => {
    setEnteredEmail(value);
  };

  const changePasswordHandler = () => {};

  return (
    <ScrollView>
      {authContext.isLoading && <LoadingOverlay message='Carregando...' />}
      <View style={styles.rootContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{authContext.requestedPasswordChange ? 'Insira o código de confirmação enviado ao seu e-mail' : 'Confirme o seu e-mail'}</Text>
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
                label='Código de confirmação'
                onUpdateValue={confirmationCodeChangeHandler}
                value={enteredConfirmationCode}
                maxLength={5}
              />
              <View style={styles.buttons}>
                <Button onPress={changePasswordHandler}>
                  {'Prosseguir com alteração de senha'}
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
    marginHorizontal: 4
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
