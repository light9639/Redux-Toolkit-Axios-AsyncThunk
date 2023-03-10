# ๐ Redux-Toolkit์ AsyncThunk ๊ธฐ๋ฅ์ Axios๋ก ๊ตฌํํ ์ฐ์ต ํ์ด์ง์๋๋ค.
:octocat: https://light9639.github.io/Redux-Toolkit-Axios-AsyncThunk/

![light9639 github io_Redux-Toolkit-Axios-AsyncThunk_](https://user-images.githubusercontent.com/95972251/212826842-91c9718d-df7c-4d70-b72a-81fdee3ac035.png)

:sparkles: Redux-Toolkit์ AsyncThunk ๊ธฐ๋ฅ์ Axios๋ก ๊ตฌํํ ์ฐ์ต ํ์ด์ง์๋๋ค. :sparkles:
## :tada: React ์์ฑ
- React ์์ฑ
```bash
npm create-react-app my-app
# or
yarn create react-app my-app
```

- vite๋ฅผ ์ด์ฉํ์ฌ ํ๋ก์ ํธ๋ฅผ ์์ฑํ๋ ค๋ฉด
```bash
npm create vite@latest
# or
yarn create vite
```
- ํฐ๋ฏธ๋์์ ์คํ ํ ํ๋ก์ ํธ ์ด๋ฆ ๋ง๋  ํ React ์ ํ, Typescirpt ์ ํํ๋ฉด ์์ฑ ์๋ฃ.
## ๐ฉ๏ธ Redux-Toolkit, Axios ์ค์น
- Redux-Toolkit ์ค์น ๋ช๋ น์ด
```bash
npm install redux react-redux @reduxjs/toolkit
# or
yarn add redux react-redux @reduxjs/toolkit
```

- axios ์ค์น ๋ช๋ น์ด
```bash
npm install axios
# or
yarn add axios
```

## โ๏ธ main.tsx, App.tsx, userSlice.ts, store.ts, useTypedSelector.ts, TypeBox.ts ์์  ๋ฐ์์ฑ
### :zap: main.tsx
- `react-redux`์์ `Provider` ํจ์ ๊ฐ์ ธ์จ ํ `store.ts` ํ์ผ์ `import` ํ ํ `<Provider store={store}></Provider>`์ผ๋ก `<App />`์ ๋๋ฌ์ธ๋ฉด `Redux-Toolkit` ์ฌ์ฉ์ค๋น ์๋ฃ.
```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```
### :zap: App.tsx
- `redux` ํจ์๋ฅผ ์ฌ์ฉํ๊ณ  ์ถ์ผ๋ฉด `useSelector`, `useDispatch`๋ฅผ `import` ํ ๋ค์ ์ฌ์ฉํ๋ฉด ๋๋ค.
- ๊ทธ๋ฌ๋ ์์ 2๊ฐ์ง ํจ์๋ค์ `type` ์ ์ฉ์ด ์ ๋์ด ์๊ธฐ ๋๋ฌธ์ `useTypedSelector.ts`์ `useAppDispatch`, `useAppSelector`๋ฅผ ๊ฐ์ ธ์์ ์ฌ์ฉํ๋ ๊ฒ์ด ๋ ์ข๋ค.
```js
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "./redux/userSlice";
import React, { useEffect } from "react";
import { RootState } from "./redux/store";
import { Dispatch } from "redux";
import { useAppDispatch, useAppSelector } from "./hooks/useTypedSelector";

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  // RootState๊ฐ useSelector์์ state์ ํ์์ผ๋ก ์ฌ์ฉ๋ ๊ฒ
  const { users, loading, error } = useAppSelector(state => state.users);

  return (
    <div className="App" style={{ margin: "0 auto", textAlign: "center" }}>
      <h1>Redux-tookit with Thunk</h1>
      <button onClick={() => dispatch(fetchUser())} style={{ display: "inline-block", padding: "10px 15px", borderRadius: "5px" }}>์ ๋ณด ๊ฐ์ ธ์ค๊ธฐ</button>
      {users?.length > 0 &&
        users.map((user) =>
          <div key={user.index} style={{ textAlign: "center", margin: "0 auto" }}>
            <img src={user.src} alt={user.alt} style={{ display: "block", maxWidth: "300px", margin: "25px auto", borderRadius: "15px" }} />
            {user.name}
          </div>
        )}
    </div>
  )
}
```

### :zap: userSlice.ts
- `Redux-toolkit`์ ๋ด์ฅ ๊ธฐ๋ฅ์ธ `createAsyncThunk`๋ฅผ ์์ฑ ํ `extraReducers` ์์ฑํ๊ฒ ๋๋ฉด `axios`๋ฅผ ํตํ ์๋ฃ ์ ์ก์ด ๊ฐ๋ฅํด์ง๋ค.
```js
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { store } from "./store";
import { CommonType } from "../Type/TypeBox";

interface initialType {
    users: CommonType[],
    loading: boolean,
    error: string | undefined
}

const initialState: initialType = {
    users: [],
    loading: false,
    error: ""
}

export const fetchUser = createAsyncThunk(
    'counterSlice/asyncUpFetch',
    async () => {
        return axios({
            method: "get",
            url: "https://raw.githubusercontent.com/light9639/Shoe-Store/main/data/Shoes.json"
        }).then(response => response.data.Kids);
    }
)

// slice ์์ฑ
const usersSlice = createSlice({
    // slice ์ด๋ฆ ์ ์
    name: "users",
    // ์ด๊ธฐ ๊ฐ
    initialState,
    // ๋ฆฌ๋์
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
        }),
            builder.addCase(fetchUser.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            }),
            builder.addCase(fetchUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
            })
    }
});

// useSelector ์ฌ์ฉ์ ํ์์ผ๋ก ์ฌ์ฉํ๊ธฐ ์ํจ
export type RootState = ReturnType<typeof store.getState>
// useDispatch๋ฅผ ์ข ๋ ๋ชํํ๊ฒ ์ฌ์ฉํ๊ธฐ ์ํจ
export type AppDispatch = typeof store.dispatch

// slice๋ฅผ ๋ด๋ณด๋
export default usersSlice.reducer;
```

### :zap: store.ts
- `configureStore`์์ `userSlice`์ `reducer`๋ฅผ ๊ฐ์ ธ์จ ํ `export` ํจ์ผ๋ก์จ ํจ์๋ฅผ ์ฌ์ฉ ๊ฐ๋ฅํ๊ฒ ํจ.
```js
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        users: userReducer
    }
});
```

### :zap: useTypedSelector.ts
- `useDispatch`, `useSelector`์ ํ์์ ๋ฒ๋ฒํ ์ง์ ํ๊ธฐ๋ณด๋ค `useAppDispatch`, `useAppSelector`๋ฅผ ์ ์ฅํ๊ณ  `import` ํจ์ผ๋ก์จ `type` ์ง์ ์ ์๊ณ ๋ฅผ ๋ ์ ์๋ค.
```js
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### :zap: TypeBox.ts
- `axios`๋ก ๊ฐ์ ธ์ฌ ๋ฐ์ดํฐ์ ํ์ ์ง์ .
```js
export type CommonType = {
    index: number;
    src: string;
    alt: string;
    name: string;
    info: string;
    price: string;
    Gender: string;
    href: string;
    star: {
        first: string;
        second: string;
        third: string;
        four: string;
        five: string;
    };
    Review: number;
    count: number;
}
```

## ๐ ์ถ์ฒ
- ์ถ์ฒ 1 : <a href="https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk">Redux-Toolkit ํํ์ด์ง</a>
- ์ถ์ฒ 2 : <a href="https://velog.io/@rkio/Typescript-React-Redux-toolkitft.-axios-%EB%93%B1%EB%93%B1-%ED%99%9C%EC%9A%A9">Velog ๊ธ</a>
