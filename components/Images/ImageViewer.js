import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/styles';
import LoadingOverlay from '../ui/LoadingOverlay';
import ImageModal from './ImageModal';
import { useState } from 'react';

const ImageViewer = (props) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const openImageModal = () => {
    setShowImageModal(true);
  };
  const closeImageModal = () => {
    setShowImageModal(false);
  };
  let imagePreview = (
    <Ionicons name={'images-outline'} color={'white'} size={30} />
  );

  if (props.isLoading) {
    return <LoadingOverlay />;
  } else if (props.uri) {
    imagePreview = <Image style={styles.image} source={{ uri: props.uri }} />;
  }

  return (
    <View style={styles.rootContainer}>
      <Pressable
        onPress={!props.disableModal ? (props.uri ? openImageModal : props.onPressNoImage) : null}
        style={({ pressed }) => [(pressed && !props.disableModal) && styles.pressed]}
      >
        <View
          style={
            props.imagePreviewContainerStyle
              ? props.imagePreviewContainerStyle
              : styles.imagePreviewContainer
          }
        >
          <View
            style={
              props.imagePreviewStyle
                ? props.imagePreviewStyle
                : styles.imagePreview
            }
          >
            {imagePreview}
          </View>
        </View>
      </Pressable>
      <ImageModal
        isVisible={showImageModal}
        onClose={closeImageModal}
        imageUri={props.uri}
      />
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
  pressed: {
    opacity: 0.7,
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    minWidth: 300,
    minHeight: 300,
    marginBottom: 15,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    marginVertical: 8,
  },
});
