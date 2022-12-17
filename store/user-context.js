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
  updatePhoto: async (user) => {},
});

const createFormData = (photo) => {
  const data = new FormData();

  data.append('photo', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
  });

  return data;
};

const UserContextProvider = (props) => {
  const httpObj = useHttp();
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [userChanged, setUserChanged] = useState(false);

  useEffect(()=>{
    fetchUser();
    setUserChanged(false);
  },[userChanged])

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
        email: response.user.email,
        password: response.user.password,
        name: response.user.name,
        om: response.user.om,
        phone: response.user.phone,
        photo: response.user.photo,
      }
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
      let loadedUser = {};
      const getConfig = {
        url: URLs.update_user_url,
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + authContext.token,
        },
        body: user
      };
      const createTask = (response) => {
        if(response.changedRows > 0){
          setUserChanged(true);
        }
      };
      await httpObj.sendRequest(getConfig, createTask);
      if (httpObj.error) {
        throw new Error(httpObj.error);
      }
      return loadedUser;
  };  
  
  const updatePhoto = async (photo) => {
      let loadedUser = {};
      const getConfig = {
        url: URLs.update_user_photo_url,
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + authContext.token,
        },
        body: createFormData(photo)
      };
      const createTask = (response) => {
        if(response.changedRows > 0){
          setUserChanged(true);
        }
      };
      await httpObj.sendRequest(getConfig, createTask);
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
        updatePhoto: updatePhoto,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
