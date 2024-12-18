import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tripsReducer from '../features/trips/tripsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripsReducer,
  favorites: favoritesReducer,
});

export default rootReducer;