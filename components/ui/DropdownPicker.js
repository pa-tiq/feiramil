import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

function DropdownPicker({ icon, color, size, onPress, style }) {
  const [filterBankList, setFilterBankList] = useState(['oi', 'porra', 'fdp']);
  const [bankName, setBankName] = useState('');

  const filterBanks = value => {
    
    let filterData =
      bankList && bankList?.length > 0
        ? bankList?.filter(data =>
            data?.bank?.toLowerCase()?.includes(value?.toLowerCase()),
          )
        : [];
    setFilterBankList([...filterData]);
  };

  const onBankSelected = value => {
    setBankName(value);
    setFilterBankList([]);
  };

  return (
    <>
    <TextInput
      style={({ pressed }) => [styles.textInput, style, pressed && styles.pressed]}
      placeholder={'oi'}
      onChangeText={filterBanks}
    />
      <FlatList
        data={filterBankList}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onBankSelected(item?.bank)}>
              <Text>{item?.bank || ''}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.bank}
      />
      </>
  );
}

export default DropdownPicker;

const styles = StyleSheet.create({
  textInput: {
    margin:10,
  },
  pressed: {
    opacity: 0.7,
  },
});
