import { StyleSheet, View, Pressable } from 'react-native';

const PressableCard = (props) => {
  return (
    <Pressable onPress={props.onPress}>
      <View>{props.children}</View>
    </Pressable>
  );
};

export default PressableCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
});
