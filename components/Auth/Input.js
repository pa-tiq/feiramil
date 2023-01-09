import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '../../constants/styles';
import IconButton from '../ui/IconButton';

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  editable,
  placeholder,
}) {
  const [viewSecure, setViewSecure] = useState(false);

  const changeViewSecure = () => {
    setViewSecure((previousValue) => !previousValue);
  };

  return (
    <View style={styles.inputContainer}>
      <Text
        style={[
          styles.label,
          isInvalid && styles.labelInvalid,
          !(editable === undefined || editable === null)
            ? true
            : editable && styles.labelNotEditable,
        ]}
      >
        {label}
      </Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={[
            styles.input,
            isInvalid && styles.inputInvalid,
            !(editable === undefined || editable === null)
              ? true
              : editable && styles.inputNotEditable,
          ]}
          autoCapitalize={false}
          autoCapitalize='none'
          keyboardType={keyboardType}
          secureTextEntry={secure && !viewSecure}
          onChangeText={onUpdateValue}
          placeholder={placeholder}
          editable={
            editable === undefined || editable === null ? true : editable
          }
          value={value}
        />
        {secure && (
          <IconButton
            icon={viewSecure ? 'eye-outline' : 'eye-off-outline'}
            color={editable ? 'black' : 'grey'}
            size={24}
            onPress={changeViewSecure}
            style={styles.iconButton}
          />
        )}
      </View>
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: 'white',
    marginBottom: 4,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  iconButton: {
    position: 'absolute',
    alignSelf: 'center',
    marginLeft: '85%',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: 'white',
    borderRadius: 4,
    fontSize: 16,
    flex: 1,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
  inputNotEditable: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: 'grey',
    borderRadius: 4,
    fontSize: 16,
    flex: 1,
  },
  labelNotEditable: {
    color: 'grey',
    marginBottom: 4,
  },
});
