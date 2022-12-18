import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URLs } from '../constants/URLs';
import useHttp from '../hooks/use-http';

export const AuthContext = createContext({
  token: '',
  userId: -1,
  isAuthenticated: false,
  isLoading: false,
  authenticate: () => {},
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const httpObj = useHttp();
  const [authToken, setAuthToken] = useState();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getToken(){
      setIsLoading(true);
      const storedToken = await AsyncStorage.getItem('token');
      setIsLoading(false);
      setAuthToken(storedToken);
    }
    getToken();
  }, []);

  const authenticate = (token) => {
    setAuthToken(token);
    AsyncStorage.setItem('token', token);
  };

  const login = async (email, password) => {
    const postConfig = {
      url: URLs.login_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: email,
        password: password,
      },
    };
    const createTask = (response) => {
      setAuthToken(response.token);
      setUserId(response.userId);
      AsyncStorage.setItem('token', response.token);
    };
    setIsLoading(true);
    await httpObj.sendRequest(postConfig, createTask);
    setIsLoading(false);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return;
  };
  const logout = async () => {
    setAuthToken(null);
    AsyncStorage.removeItem('token');
  };
  const signup = async (email, password, name, om) => {
    const putConfig = {
      url: URLs.signup_url,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: email,
        password: password,
        name: name,
        om: om,
      },
    };
    const createTask = (response) => {};
    setIsLoading(true);
    await httpObj.sendRequest(putConfig, createTask);
    setIsLoading(false);
    if (httpObj.error) {
      throw new Error(httpObj.error);
    }
    return;
  };

  const value = {
    token: authToken,
    userId: userId,
    isAuthenticated: !!authToken,
    isLoading: isLoading,
    authenticate: authenticate,
    login: login,
    signup: signup,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
