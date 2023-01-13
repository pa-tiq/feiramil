import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URLs } from '../constants/URLs';
import useHttp from '../hooks/use-http';
import { Alert } from 'react-native';
import CryptoJS from 'crypto-js';

export const AuthContext = createContext({
  token: '',
  userId: -1,
  isAuthenticated: false,
  emailConfirmed: false,
  isLoading: false,
  error: null,
  authenticate: () => {},
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const httpObj = useHttp();
  const [authToken, setAuthToken] = useState();
  const [userId, setUserId] = useState(null);
  const [emailConfirmed, setEmailConfirmed] = useState(true);

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
      try {
        await httpObj.sendRequest(getConfig, createTask);
      } catch (error) {
        await AsyncStorage.removeItem('token');
        Alert.alert(
          'Autenticação falhou',
          'Não foi possível realizar a autenticação rápida. Por favor, faça login novamente.'
        );
      }
    }
    getToken();
  }, []);

  const authenticate = (token) => {
    setAuthToken(token);
    AsyncStorage.setItem('token', token);
  };

  const login = async (email, password, confirmationCode) => {
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
        confirmationCode: confirmationCode
      },
    };
    const createTask = (response) => {
      if(response.emailConfirmed){
        setEmailConfirmed(true);
        setAuthToken(response.token);
        setUserId(response.userId);
        AsyncStorage.setItem('token', response.token);
      }
      else{
        setEmailConfirmed(false);
      }
    };
    await httpObj.sendRequest(postConfig, createTask);
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
    await httpObj.sendRequest(putConfig, createTask);
  };

  const value = {
    token: authToken,
    userId: userId,
    isAuthenticated: !!authToken,
    emailConfirmed: emailConfirmed,
    isLoading: httpObj.isLoading,
    error: httpObj.error,
    authenticate: authenticate,
    login: login,
    signup: signup,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
