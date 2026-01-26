import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user ? user :null;
      state.token =  token ? token :null;
      if (token) {
        localStorage.setItem("token", token);
      }
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      console.log("now the token is", state.token);
      console.log("now the user is", state.user);
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
