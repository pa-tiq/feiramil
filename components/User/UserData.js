import { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/styles';
import { UserContext } from '../../store/user-context';
import UserImagePicker from '../Device/UserImagePicker';
import UserDataForm from './UserDataForm';
import * as FileSystem from 'expo-file-system';
import { URLs } from '../../constants/URLs';
import { AuthContext } from '../../store/auth-context';

function UserData() {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState();

  function imageTakenHandler(image) {
    async function updatePhoto() {
      try {
        const uploadResult = await FileSystem.uploadAsync(
          URLs.update_user_photo_url,
          image.uri,
          {
            fieldName: 'userphoto',
            httpMethod: 'PATCH',
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            headers: {
              Authorization: 'Bearer ' + authContext.token,
            },
          }
        );
        const result = JSON.parse(uploadResult.body);
        const response = await userContext.updatePhoto({
          path: result.path.substring(1, result.path.length),
          oldpath: userContext.user.photo,
        });
      } catch (err) {
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
        <UserImagePicker onImageTaken={imageTakenHandler} />
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
