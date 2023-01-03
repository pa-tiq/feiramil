import { Animated, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/styles';

function CustomTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={styles.rootContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0.4)),
        });

        return (
          <TouchableOpacity
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[{ flex: 1}, options.tabBarStyle && options.tabBarStyle]}
            key={label}
          >
            <Animated.Text style={[{ opacity }, styles.title]}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default CustomTabBar;

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    flexWrap: 'nowrap',
  },
});
