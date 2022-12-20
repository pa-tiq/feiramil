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
    await downloadImage(
      filePath,
      fileName,
      createTask
    );
    imageUri = fileUri;
  }
  return imageUri;
}

async function downloadImage(url,fileName, functionToUse){
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

export async function uploadProductImage(imageUri, authToken){
  const uploadResult = await FileSystem.uploadAsync(
    URLs.add_product_image_url,
    imageUri,
    {
      fieldName: 'productphoto',
      httpMethod: 'PATCH',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    }
  );
  const a = JSON.stringify(uploadResult,null,4);
  const b = await JSON.parse(a);
  console.log(b.body);
  return b.body
}
