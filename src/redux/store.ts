import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        users: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
