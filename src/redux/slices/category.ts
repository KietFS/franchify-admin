import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICategory} from "../../types/models";

export type IInputMode = 'INPUT_OTP' | 'INPUT_PHONE_NUMBER';

interface IInitialState {
    listCategory: ICategory[];
}

const initialState: IInitialState = {
    listCategory: [],
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setListCategory: (state, actions: PayloadAction<ICategory[]>) => {
            state.listCategory = actions.payload;
        },
    },
});

export const {setListCategory} = categorySlice.actions;
export default categorySlice.reducer;
