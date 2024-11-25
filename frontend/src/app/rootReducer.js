import {combineReducers} from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import tripsReducer from '../features/trips/tripsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripsReducer,
});

export default rootReducer;
