import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import categories from './category';
import users from './user';
import products from './product';
import store from './store';

const rootReducer = combineReducers({
  auth: auth,
  categories: categories,
  users: users,
  products: products,
  store: store,
}) as any;

export default rootReducer;
