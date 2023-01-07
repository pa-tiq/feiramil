import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import CityPickButton from '../components/ui/CItyPickButton';
import FloatingButton from '../components/ui/FloatingButton';
import { UserContext } from '../store/user-context';

const FiltersScreen = ({ route }) => {
  const userContext = useContext(UserContext);
  const { params } = route;

  const [locationList, setLocationList] = useState([
    {
      city: userContext.user.city,
      state: userContext.user.state,
      editable: false,
      label: 'Sua cidade',
    },
  ]);

  useEffect(() => {
    if (params && params.city) {
      if (
        params.city === userContext.user.city &&
        params.state === userContext.user.state
      ) {
        return;
      }
      //const newList = [
      //  ...locationList.slice(0, locationList.length - 1),
      //  { city: params.city, state: params.state, editable: true },
      //];
      let newList = [...locationList];
      newList[params.index] = { city: params.city, state: params.state, editable: true }
      setLocationList(newList);
    }
  }, [params]);

  const addLocation = () => {
    if (locationList[locationList.length - 1].city != null) {
      setLocationList((prevValue) => {
        return [...prevValue, { city: null, state: null, editable: true }];
      });
    }
  };

  const removeLocation = () => {
    if (locationList.length > 1) {
      setLocationList((prevValue) => {
        return [...prevValue.slice(0, locationList.length - 1)];
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
            <CityPickButton
              cityPickToNavigate={'FiltersCityPick'}
              parentScreen={'FiltersScreen'}
              selectedCity={item.city}
              selectedState={item.state}
              editable={item.editable}
              label={item.label}
              index={index}
            />
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
      <FloatingButton
        icon={'remove'}
        color={'white'}
        size={24}
        style={{ right: 100 }}
        onPress={() => {
          removeLocation();
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
});
