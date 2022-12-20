import { URLs } from '../constants/URLs';
import * as FileSystem from 'expo-file-system';

export async function findOrDownloadImage(path) {
  let imageUri;
  const filePath = URLs.base_url + path;
  const fileName = path.split('/')[2];
  const fileInfo = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + fileName
  );
  if (fileInfo.exists) {
    imageUri = fileInfo.uri;
  } else {
    let fileUri;
    const createTask = (uri) => {
      fileUri = uri;
    };
    await downloadImage(filePath, fileName, createTask);
    imageUri = fileUri;
  }
  return imageUri;
}

async function downloadImage(url, fileName, functionToUse) {
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + fileName
  );
  try {
    const { uri } = await downloadResumable.downloadAsync();
    functionToUse(uri);
  } catch (error) {
    setError(error.message || 'Something went wrong!');
  }
}

export async function uploadProductImage(imageUri, authToken) {
  const uploadResult = await FileSystem.uploadAsync(
    URLs.add_product_image_url,
    imageUri,
    {
      fieldName: 'photo',
      httpMethod: 'PATCH',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    }
  );

  const result = JSON.parse(uploadResult.body);
  return result;
}

export async function uploadUserPhoto(imageUri, authToken) {
  const uploadResult = await FileSystem.uploadAsync(
    URLs.update_user_photo_url,
    imageUri,
    {
      fieldName: 'userphoto',
      httpMethod: 'PATCH',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    }
  );
  const result = JSON.parse(uploadResult.body);
  return result;
}
