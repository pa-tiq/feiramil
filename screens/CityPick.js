import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Colors } from '../constants/styles';
const cidades_IBGE = require('../constants/cidades.json');

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

async function wait2(timeout, waiting) {
  if (waiting) timeout = 1;
  await new Promise((resolve) => setTimeout(resolve, timeout));
}

const CityPick = ({ navigation }) => {
  const [chosenCity, setChosenCity] = useState('');
  //const [chosenState, setChosenState] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filter, setFilter] = useState(false);
  //const [filterState, setFilterState] = useState(false);

  const [waiting, setWaiting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    setWaiting(true);
    wait2(100, waiting).then(() => {
      setRefreshing(false);
      setFilter(true);
    });
  }, []);
  //const [refreshingState, setRefreshingState] = useState(false);
  //const onRefreshState = useCallback(() => {
  //  setRefreshingState(true);
  //  wait(500).then(() => {
  //    setRefreshingState(false);
  //    setFilterState(true);
  //  });
  //}, []);

  const changeCityHandler = (enteredText) => {
    setChosenCity(enteredText);
    if (!refreshing) {
      onRefresh();
    }
  };

  const selectCityHandler = (item) => {
    setSelectedCity(item);
  };
  const cancelSelectCityHandler = () => {
    setSelectedCity(null);
  };
  const submitSelectCityHandler = () => {
    //props.setCityAndState({ city:selectedCity.cidade, state:selectedCity.estado });
    navigation.navigate('AddProduct', {
      city: selectedCity.cidade,
      state: selectedCity.estado,
    });
  };

  //const changeStateHandler = (enteredText) => {
  //  setChosenState(enteredText);
  //  if (!refreshingState) {
  //    onRefreshState();
  //  }
  //};

  useEffect(() => {
    if (!filter) return;
    let cidades = [];
    cidades_IBGE.estados.forEach((estado) => {
      estado.cidades.forEach((cidade) => {
        if (
          cidade
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(chosenCity.toLowerCase())
        ) {
          cidades.push({ estado: estado.sigla, cidade: cidade });
        }
      });
    });
    setFilteredCities(cidades);
    setFilter(false);
  }, [filter]);

  //useEffect(() => {
  //  if (!filterState) return;
  //  let estados = [];
  //  cidades_IBGE.estados.forEach((estado) => {
  //    if (
  //      estado.nome
  //        .normalize('NFD')
  //        .replace(/[\u0300-\u036f]/g, '')
  //        .toLowerCase()
  //        .includes(chosenState.toLowerCase())
  //    ) {
  //      estados.push(estado.nome);
  //    }
  //  });
  //  setFilteredCities(estados);
  //  setFilterState(false);
  //}, [filterState]);

  let cityList;

  if (refreshing) {
    cityList = <LoadingOverlay />;
  } else if (chosenCity.length === 0) {
    cityList = (
      <View style={[styles.itemContainer, { alignItems: 'center' }]}>
        <Text style={styles.item}>Nada inserido.</Text>
      </View>
    );
  } else {
    cityList = filteredCities.map((item, idx) => {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.itemContainer,
            pressed && styles.pressed,
          ]}
          key={idx}
          onPress={selectCityHandler.bind(this, item)}
        >
          <View>
            <Text style={styles.item}>{item.cidade}</Text>
          </View>
        </Pressable>
      );
    });
  }

  if (selectedCity) {
    cityList = (
      <View style={styles.imageButtonsContainer}>
        <View style={styles.buttonLeft}>
          <Button icon='close-outline' onPress={cancelSelectCityHandler}>
            Cancelar
          </Button>
        </View>
        <View style={styles.buttonRight}>
          <Button icon='checkmark-outline' onPress={submitSelectCityHandler}>
            Selecionar
          </Button>
        </View>
      </View>
    );
  }

  let input = (
    <TextInput
      style={styles.input}
      onChangeText={changeCityHandler}
      value={chosenCity}
    />
  );

  if (selectedCity) {
    input = (
      <Text
        style={styles.finish}
      >{`${selectedCity.cidade} - ${selectedCity.estado}`}</Text>
    );
  }

  return (
    <ScrollView style={styles.rootContainer}>
      {
        //<View style={styles.inputContainer}>
        //  <Text style={styles.label}>Estado</Text>
        //  <TextInput
        //    style={styles.input}
        //    onChangeText={changeStateHandler}
        //    value={chosenState}
        //  />
        //</View>
      }
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cidade</Text>
        {input}
      </View>
      <View style={styles.listContainer}>{cityList}</View>
    </ScrollView>
  );
};

export default CityPick;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  inputContainer: {
    paddingHorizontal: 5,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary500,
    borderBottomWidth: 2,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  finish: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary500,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary400,
    color: 'white',
    borderRadius: 4,
  },
  listContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  itemContainer: {
    padding: 10,
    borderRadius: 6,
    marginVertical: 7,
    elevation: 2,
    backgroundColor: Colors.primary500,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  item: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 19,
  },
  pressed: {
    opacity: 0.7,
  },
  imageButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  buttonLeft: {
    flex: 1,
    marginRight: 2,
  },
  buttonRight: {
    flex: 1,
    marginLeft: 2,
  },
});
