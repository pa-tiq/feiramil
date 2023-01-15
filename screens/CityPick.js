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
import { Cidades_IBGE } from '../constants/cidades';

const CityPick = ({ route, navigation }) => {
  const [userInput, setUserInput] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const changeInputHandler = (enteredText) => {
    setUserInput(enteredText);
    if (!selectedState) {
      let estados = [];
      setIsLoading(true);
      Cidades_IBGE.estados.forEach((estado) => {
        if (
          estado.nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(enteredText.toLowerCase())
        ) {
          estados.push({ sigla: estado.sigla, nome: estado.nome });
        }
      });
      setIsLoading(false);
      setFilteredStates(estados);
    } else {
      let cidades = [];
      Cidades_IBGE.estados
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
                .includes(enteredText.toLowerCase())
            ) {
              cidades.push({ estado: estado.sigla, cidade: cidade });
            }
          });
        });
      setFilteredCities(cidades);
    }
  };

  const selectCityHandler = (item) => {
    setSelectedCity(item);
  };
  
  const selectStateHandler = (sigla, nome) => {
    let cidades = [];
    Cidades_IBGE.estados
      .filter((item) => {
        return item.sigla === sigla;
      })
      .forEach((estado) => {
        estado.cidades.forEach((cidade) => {
          cidades.push({ estado: estado.sigla, cidade: cidade });
        });
      });
    setFilteredCities(cidades);
    setSelectedState({ sigla, nome });
    setUserInput('');
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
      index: route.params.index,
      id: route.params.id,
    });
  };

  let stateList = (
    <FlatList
      data={Cidades_IBGE.estados}
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

  if (userInput && !selectedState) {
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
              >{`${item.cidade}`}</Text>
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
      onChangeText={changeInputHandler}
      value={userInput}
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
      {selectedState && (
        <View
          style={[
            styles.cityListContainer,
            selectedCity && { marginTop: 0, marginHorizontal: 5 },
          ]}
        >
          {cityList}
        </View>
      )}
      {!selectedState && (
        <View style={styles.stateListContainer}>{stateList}</View>
      )}
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
    minHeight: 50,
  },
  buttonRight: {
    flex: 1,
    marginLeft: 2,
    minHeight: 50,
  },
});
