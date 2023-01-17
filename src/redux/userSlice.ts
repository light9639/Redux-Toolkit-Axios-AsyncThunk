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

