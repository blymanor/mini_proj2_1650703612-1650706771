import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "../features/recipes/recipesSlice";
import collectionReducer from "../features/collection/collectionSlice";

export const store = configureStore({
  reducer: { recipes: recipesReducer, collection: collectionReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
