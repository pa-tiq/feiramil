import { useCallback, useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/styles';
import { UserContext } from '../../store/user-context';
import UserImagePicker from '../Device/UserImagePicker';
import UserDataForm from './UserDataForm';
import { AuthContext } from '../../store/auth-context';
import { ProductContext } from '../../store/product-context';
import { uploadUserPhoto } from '../../util/findOrDownloadFile';
import LoadingOverlay from '../ui/LoadingOverlay';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function UserData(props) {
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
    setSelectedImage(image);
    productContext.triggerUserProductsReload();
  }

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    name: false,
    om: false,
    phone: false,
  });

  async function submitHandler(credentials) {
    let { email, password, name, om, phone, city, state } = credentials;

    email = email.trim();
    password = password.trim();
    name = name.trim();
    om = om.trim();
    phone = phone.trim();
    city = city.trim();
    state = state.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6 || password.length === 0;
    const nameIsValid = name.length > 2;
    const omIsValid = om.length > 1;
    const phoneIsValid = phone.length > 9;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      !nameIsValid ||
      !omIsValid ||
      !phoneIsValid
    ) {
      Alert.alert('Dados inválidos', 'Por favor verifique os dados inseridos.');
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
        name: !nameIsValid,
        om: !omIsValid,
        phone: !phoneIsValid,
      });
      return;
    }
    const updatedUser =
      password.length === 0
        ? {
            email: email,
            name: name,
            password: null,
            om: om,
            phone: phone,
            city: city,
            state: state,
          }
        : {
            email: email,
            name: name,
            password: password,
            om: om,
            phone: phone,
            city: city,
            state: state,
          };
    const resStatus = await userContext.updateUser(updatedUser);
    productContext.triggerUserProductsReload();
  }

  if (refreshing) {
    return <LoadingOverlay />;
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
