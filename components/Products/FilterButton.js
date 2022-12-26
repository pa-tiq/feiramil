import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/styles';
import Button from '../ui/Button';
import IconTextButton from '../ui/IconTextButton';

const FilterButton = () => {

  const [showFilter, setShowFilter] = useState(false)

  const showFilterScreen = () => {
    setShowFilter(true);
  }

  return (
    <>
    <Button icon={'filter'} style={styles.button} onPress={showFilterScreen}>Filtros</Button>
    {showFilter && 
      <View style={styles.filterScreen}>

      </View>
    }
    </>
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  rootContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  },
  button:{
    paddingVertical: 8
  },
  filterScreen:{
    position:'absolute',
    backgroundColor:Colors.primary50,
  }
});