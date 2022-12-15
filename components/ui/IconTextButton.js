import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/styles';

function IconTextButton({ children, onPress, icon }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons
        style={styles.icon}
        name={icon}
        color={Colors.primary800}
        size={18}
      />
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

export default IconTextButton;

const styles = StyleSheet.create({
  button: {
    flex:1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary800,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    color: Colors.primary800,
  },
});
