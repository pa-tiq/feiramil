import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import Button from '../components/ui/Button';
import { Colors } from '../constants/styles';
const cidades_IBGE = require('../constants/cidades.json');

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

async function wait2(timeout, waiting) {
  if (waiting) timeout = 1;
  await new Promise((resolve) => setTimeout(resolve, timeout));
}

const CityPick = ({ route, navigation }) => {
  const [cityInput, setCityInput] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filter, setFilter] = useState(false);

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

  const changeCityHandler = (enteredText) => {
    setCityInput(enteredText);
    //if (!refreshing) {
    //  onRefresh();
    //}
    setFilter(true);
  };

  const selectCityHandler = (item) => {
    setSelectedCity(item);
  };
  const selectStateHandler = (sigla, nome) => {
    setSelectedState({ sigla, nome });
    setCityInput('');
  };
  const cancelSelectCityHandler = () => {
    setSelectedCity(null);
  };
  const cancelSelectStateHandler = () => {
    setSelectedState(null);
    setSelectedCity(null);
  };
  const submitSelectCityHandler = () => {
    navigation.navigate(route.params.parentScreen, {
      city: selectedCity.cidade,
      state: selectedCity.estado,
      index: route.params.index
    });
  };

  useEffect(() => {
    if (!filter && !selectedState) return;
    let cidades = [];
    let estados = [];
    if (selectedState) {
      cidades_IBGE.estados
        .filter((item) => {
          return item.sigla === selectedState.sigla;
        })
        .forEach((estado) => {
          estado.cidades.forEach((cidade) => {
            if (
              cidade
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .includes(cityInput.toLowerCase())
            ) {
              cidades.push({ estado: estado.sigla, cidade: cidade });
            }
          });
        });
    } else {
      cidades_IBGE.estados.forEach((estado) => {
        if (
          estado.nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(cityInput.toLowerCase())
        ) {
          estados.push({ sigla: estado.sigla, nome: estado.nome });
        }
      });
    }
    setFilteredCities(cidades);
    setFilteredStates(estados);
    setFilter(false);
  }, [filter, selectedState]);

  let stateList = (
    <FlatList
      data={cidades_IBGE.estados}
      keyExtractor={(item) => item.sigla}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.itemContainer,
            pressed && styles.pressed,
          ]}
          onPress={selectStateHandler.bind(this, item.sigla, item.nome)}
        >
          <View>
            <Text style={styles.item}>{`${item.sigla} - ${item.nome}`}</Text>
          </View>
        </Pressable>
      )}
    />
  );

  if (cityInput && !selectedState) {
    stateList = (
      <FlatList
        data={filteredStates}
        keyExtractor={(item) => item.sigla}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.itemContainer,
              pressed && styles.pressed,
            ]}
            onPress={selectStateHandler.bind(this, item.sigla, item.nome)}
          >
            <View>
              <Text style={styles.item}>{`${item.sigla} - ${item.nome}`}</Text>
            </View>
          </Pressable>
        )}
      />
    );
  }

  let cityList;

  if (selectedState) {
    cityList = (
      <FlatList
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && styles.pressed,
        ]}
        data={filteredCities}
        keyExtractor={(item) => item.cidade}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.itemContainer,
              pressed && styles.pressed,
            ]}
            onPress={selectCityHandler.bind(this, item)}
          >
            <View>
              <Text
                style={styles.item}
              >{`${item.estado} - ${item.cidade}`}</Text>
            </View>
          </Pressable>
        )}
      />
    );
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
      value={cityInput}
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
    <View style={styles.rootContainer}>
      <View style={styles.inputContainer}>
        {selectedState && (
          <>
            <Text style={styles.label}>Estado</Text>
            <Text
              style={styles.finish}
            >{`${selectedState.sigla} - ${selectedState.nome}`}</Text>
            <Button
              style={{ marginBottom: 8 }}
              icon='close-outline'
              onPress={cancelSelectStateHandler}
            >
              Cancelar
            </Button>
          </>
        )}
        {selectedState ? (
          <Text style={styles.label}>Cidade</Text>
        ) : (
          <Text style={styles.label}>Estado</Text>
        )}
        {input}
      </View>
      {selectedState && <View style={[styles.cityListContainer, selectedCity && {marginTop: 0, marginHorizontal:5}]}>{cityList}</View>}
      {!selectedState && <View style={styles.stateListContainer}>{stateList}</View>}
    </View>
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
    paddingVertical: 6,
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
  cityListContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingBottom: 200,
  },  
  stateListContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingBottom: 80,
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
    minHeight:50,

  },
  buttonRight: {
    flex: 1,
    marginLeft: 2,
    minHeight:50,

  },
});
