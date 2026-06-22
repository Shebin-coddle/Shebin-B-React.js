import { createSlice } from "@reduxjs/toolkit"

type AuthState={
token:string|null;
userId:string|null;
roleId:string|null;
isAthenticated:boolean;
}

const initialState:AuthState={
  token:localStorage.getItem("token"),
  roleId:localStorage.getItem("role_id"),
  userId:localStorage.getItem("User_id"),
  isAthenticated:!!localStorage.getItem("token")
}

const authSlice=createSlice({
  name:"auth",
  initialState,
  reducers:{
    login(state,action){
      state.token=action.payload.token;
      state.userId=action.payload.userId;
      state.roleId=action.payload.role_id;
      state.isAthenticated=true;
    },
    logout(state){
      state.token=null;
      state.userId=null;
      state.roleId=null;
      state.isAthenticated=false;
    },
  },
});

export const {login,logout}=authSlice.actions
export default authSlice.reducer;