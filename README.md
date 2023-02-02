# 🚀 Redux-Toolkit의 AsyncThunk 기능을 Axios로 구현한 연습 페이지입니다.
:octocat: https://light9639.github.io/Redux-Toolkit-Axios-AsyncThunk/

![light9639 github io_Redux-Toolkit-Axios-AsyncThunk_](https://user-images.githubusercontent.com/95972251/212826842-91c9718d-df7c-4d70-b72a-81fdee3ac035.png)

:sparkles: Redux-Toolkit의 AsyncThunk 기능을 Axios로 구현한 연습 페이지입니다. :sparkles:
## :tada: React 생성
- React 생성
```bash
npm create-react-app my-app
# or
yarn create react-app my-app
```

- vite를 이용하여 프로젝트를 생성하려면
```bash
npm create vite@latest
# or
yarn create vite
```
- 터미널에서 실행 후 프로젝트 이름 만든 후 React 선택, Typescirpt 선택하면 생성 완료.
## 🛩️ Redux-Toolkit, Axios 설치
- Redux-Toolkit 설치 명령어
```bash
npm install redux react-redux @reduxjs/toolkit
# or
yarn add redux react-redux @reduxjs/toolkit
```

- axios 설치 명령어
```bash
npm install axios
# or
yarn add axios
```

## ✒️ main.tsx, App.tsx, userSlice.ts, store.ts, useTypedSelector.ts, TypeBox.ts 수정 및작성
### :zap: main.tsx
- `react-redux`에서 `Provider` 함수 가져온 후 `store.ts` 파일을 import 한 후 <Provider store={store}></Provider>으로 <App />을 둘러싸면 Redux-Toolkit 사용준비 완료.
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
- redux 함수를 사용하고 싶으면 useSelector, useDispatch를 import 한 뒤에 사용하면 된다.
- 그러나 위의 2 함수는 type 적용이 안 되어 있기 때문에 useTypedSelector.ts의 useAppDispatch, useAppSelector를 가져와서 사용하는 것이 더 좋다.
```js
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "./redux/userSlice";
import React, { useEffect } from "react";
import { RootState } from "./redux/store";
import { Dispatch } from "redux";
import { useAppDispatch, useAppSelector } from "./hooks/useTypedSelector";

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  // RootState가 useSelector에서 state의 타입으로 사용된 것
  const { users, loading, error } = useAppSelector(state => state.users);

  return (
    <div className="App" style={{ margin: "0 auto", textAlign: "center" }}>
      <h1>Redux-tookit with Thunk</h1>
      <button onClick={() => dispatch(fetchUser())} style={{ display: "inline-block", padding: "10px 15px", borderRadius: "5px" }}>정보 가져오기</button>
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
- Redux-toolkit의 내장 기능인 createAsyncThunk를 생성 후 extraReducers 작성하게 되면 axios를 통한 자료 전송이 가능해진다.
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

// slice 생성
const usersSlice = createSlice({
    // slice 이름 정의
    name: "users",
    // 초기 값
    initialState,
    // 리듀서
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

// useSelector 사용시 타입으로 사용하기 위함
export type RootState = ReturnType<typeof store.getState>
// useDispatch를 좀 더 명확하게 사용하기 위함
export type AppDispatch = typeof store.dispatch

// slice를 내보냄
export default usersSlice.reducer;
```

### :zap: store.ts
- configureStore안에 userSlice의 reducer를 가져온 후 export 함으로써 함수를 사용 가능하게 함.
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
- useDispatch, useSelector의 타입은 번번히 지정하기보다 useAppDispatch, useAppSelector를 저장하고 import 함으로써 type 지정의 수고를 덜 수 있다.
```js
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### :zap: TypeBox.ts
- axios로 가져올 데이터의 타입 지정.
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

## 📎 출처
- 출처 1 : <a href="https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk">Redux-Toolkit 홈페이지</a>
- 출처 2 : <a href="https://velog.io/@rkio/Typescript-React-Redux-toolkitft.-axios-%EB%93%B1%EB%93%B1-%ED%99%9C%EC%9A%A9">Velog 글</a>
