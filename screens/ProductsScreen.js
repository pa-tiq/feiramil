import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { InteractionManager, StyleSheet, Text, View } from 'react-native';
import { interpolateNode } from 'react-native-reanimated';
import FiltersModal from '../components/Modals/FiltersModal';
import ProductsList from '../components/Products/ProductsList';
import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import SearchBar from '../components/ui/SearchBar';
import { Colors } from '../constants/styles';
import { ProductContext } from '../store/product-context';
import { UserContext } from '../store/user-context';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProductsScreen = ({ route, navigation }) => {
  const productContext = useContext(ProductContext);
  const userContext = useContext(UserContext);
  const { user, filters } = userContext;
  const { products } = productContext;
  const { params: routeParams } = route;
  const [searchText, setSearchText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [cityStateList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    productContext.triggerFeedReload();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (routeParams && routeParams.triggerUserProductsReload) {
      onRefresh();
      routeParams.trigger = null;
    }
  }, [routeParams]);

  useEffect(() => {}, [user, filters]);

  useEffect(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const updateSearchValue = (enteredText) => {
    setSearchText(enteredText);
  };

  const updateFilters = (enteredFilters) => {
    console.log(enteredFilters);
  };

  const showFilterScreen = () => {
    setShowFilter(true);
    navigation.navigate('FiltersScreen');
  };

  if (refreshing) {
    return <LoadingOverlay />;
  }

  let filtersText = <></>;

  if (userContext.user.filter){
    filtersText = (
      <View style={styles.topBar}>
        <Text style={styles.normalText}>
          Mostrando produtos em
          <Text
            style={styles.specialText}
          >{` ${userContext.user.city}`}</Text>
          <Text style={styles.normalText}> - </Text>
          <Text
            style={styles.specialText}
          >{`${userContext.user.state}`}</Text>
          <Text style={styles.normalText}>, </Text>
          {userContext.filters.map((filter, idx) => (
            <Fragment key={`filter_${idx}`}>
              <Text style={styles.specialText}>{` ${filter.city}`}</Text>
              <Text style={styles.normalText}> - </Text>
              <Text style={styles.specialText}>{`${filter.state}`}</Text>
              {userContext.filters.length - 1 === idx ? (
                <Text style={styles.normalText}>.</Text>
              ) : userContext.filters.length - 2 === idx ? (
                <Text style={styles.normalText}> e</Text>
              ) : (<Text style={styles.normalText}>, </Text>)}
            </Fragment>
          ))}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <SearchBar
            placeholder={'Pesquisa'}
            onUpdateValue={updateSearchValue}
          />
        </View>
        <View style={styles.filterButton}>
          <Button
            icon={'filter'}
            style={styles.button}
            onPress={showFilterScreen}
          >
            Filtros
          </Button>
        </View>
      </View>
      {userContext.user.filter ? filtersText : <></>}
      <ProductsList
        products={
          userContext.user.filter
            ? products.filter((item) => {
                let itemWillShow = false;
                if (
                  userContext.user.city === item.city &&
                  userContext.user.state === item.state
                ) {
                  return true;
                }
                userContext.filters.forEach((filter) => {
                  if (
                    item.city === filter.city &&
                    item.state === filter.state
                  ) {
                    itemWillShow = true;
                    return;
                  }
                });
                return itemWillShow;
              })
            : products
        }
        searchText={searchText}
        isLoading={productContext.isLoading}
      />
    </>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  searchBar: {
    flex: 3,
    marginRight: 5,
  },
  filterButton: {
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
  },
  specialText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.primary50,
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 15,
    color: 'white',
    flexDirection: 'row',
  },
});
