import {combineReducers} from "@reduxjs/toolkit";
import auth from "./auth"
import categories from "./category"
import users from "./user"
import products from "./product"

const rootReducer = combineReducers({
    auth: auth,
    categories: categories,
    users: users,
    products: products
}) as any;

export default rootReducer;
