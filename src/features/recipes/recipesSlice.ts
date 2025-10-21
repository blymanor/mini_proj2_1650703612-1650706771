import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Recipe } from "../../types";

interface State { items: Recipe[]; status: "idle"|"loading"|"succeeded"|"failed"; error?: string; }
const initialState: State = { items: [], status: "idle" };

export const fetchRecipes = createAsyncThunk<Recipe[]>(
  "recipes/fetch",
  async () => {
    const res = await fetch("/data/recipes.json");
    if (!res.ok) throw new Error("Failed to load recipes");
    return (await res.json()) as Recipe[];
  }
);

const slice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchRecipes.pending, s => { s.status="loading"; })
     .addCase(fetchRecipes.fulfilled, (s,a) => { s.status="succeeded"; s.items=a.payload; })
     .addCase(fetchRecipes.rejected, (s,a) => { s.status="failed"; s.error=a.error.message; });
  }
});
export default slice.reducer;
