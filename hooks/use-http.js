import { useState, useCallback } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, functionToUse) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        headers: requestConfig.headers ? requestConfig.headers : {},
      });
      const data = await response
        .json()
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.log('vixe maria');
          console.log(err);
        });
      if (!response.ok) {
        if (requestConfig.method === 'POST') {
          if (response.status === 422) {
            if (data && data.message) throw new Error(data.message);
            else throw new Error('Esse e-mail já está sendo usado.');
          }
          if (response.status === 401) {
            if (data && data.message) throw new Error(data.message);
            else throw new Error('Senha errada.');
          }
          if (response.status === 404) {
            if (data && data.message) throw new Error(data.message);
            else
              throw new Error(
                'Não tem nenhum usuário cadastrado com esse e-mail.'
              );
          }
        }
        if (data && data.message) throw new Error(data.message);
        else throw new Error('Erro: Problema de conexão.');
      }
      functionToUse(data, response.status);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};
export default useHttp;
