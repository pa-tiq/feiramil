import { useNavigation } from '@react-navigation/core';
import { View, StyleSheet, Text } from 'react-native';
import IconTextButton from './IconTextButton';

const CityPickButton = (props) => {
  const navigation = useNavigation();

  const pickCityHandler = () => {
    navigation.navigate(props.cityPickToNavigate, {
      parentScreen: props.parentScreen, index: props.index
    });
  };

  let cityView = (
    <View style={styles.cityButton}>
      <IconTextButton icon={'location-outline'} onPress={pickCityHandler} />
    </View>
  );

  if (props.selectedCity && props.selectedState) {
    cityView = (
      <View style={styles.cityButton}>
        <IconTextButton
          icon={'location-outline'}
          onPress={pickCityHandler}
          disabled={!props.editable}
        >
          {`${props.selectedCity} - ${props.selectedState}`}
        </IconTextButton>
      </View>
    );
  }
  return (
    <>
      <View style={styles.city}>
        <Text style={styles.label}>{props.label ? props.label : 'Cidade'}</Text>
        {cityView}
      </View>
    </>
  );
};

export default CityPickButton;

const styles = StyleSheet.create({
  rootContainer: {
    paddingHorizontal: 20,
  },
  city: {
    flex: 1,
    marginLeft: 0,
  },
  cityButton: {
    marginVertical: 6,
    flex: 1,
  },
  label: {
    marginTop: 4,
    marginLeft: 4,
    color: 'white',
  },
});
