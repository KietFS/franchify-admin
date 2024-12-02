import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface IInitialState {
    products: IProduct[]
    storeProducts: IStoreProduct[]
}

const initialState: IInitialState = {
    products: [],
    storeProducts: []
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload;
        },
        setStoreProducts: (state, actions: PayloadAction<IStoreProduct[]>) => {
            state.storeProducts = actions.payload;
        }
    },
});

export const {setProducts, setStoreProducts} = productsSlice.actions;
export default productsSlice.reducer;
