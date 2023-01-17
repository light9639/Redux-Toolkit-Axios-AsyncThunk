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
