import { useState } from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { Colors } from '../../constants/styles';
import Button from '../ui/Button';
import IconTextButton from '../ui/IconTextButton';

const FiltersScreen = (props) => {
  
  return (
    <View style={styles.rootContainer}>
      <Text>Oie</Text>
    </View>
  );
};

export default FiltersScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
  },
  filterScreen: {
    position: 'absolute',
    backgroundColor: Colors.primary50,
  },
});
