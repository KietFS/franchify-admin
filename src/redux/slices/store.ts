import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStore } from '@/types/models';

interface IInitialState {
  listStore: IStore[];
}

const initialState: IInitialState = {
  listStore: [],
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setListStore: (state, actions: PayloadAction<IStore[]>) => {
      state.listStore = actions.payload;
    },
  },
});

export const { setListStore } = storeSlice.actions;
export default storeSlice.reducer;
