import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import { Colors } from '../../constants/styles';

const ProductItem = ({ product, onSelect }) => {
  const selectProductHandler = () => {
    onSelect(product.id);
  };

  const mySQLTimeStampToDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    return `${day}/${month}/${year}`;
  };

  return (
    <Pressable
      onPress={selectProductHandler}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <Image source={{ uri: product.imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.userData}>
          <Text style={styles.normalText}>{`Postado por `}</Text>
          <Text style={styles.userName}>{`${product.userName}`}</Text>
          <Text style={styles.normalText}>{` em `}</Text>
          <Text style={styles.userName}>{`${mySQLTimeStampToDate(product.created_at)}`}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 6,
    marginVertical: 7,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 200,
  },
  pressed: {
    opacity: 0.5,
  },
  image: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    minHeight: 100,
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  description: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
  },  
  userData: {
    flexDirection:'row',
    marginVertical: 5
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 10,
    color: Colors.primary50,
  },  
  normalText: {
    fontWeight: 'normal',
    fontSize: 10,
    color: 'white',
  },
});
