import { createContext, useContext, useEffect, useState } from 'react';
import useHttp from '../hooks/use-http';
import { URLs } from '../constants/URLs';
import { AuthContext } from './auth-context';

export const UserContext = createContext({
  user: {},
  isLoading: false,
  error: null,
  fetchUser: async () => {},
  removeUser: (userId) => {},
  updateUser: async (user) => {},
  updatePhotoPath: async (user) => {},
  addCityFilter: async (city,state) => {},
  removeCityFilter: async (city,state) => {},
});

const UserContextProvider = (props) => {
  const httpObj = useHttp();
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [userChanged, setUserChanged] = useState(false);

  useEffect(() => {
    fetchUser();
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
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authContext.token,
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
    return responseStatus
  };

  const updatePhotoPath = async (paths) => {
    const putConfig = {
      url: URLs.update_user_photo_url,
      method: 'PUT',
      body: {
        'path': paths.path,
        'oldpath': paths.oldpath,
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

  const addCityFilter = async (city, state) => {
    let loadedUser = {};
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
        setFeedProductsChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return loadedUser;
  };

  const removeCityFilter = async (city, state) => {
    let loadedUser = {};
    const putConfig = {
      url: URLs.remove_city_filter_url,
      method: 'DELETE',
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
      if (response.status === 200) {
        setFeedProductsChanged(true);
      }
    };
    await httpObj.sendRequest(putConfig, createTask);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return loadedUser;
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        isLoading: httpObj.isLoading,
        error: httpObj.error,
        fetchUser: fetchUser,
        removeUser: removeUser,
        updateUser: updateUser,
        updatePhotoPath: updatePhotoPath,
        addCityFilter: addCityFilter,
        removeCityFilter: removeCityFilter,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
