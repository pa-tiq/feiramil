import { Dimensions, Modal, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/styles';
import PinchableImageBox from '../ui/PinchableImageBox';

const screen = Dimensions.get('window');

export default function ImageModal({ isVisible, onClose, imageUri }) {
  return (
    <Modal
      animationType='fade'
      transparent={false}
      visible={isVisible}
    >
      <Pressable style={{ flex: 1, backgroundColor:Colors.background }} onPress={onClose}>
        <PinchableImageBox imageUri={imageUri} />
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 300,
    width: screen.width,
  },
});
