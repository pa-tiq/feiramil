import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ToastAndroid } from 'react-native';
import CityPickButton from '../components/ui/CItyPickButton';
import FloatingButton from '../components/ui/FloatingButton';
import Button from '../components/ui/Button';
import { UserContext } from '../store/user-context';
import { Colors } from '../constants/styles';

const FiltersScreen = ({ route }) => {
  const userContext = useContext(UserContext);
  const { params } = route;
  const { filters } = userContext;
  const [filtersChanged, setFiltersChanged] = useState(false);

  const [locationList, setLocationList] = useState([
    {
      city: userContext.user.city,
      state: userContext.user.state,
      editable: false,
      label: 'Sua cidade',
    },
  ]);

  useEffect(() => {
    let filterList = [];
    filterList[0] = locationList[0];
    if (!filterList[0].city) {
      filterList[0].label = 'Você ainda não definiu a sua cidade!';
      filterList[0].editable = false;
    }
    filters.forEach((filter) => {
      filterList.push(filter);
    });
    setLocationList(filterList);
  }, [filters]);

  useEffect(() => {
    if (filtersChanged) {
      userContext.fetchFilters();
      setFiltersChanged(false);
    }
  }, [filtersChanged]);

  useEffect(() => {
    if (params && params.city) {
      if (
        params.city === userContext.user.city &&
        params.state === userContext.user.state
      ) {
        return;
      }
      if (!params.id) {
        userContext.addCityFilter(params.city, params.state);
        setFiltersChanged(true);
      } else {
        userContext.updateCityFilter(params.id, params.city, params.state);
        setFiltersChanged(true);
      }
    }
  }, [params]);

  const addLocation = () => {
    if (
      locationList[locationList.length - 1].city != null ||
      locationList.length === 1
    ) {
      setLocationList((prevValue) => {
        return [...prevValue, { city: null, state: null, editable: true }];
      });
    }
  };

  const removeLocation = (locationId) => {
    if (locationList.length > 1) {
      if (locationList[locationId].city) {
        userContext.removeCityFilter(locationList[locationId].id);
      }
      setLocationList((prevValue) => {
        return [...prevValue.filter((item, idx) => idx !== locationId)];
      });
    }
  };

  const applyFiltering = () => {
    let validFilters = false;
    locationList.forEach((item) => {
      if (item.city) validFilters = true;
    });
    if (validFilters){
      userContext.applyFilters(!userContext.user.filter);
    }
    else{
      userContext.applyFilters(false);
      ToastAndroid.show('Nenhum filtro válido.', ToastAndroid.SHORT);
    }
  };

  return (
    <>
      <View style={styles.rootContainer}>
        <FlatList
          style={styles.list}
          data={locationList}
          keyExtractor={(_, idx) => idx}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <CityPickButton
                cityPickToNavigate={'FiltersCityPick'}
                parentScreen={'FiltersScreen'}
                selectedCity={item.city}
                selectedState={item.state}
                editable={item.editable}
                label={item.label}
                index={index}
                id={item.id}
              />
              {index !== 0 && (
                <View style={styles.buttonListItem}>
                  <Button
                    icon={'trash'}
                    onPress={removeLocation.bind(this, index)}
                  ></Button>
                </View>
              )}
            </View>
          )}
        />
        <Button
          style={
            userContext.user.filter
              ? styles.buttonApplyFilters
              : styles.buttonNotApplyFilters
          }
          icon={'checkmark-circle-outline'}
          onPress={applyFiltering}
        >
          Aplicar Filtros
        </Button>
      </View>
      <FloatingButton
        icon={'add'}
        color={'white'}
        size={24}
        onPress={() => {
          addLocation();
        }}
      />
    </>
  );
};

export default FiltersScreen;

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
    color: 'white',
  },
  list: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  listItem: {
    flexDirection: 'row',
  },
  buttonListItem: {
    marginHorizontal: 3,
    marginTop: 32,
  },
  buttonApplyFilters: {
    marginTop: 10,
    marginHorizontal: 13,
  },
  buttonNotApplyFilters: {
    marginTop: 10,
    marginHorizontal: 13,
    borderColor: Colors.primary500,
    backgroundColor: Colors.background,
  },
});
