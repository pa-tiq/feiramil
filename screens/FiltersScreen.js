import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CityPickButton from '../components/ui/CItyPickButton';
import FloatingButton from '../components/ui/FloatingButton';
import Button from '../components/ui/Button';
import { UserContext } from '../store/user-context';

const FiltersScreen = ({ route }) => {
  const userContext = useContext(UserContext);
  const { params } = route;
  const { filters } = userContext;

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
    filters.forEach((filter) => {
      filterList.push(filter);
    });
    setLocationList(filterList);
  }, [filters]);

  useEffect(() => {
    if (params && params.city) {
      if (
        params.city === userContext.user.city &&
        params.state === userContext.user.state
      ) {
        return;
      }
      if (!newList[params.index]) {
        userContext.addCityFilter(params.city, params.state);
      } else {
        userContext.updateCityFilter(
          newList[params.index].id,
          params.city,
          params.state
        );
      }
    }
  }, [params]);

  const addLocation = () => {
    if (locationList[locationList.length - 1].city != null) {
      setLocationList((prevValue) => {
        return [...prevValue, { city: null, state: null, editable: true }];
      });
    }
  };

  const removeLocation = (locationId) => {
    if (locationList.length > 1) {
      userContext.removeCityFilter(locationList[locationId].id);
      setLocationList((prevValue) => {
        return [...prevValue.filter((item, idx) => idx !== locationId)];
      });
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
});
