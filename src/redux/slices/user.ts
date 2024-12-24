import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types/models';

interface IInitialState {
  users: IUser[];
}

const initialState: IInitialState = {
  users: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, actions: PayloadAction<IUser[]>) => {
      state.users = actions.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
