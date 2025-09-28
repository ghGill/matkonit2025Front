import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeSlice";
import categoryReducer from "./categorySlice";

export const store = configureStore({
  reducer: {
    categories : categoryReducer,
    recipes : recipeReducer,
  },
});
