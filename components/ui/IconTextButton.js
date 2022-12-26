import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/styles';

function IconTextButton({ children, onPress, icon, style, disabled }) {
  return (
    <Pressable
      style={({ pressed }) => [
        style,
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons style={styles.icon} name={icon} color={'white'} size={18} />
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

export default IconTextButton;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  pressed: {
    opacity: 0.7,
  },  
  disabled: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    color: 'white',
  },
});
