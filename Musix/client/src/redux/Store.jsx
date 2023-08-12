import { configureStore } from '@reduxjs/toolkit';
import { shazamCoreApi } from './services/ShazamCore';
import playerReducer from './mediaPlayer/playerReducer';
import userReducer from './userAuthenticate/userReducer';

export const Store = configureStore({
  //this is boilerPlate code for all the redux application
  reducer: {
    [shazamCoreApi.reducerPath]: shazamCoreApi.reducer,
    player : playerReducer,
    user : userReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(shazamCoreApi.middleware),
});