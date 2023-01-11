import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/styles';
import LoadingOverlay from '../ui/LoadingOverlay';

const ImageViewer = (props) => {
  let imagePreview = (
    <Ionicons name={'images-outline'} color={'white'} size={30} />
  );

  if (props.isLoading) {
    return <LoadingOverlay />;
  } else if (props.uri) {
    imagePreview = <Image style={styles.image} source={{ uri: props.uri }} />;
    //imagePreview = (
    //  <Ionicons name={'images-outline'} color={'white'} size={30} />
    //);
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.imagePreviewContainer}>
        <View style={styles.imagePreview}>{imagePreview}</View>
      </View>
    </View>
  );
};

export default ImageViewer;

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
    minWidth: 300,
    minHeight: 280,
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
});
