import { createContext, useContext, useState } from 'react';
import useHttp from '../hooks/use-http';
import { URLs } from '../constants/URLs';
import { AuthContext } from './auth-context';

export const UserContext = createContext({
  user: {},
  isLoading: false,
  error: null,
  fetchUser: async () => {},
  removeUser: (userId) => {},
  updateUser: (user) => {},
});

const UserContextProvider = (props) => {
  const httpObj = useHttp();
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    let loadedUser = {};
    const getConfig = {
      url: URLs.getuser_url,
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

  const updateUser = async (user) => {};

  return (
    <UserContext.Provider
      value={{
        user: user,
        isLoading: httpObj.isLoading,
        error: httpObj.error,
        fetchUser: fetchUser,
        removeUser: removeUser,
        updateUser: updateUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
