import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice.js"

const store = configureStore({
    reducer : userReducer
});

export {store};