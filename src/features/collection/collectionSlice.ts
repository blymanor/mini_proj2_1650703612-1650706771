import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  favoriteIds: string[];
}

const initialState: FavoritesState = {
  favoriteIds: JSON.parse(localStorage.getItem("favoriteRecipeIds") || "[]"),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state: FavoritesState, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      if (state.favoriteIds.includes(recipeId)) {
        state.favoriteIds = state.favoriteIds.filter(
          (id: string) => id !== recipeId
        );
      } else {
        state.favoriteIds.push(recipeId);
      }
      localStorage.setItem(
        "favoriteRecipeIds",
        JSON.stringify(state.favoriteIds)
      );
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
