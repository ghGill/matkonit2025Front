import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { recipeType } from "../types/types";

const initialState: Array<recipeType> = [];

const recipeSlice = createSlice({
    name: "recipe",
    initialState,
    reducers: {
        setRecipes: (_, action: PayloadAction<Array<recipeType> | []>) => {
            return action.payload;
        },

        addRecipe: (state, action: PayloadAction<recipeType>) => {
            return [
                ...state,
                action.payload
            ]
        },

        updateRecipe: (state, action: PayloadAction<recipeType>) => {
            return state.map((r: recipeType) => {
                return r.id === action.payload.id 
                        ? { ...action.payload}
                        : r
                })  
        },

        deleteRecipe: (state, action: PayloadAction<{id:number}>) => {
            return [...state.filter((r: recipeType) => r.id !== action.payload.id)];
        },
    },
});

export const { setRecipes, addRecipe, updateRecipe, deleteRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
