import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY = "recipeShelf:favorites";
type State = { ids: string[] };
const load = (): State => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{"ids":[]}'); }
  catch { return { ids: [] }; }
};
const save = (s: State) => localStorage.setItem(KEY, JSON.stringify(s));

const initialState: State = load();

const slice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.ids = state.ids.includes(id) ? state.ids.filter(x => x !== id) : [...state.ids, id];
      save(state);
    },
    clearFavorites: (state) => { state.ids = []; save(state); }
  },
});
export const { toggleFavorite, clearFavorites } = slice.actions;
export default slice.reducer;
