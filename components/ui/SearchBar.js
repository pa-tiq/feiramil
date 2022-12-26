import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '../../constants/styles';
import IconButton from '../ui/IconButton';

function SearchBar({
  keyboardType,
  secure,
  onUpdateValue,
  value,
  editable,
  placeholder
}) {

  const [viewSecure, setViewSecure] = useState(false);

  const changeViewSecure = () => {
    setViewSecure(previousValue => !previousValue);
  }

  return (
    <View style={styles.inputContainer}>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.input}
          autoCapitalize={false}
          autoCapitalize='none'
          keyboardType={keyboardType}
          secureTextEntry={secure && !viewSecure}
          onChangeText={onUpdateValue}
          placeholder={placeholder}
          editable={editable}
          value={value}
        />
        {secure && <IconButton
          icon={viewSecure ? 'eye-outline' : "eye-off-outline"}
          color='black'
          size={24}
          onPress={changeViewSecure}
          style={styles.iconButton}
        />}
      </View>
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 8,
  },
  iconButton:{
    position: 'absolute',
    alignSelf: 'center',
    marginLeft: '85%'
  },
  input: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: Colors.primary500,
    borderRadius: 4,
    fontSize: 16,
    flex:1,
    color:'white'
  },
});
