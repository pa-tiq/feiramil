import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import { Colors } from '../../constants/styles';

const ProductItem = ({ product, onSelect }) => {
  const selectProductHandler = () => {
    //onSelect(product.id);
  }
  return (
    <Pressable onPress={selectProductHandler} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <Image source={{ uri: product.imageUri }} style={styles.image}/>
      <View style={styles.info}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.address}>{product.address}</Text>
      </View>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  item: {
    flexDirection:'row',
    alignItems: 'flex-start',
    borderRadius:6,
    marginVertical:12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed:{
    opacity: 0.5,
  },
  image:{
    flex:1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    height:100
  },
  info:{
    flex:2,
    padding:12
  },
  title:{
    fontWeight:'bold',
    fontSize: 18,
    color: Colors.gray700,
  },
  address:{
    fontWeight:'bold',
    fontSize: 12,
    color: Colors.gray700,
  }
});
