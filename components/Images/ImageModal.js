import { useRef } from 'react';
import { Dimensions, Modal, StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import FloatingButton from '../ui/FloatingButton';

const { width } = Dimensions.get('window');

export default function ImageModal({ isVisible, onClose, imageUri }) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const handlePinch = Animated.event([{ nativeEvent: { scale } }]);
  const handlePan = Animated.event([
    { nativeEvent: { translationX: translateX } },
  ]);
  return (
    <Modal animationType='fade' transparent={true} visible={isVisible}>
      <PanGestureHandler onGestureEvent={handlePan}>
        <Animated.View style={styles.modalContent}>
          <PinchGestureHandler onGestureEvent={handlePinch}>
            <Animated.Image
              style={[
                styles.image,
                { transform: [{ scale: scale }, { translateX: translateX }] },
              ]}
              source={{ uri: imageUri }}
            />
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      <FloatingButton icon={'close'} onPress={onClose} style={{ top: 40 }} />
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
    height: width,
    width: width,
  },
});
