import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URLs } from '../constants/URLs';
import useHttp from '../hooks/use-http';
import { Alert } from 'react-native';
//import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

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
    async function getToken() {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) return;
      const getConfig = {
        url: URLs.tokenlogin_url,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + storedToken,
        },
      };
      const createTask = (response) => {
        if (!response.status || response.status !== 200) {
          throw new Error('tokenlogin failed');
        } else {
          setAuthToken(storedToken);
          setUserId(response.userId);
        }
      };
      setIsLoading(true);
      await httpObj.sendRequest(getConfig, createTask);
      if (httpObj.error) {
        await AsyncStorage.removeItem('token');
        Alert.alert(
          'Autenticação falhou',
          'Não foi possível realizar a autenticação rápida. Por favor, faça login novamente.'
        );
      }
      setIsLoading(false);
    }
    getToken();
  }, []);

  const authenticate = (token) => {
    setAuthToken(token);
    AsyncStorage.setItem('token', token);
  };

  const login = async (email, password) => {
    const hashedPassword = CryptoJS.SHA256(password);
    const postConfig = {  
      url: URLs.login_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: email,
        password: hashedPassword.toString(CryptoJS.enc.Hex),
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
    setUserId(null);
    AsyncStorage.removeItem('token');
  };
  const signup = async (email, password, name, om) => {
    const hashedPassword = CryptoJS.SHA256(password);
    const putConfig = {
      url: URLs.signup_url,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: email,
        password: hashedPassword.toString(CryptoJS.enc.Hex),
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
