import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../../types/user";

export type IInputMode = "INPUT_OTP" | "INPUT_PHONE_NUMBER";
interface IInitialState {
  isAuth: boolean;
  accessToken: string;
  user: IUser | null;
  openSideBar: boolean;
}

const initialState: IInitialState = {
  isAuth: false,
  accessToken: "",
  user: null,
  openSideBar: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, actions: PayloadAction<boolean>) => {
      state.isAuth = actions.payload;
    },
    setAccessToken: (state, actions: PayloadAction<string>) => {
      state.accessToken = actions.payload;
    },
    setUser: (state, actions: PayloadAction<IUser | null>) => {
      state.user = actions.payload;
    },
    setOpenSideBar: (state, actions: PayloadAction<boolean>) => {
      state.openSideBar = actions.payload;
    },
  },
});

export const { setAuth, setUser, setOpenSideBar, setAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
