import * as FileSystem from 'expo-file-system';
import { useState, useCallback } from 'react';

const useFileSystem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadImage = useCallback(async (url, fileName, functionToUse) => {
    setIsLoading(true);
    setError(null);
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
  },[]);

  return {
    isLoading,
    error,
    downloadImage,
  }

}

export default useFileSystem;