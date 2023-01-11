import { createContext, useContext, useEffect, useState } from 'react';
import useHttp from '../hooks/use-http';
import { URLs } from '../constants/URLs';
import { AuthContext } from './auth-context';

export const UserContext = createContext({
  user: {},
  filters: [],
  isLoading: false,
  error: null,
  fetchUser: async () => {},
  removeUser: (userId) => {},
  updateUser: async (user) => {},
  updatePhotoPath: async (user) => {},
  fetchFilters: async () => {},
  addCityFilter: async (city, state) => {},
  updateCityFilter: async (id, city, state) => {},
  removeCityFilter: async (city, state) => {},
  applyFilters: async (filtering) => {},
});

const UserContextProvider = (props) => {
  const httpObj = useHttp();
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [filters, setFilters] = useState([]);
  const [userChanged, setUserChanged] = useState(false);

  async function getUser(){
    await fetchUser();
  }  
  
  async function getFilters(){
    await fetchFilters();
  }

  useEffect(() => {
    getUser()
    getFilters();
  }, []);

  useEffect(() => {
    getUser();
    getFilters();
    setUserChanged(false);
  }, [userChanged]);

  const fetchUser = async () => {
    let loadedUser = {};
    const getConfig = {
      url: URLs.get_user_url,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
      },
    };
    const createTask = (response) => {
      loadedUser = {
        id: response.user.id,
        email: response.user.email,
        password: response.user.password,
        name: response.user.name,
        om: response.user.om,
        phone: response.user.phone,
        photo: response.user.photo,
        city: response.user.city,
        state: response.user.state,
        filter: response.user.filter
      };
      setUser(loadedUser);
    };
    await httpObj.sendRequest(getConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return loadedUser;
  };

  const removeUser = async (userId) => {};

  const updateUser = async (user) => {
    let responseStatus;
    const getConfig = {
      url: URLs.update_user_url,
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
      body: user,
    };
    const createTask = (response, status) => {
      responseStatus = status;
      if (response.changedRows > 0) {
        setUserChanged(true);
      }
    };
    await httpObj.sendRequest(getConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return responseStatus;
  };

  const updatePhotoPath = async (paths) => {
    const putConfig = {
      url: URLs.update_user_photo_url,
      method: 'PUT',
      body: {
        path: paths.path,
        oldpath: paths.oldpath,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.changedRows > 0) {
        setUserChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  const fetchFilters = async (city, state) => {
    const putConfig = {
      url: URLs.get_city_filters_url,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.status === 200) {
        setFilters(response.filters);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  const addCityFilter = async (city, state) => {
    const putConfig = {
      url: URLs.add_city_filter_url,
      method: 'POST',
      body: {
        city: city,
        state: state,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.status === 201) {
        let fil = filters;
        fil.push({ id: response.filterId, city: city, state: state });
        setFilters(fil);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  const updateCityFilter = async (id, city, state) => {
    const putConfig = {
      url: URLs.update_city_filter_url,
      method: 'PUT',
      body: {
        id: id,
        city: city,
        state: state,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.status === 201) {
        let fil = filters;
        fil.add({ id: response.filterId, city: city, state: state });
        setFilters(fil);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  const removeCityFilter = async (id) => {
    const putConfig = {
      url: URLs.remove_city_filter_url,
      method: 'DELETE',
      body: {
        id: id,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.status === 200) {
        let fil = filters.filter((item) => item.id != response.filterId);
        setFilters(fil);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };  
  
  const applyFilters = async (filtering) => {
    const putConfig = {
      url: URLs.apply_filtering_url,
      method: 'PUT',
      body: {
        filtering: filtering,
      },
      headers: {
        Authorization: 'Bearer ' + authContext.token,
        'Content-Type': 'application/json',
      },
    };
    const createTask = (response) => {
      if (response.status === 200) {
        setUserChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        filters: filters,
        isLoading: httpObj.isLoading,
        error: httpObj.error,
        fetchUser: fetchUser,
        removeUser: removeUser,
        updateUser: updateUser,
        updatePhotoPath: updatePhotoPath,
        fetchFilters: fetchFilters,
        addCityFilter: addCityFilter,
        updateCityFilter: updateCityFilter,
        removeCityFilter: removeCityFilter,
        applyFilters: applyFilters,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
