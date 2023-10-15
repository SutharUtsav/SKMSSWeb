import { configureStore } from "@reduxjs/toolkit";
import reducers from './reducer/index'

const store = configureStore({
    reducer:reducers,
    devTools: process.env.NODE_ENV !== 'production',
})

export default store;
