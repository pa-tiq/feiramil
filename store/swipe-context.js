import { createContext, useState } from 'react';
import { wait } from '../util/wait';

export const SwipeContext = createContext({
  swipe: true,
  disableSwipe: () => {},
  enableSwipe: () => {},
  enableSwipeDelay: () => {},
});

const SwipeContextProvider = ({ children }) => {
  const [swipe , setSwipe] = useState(true);

  const disableSwipe = () => {
    if(swipe){
      setSwipe(false);
    }
  }  
  
  const enableSwipe = () => {
    if(!swipe){
      setSwipe(true);
    }
  }  
  const enableSwipeDelay = () => {
    if(!swipe){
      wait(1000).then(() => setSwipe(true));
    }
  }

  const value = {
    swipe: swipe,
    disableSwipe: disableSwipe,
    enableSwipe: enableSwipe,
    enableSwipeDelay: enableSwipeDelay,
  };

  return <SwipeContext.Provider value={value}>{children}</SwipeContext.Provider>;
};

export default SwipeContextProvider;
