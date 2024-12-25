import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IStore} from '@/types/models';

interface IInitialState {
  listStore: IStore[];
  currentStore: IStore | null;
}

const initialState: IInitialState = {
  listStore: [],
    currentStore: null,
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setListStore: (state, actions: PayloadAction<IStore[]>) => {
      state.listStore = actions.payload;
    },
    setCurrentStore: (state, actions: PayloadAction<IStore>) => {
      state.currentStore = actions.payload;
    }
  },
});

export const { setListStore, setCurrentStore } = storeSlice.actions;
export default storeSlice.reducer;
