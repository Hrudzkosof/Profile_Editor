import { createStore, combineReducers } from 'redux';
import { profileReducer } from '../reducers/profileReducer';
import filesReducer from '../reducers/filesReducer';

const rootReducer = combineReducers({
  profile: profileReducer, 
  files: filesReducer
});


export const store = createStore(rootReducer);