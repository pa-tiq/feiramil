import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import { Colors } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { mySQLTimeStampToDate } from '../../util/mySQLTimeStampToDate';
import LoadingOverlay from '../ui/LoadingOverlay';
import { useLayoutEffect, useState } from 'react';

const ProductItem = ({ product, onSelect }) => {
  const selectProductHandler = () => {
    onSelect(product.id);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [productItem, setProductItem] = useState({});

  useLayoutEffect(() => {
    setProductItem(product);
    setIsLoading(false);
  }, [product]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  let imagePreview = (
    <View style={styles.imageContainer}>
      <Ionicons
        style={styles.icon}
        name={'image-outline'}
        color={'white'}
        size={30}
      />
    </View>
  );

  if (productItem.imageUri) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: productItem.imageUri }} />
    );
  }

  return (
    <Pressable
      onPress={selectProductHandler}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      {imagePreview}
      <View style={styles.info}>
        <Text style={styles.title}>{productItem.title}</Text>
        <Text style={styles.description}>
          {productItem.description.length > 40
            ? `${productItem.description.substring(0, 40)}...`
            : productItem.description}
        </Text>
        <View style={styles.userData}>
          <Text style={[styles.line, styles.normalText]}>
            {`Postado por `}
            <Text style={styles.specialText}>{`${productItem.userName}`}</Text>
            <Text style={styles.normalText}>{` em `}</Text>
            <Text style={styles.specialText}>{`${mySQLTimeStampToDate(
              productItem.created_at
            )}`}</Text>
          </Text>
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
  },
  icon: {
    paddingVertical: 25,
  },
  pressed: {
    opacity: 0.5,
  },
  imageContainer: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    height: 100,
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
    flexDirection: 'row',
    marginVertical: 5,
  },
  line: {
    paddingVertical: 1,
  },
  specialText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: Colors.primary50,
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 12,
    color: 'white',
  },
});
