import { useCallback, useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/styles';
import { UserContext } from '../../store/user-context';
import UserImagePicker from '../Images/UserImagePicker';
import UserDataForm from './UserDataForm';
import { AuthContext } from '../../store/auth-context';
import { ProductContext } from '../../store/product-context';
import { uploadUserPhoto } from '../../util/findOrDownloadFile';
import LoadingOverlay from '../ui/LoadingOverlay';
import { useNavigation } from '@react-navigation/core';
import { wait } from '../../util/wait';

function UserData(props) {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const productContext = useContext(ProductContext);

  function imageTakenHandler(image) {
    async function updatePhoto() {
      try {
        const result = await uploadUserPhoto(image.uri, authContext.token);
        const response = await userContext.updatePhotoPath({
          path: result.path.substring(1, result.path.length),
          oldpath: userContext.user.photo,
        });
      } catch (err) {
        console.log(err);
      }
    }
    updatePhoto();
    productContext.triggerUserProductsReload();
    onRefresh();
  }

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    name: false,
    om: false,
    phone: false,
  });

  const [credentials, setCredentials] = useState(null);

  async function submitHandler(insertedCredentials) {
    let { email, name, om, phone, city, state } = insertedCredentials;

    email = email.trim();
    name = name ? name.trim() : '';
    om = om ? om.trim() : '';
    phone = phone ? phone.trim() : '';
    city = city ? city.trim() : '';
    state = state ? state.trim() : '';

    const emailIsValid = email.includes('@');
    const nameIsValid = name.length > 2;
    const omIsValid = om.length > 1;
    const phoneIsValid = phone.length > 9;

    if (
      !emailIsValid ||
      !nameIsValid ||
      !omIsValid ||
      !phoneIsValid
    ) {
      Alert.alert('Dados inválidos', 'Por favor verifique os dados inseridos.');
      setCredentialsInvalid({
        email: !emailIsValid,
        name: !nameIsValid,
        om: !omIsValid,
        phone: !phoneIsValid,
      });
      setCredentials(insertedCredentials);
      return;
    }
    const updatedUser = {
      email: email,
      name: name,
      password: null,
      om: om,
      phone: phone,
      city: city,
      state: state,
    };

    await userContext.updateUser(updatedUser);
    productContext.triggerUserProductsReload();
    setCredentialsInvalid({
      email: !emailIsValid,
      name: !nameIsValid,
      om: !omIsValid,
      phone: !phoneIsValid,
    });
    setCredentials(null);
    navigation.navigate('User', {
      city: city,
      state: state,
    });
  }

  if (refreshing) {
    return <LoadingOverlay style={{ width: '100%', height: 900 }} />;
  }

  return (
    <>
      <View style={styles.authContent}>
        <UserImagePicker onImageTaken={imageTakenHandler} />
      </View>
      <View style={styles.authContent}>
        <UserDataForm
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
          credentials={credentials}
          editForm={!!credentials}
          selectedCity={props.selectedCity}
          selectedState={props.selectedState}
        />
      </View>
    </>
  );
}

export default UserData;

const styles = StyleSheet.create({
  authContent: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
