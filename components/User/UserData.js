import { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/styles';
import { UserContext } from '../../store/user-context';
import ImagePicker from '../Device/ImagePicker';
import UserDataForm from './UserDataForm';
import * as MediaLibrary from 'expo-media-library';

function UserData() {
  const userContext = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState();

  function imageTakenHandler(image) {
    async function updatePhoto(){
      try{
        const photo = await MediaLibrary.createAssetAsync(image.uri);
        const response = await userContext.updatePhoto(photo);
        console.log(response);
      }
      catch(err){
        console.log(err);
      }
    }
    updatePhoto();
    setSelectedImage(image);
  }

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    name: false,
    om: false,
    phone: false,
  });

  async function submitHandler(credentials) {
    let { email, password, name, om, phone } = credentials;

    email = email.trim();
    password = password.trim();
    name = name.trim();
    om = om.trim();
    phone = phone.trim();

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
            om: om,
            phone: phone,
          }
        : {
            email: email,
            name: name,
            password: password,
            om: om,
            phone: phone,
          };
    const response = await userContext.updateUser({
      email: email,
      password: password,
      name: name,
      om: om,
      phone: phone,
    });
  }

  return (
    <>
      <View style={styles.authContent}>
        <ImagePicker onImageTaken={imageTakenHandler} />
      </View>
      <View style={styles.authContent}>
        <UserDataForm
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
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
