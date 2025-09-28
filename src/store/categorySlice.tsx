import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { categoryType } from "../types/types";

const initialState:Array<categoryType> = [];

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategories: (_, action: PayloadAction<Array<categoryType>>) => {
            return action.payload;
        },

        addCategory: (state, action: PayloadAction<categoryType>) => {
            return [
                ...state,
                action.payload
            ]
        },

        updateCategory: (state, action: PayloadAction<{id:number, name:string}>) => {
            return state.map((c: categoryType) => {
                return c.id === action.payload.id 
                        ? { ...c, name: action.payload.name}
                        : c
                })  
        },

        deleteCategory: (state, action: PayloadAction<{id:number}>) => {
            return [...state.filter((c: categoryType) => c.id !== action.payload.id)];
        },
    },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
