// import { createStore } from 'redux';
// import counterReducer from './reducers/counterReducer';

// const store = createStore(counterReducer);   


// export default store;


import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './features/data/dataSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export default store;
