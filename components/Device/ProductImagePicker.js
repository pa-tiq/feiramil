import { View, StyleSheet, Alert, Text, Image } from 'react-native';
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
  PermissionStatus,
  MediaTypeOptions,
} from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

import { useContext, useLayoutEffect, useState } from 'react';
import { Colors } from '../../constants/styles';
import Button from '../ui/Button';
import { UserContext } from '../../store/user-context';
import LoadingOverlay from '../ui/LoadingOverlay';
import { URLs } from '../../constants/URLs';
import useFileSystem from '../../hooks/use-FileSystem';

const ProductImagePicker = (props) => {
  const [newImagePicked, setNewImagePicked] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [downloadedImageURI, setDowloadedImageURI] = useState(null);
  const [cameraPermissionInformation, requestCameraPermission] =
    useCameraPermissions();
  const [libraryPermissionInformation, requestLibraryPermission] =
    useMediaLibraryPermissions();

  const userContext = useContext(UserContext);
  const { user } = userContext;
  const fileSystemObj = useFileSystem();

  useLayoutEffect(() => {
    async function findFileOrDownloadFile() {
      try {
        if (!user.photo) return;
        const userProfilePicturePath = URLs.base_url + user.photo;
        const fileName = user.photo.split('/')[2];
        const fileInfo = await FileSystem.getInfoAsync(
          FileSystem.documentDirectory + fileName
        );
        if (fileInfo.exists) {
          setDowloadedImageURI(fileInfo.uri);
        } else {
          const createTask = (uri) => {
            setDowloadedImageURI(uri);
          };
          fileSystemObj.downloadImage(
            userProfilePicturePath,
            fileName,
            createTask
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    if(props.isEdit) findFileOrDownloadFile();
  }, [user]);

  // needed only for iOS
  async function verifyCameraPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestCameraPermission();
      return permissionResponse.granted;
    } else if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Sem permissão!',
        'vc precisa permitir o app a usar a sua câmera.'
      );
      const permissionResponse = await requestCameraPermission();
      return permissionResponse.granted;
    }
    return true;
  }

  async function verifyLibraryPermissions() {
    if (libraryPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestLibraryPermission();
      return permissionResponse.granted;
    } else if (
      libraryPermissionInformation.status === PermissionStatus.DENIED
    ) {
      Alert.alert(
        'Sem permissão!',
        'vc precisa permitir o app a acessar seus arquivos.'
      );
      const permissionResponse = await requestLibraryPermission();
      return permissionResponse.granted;
    }
    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyCameraPermissions();
    if (!hasPermission) return;
    const result = await launchCameraAsync({
      allowsEditing: true,
      base64: false,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setNewImage(result.assets[0]);
      setNewImagePicked(true);
      props.imagePicked(result.assets[0]);
    }
  }

  async function getFileHandler() {
    const hasPermission = await verifyLibraryPermissions();
    if (!hasPermission) return;
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      base64: false,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setNewImage(result.assets[0]);
      setNewImagePicked(true);
      props.imagePicked(result.assets[0]);
    }
  }

  let imagePreview = (
    <Ionicons
      style={styles.icon}
      name={'images-outline'}
      color={'white'}
      size={30}
    />
  );

  if (newImage) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: newImage.uri }} />
    );
  }

  if (downloadedImageURI && !newImagePicked) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: downloadedImageURI }} />
    );
  }

  if (userContext.isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.imagePreviewContainer}>
        <View style={styles.imagePreview}>{imagePreview}</View>
      </View>
      <View style={styles.imageButtonsContainer}>
        <View style={styles.buttonLeft}>
          <Button icon='camera' onPress={takeImageHandler}>
            Tirar foto
          </Button>
        </View>
        <View style={styles.buttonRight}>
          <Button icon='document' onPress={getFileHandler}>
            Escolher foto
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ProductImagePicker;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 5,
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    marginVertical: 8,
  },
  imageButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  buttonLeft: {
    flex: 1,
    marginRight: 2,
  },
  buttonRight: {
    flex: 1,
    marginLeft: 2,
  },
});
