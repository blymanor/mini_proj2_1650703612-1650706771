import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  difficulty: string;
  time: number;
  servings: number;
  summary: string;
  image?: string;
  ingredients: string[];
  steps: string[];
  tags?: string[];
}

// --- CONFIGURATION ---
const SPOONACULAR_API_KEY = "6de0703ae9b847fb8e23dc37bb25fb4f";
const API_BASE_URL = "https://api.spoonacular.com/recipes";

// --- API Data Transformation ---
const transformSpoonacularRecipe = (apiRecipe: any): Recipe => {
  const cleanSummary = apiRecipe.summary
    ? apiRecipe.summary.replace(/<[^>]*>?/gm, "")
    : "No summary available.";

  let difficulty = "Medium";
  if (
    apiRecipe.readyInMinutes < 20 &&
    apiRecipe.extendedIngredients?.length < 10
  ) {
    difficulty = "Easy";
  } else if (
    apiRecipe.readyInMinutes > 60 ||
    apiRecipe.extendedIngredients?.length > 15
  ) {
    difficulty = "Hard";
  }

  const titleForPlaceholder = apiRecipe.title || "No Image";
  const imageType =
    apiRecipe.imageType || apiRecipe.image?.split(".").pop()?.split("?")[0];

  // ลองประกอบรูปตามลำดับความน่าเชื่อถือ
  const constructed =
    apiRecipe.id != null && imageType
      ? `https://spoonacular.com/recipeImages/${apiRecipe.id}-636x393.${imageType}`
      : apiRecipe.id != null
      ? `https://spoonacular.com/recipeImages/${apiRecipe.id}-636x393.jpg`
      : null;

  const image =
    apiRecipe.image || // มี URL ตรง ๆ
    apiRecipe.imageUrl || // บางทีฟิลด์นี้
    apiRecipe.imageUrls?.[0] || // เผื่อ array
    constructed || // URL pattern ที่ประกอบเอง
    `https://placehold.co/800x450/a7c957/ffffff?text=${encodeURIComponent(
      titleForPlaceholder
    )}`;

  return {
    id: String(apiRecipe.id),
    title: apiRecipe.title || "Untitled Recipe",
    cuisine: apiRecipe.cuisines?.[0] || "International",
    difficulty,
    time: apiRecipe.readyInMinutes || 0,
    servings: apiRecipe.servings || 0,
    summary: cleanSummary,
    image,
    ingredients:
      apiRecipe.extendedIngredients?.map((ing: any) => ing.original) || [],
    steps:
      apiRecipe.analyzedInstructions?.[0]?.steps.map((s: any) => s.step) || [],
    tags: [
      ...(apiRecipe.vegetarian ? ["Vegetarian"] : []),
      ...(apiRecipe.vegan ? ["Vegan"] : []),
      ...(apiRecipe.glutenFree ? ["Gluten-Free"] : []),
      ...(apiRecipe.dairyFree ? ["Dairy-Free"] : []),
    ],
  };
};

// --- STATE ---
interface RecipesState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  favoriteDetails: Recipe[];
  status: "idle" | "loading" | "succeeded" | "failed";
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  favoritesStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  selectedRecipe: null,
  favoriteDetails: [],
  status: "idle",
  detailStatus: "idle",
  favoritesStatus: "idle",
  error: null,
};

// --- THUNKS ---
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await fetch(
      `${API_BASE_URL}/random?apiKey=${SPOONACULAR_API_KEY}&number=24`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch recipes from Spoonacular API."
      );
    }
    const data = await response.json();
    return data.recipes.map(transformSpoonacularRecipe);
  }
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id: string) => {
    const response = await fetch(
      `${API_BASE_URL}/${id}/information?apiKey=${SPOONACULAR_API_KEY}&addRecipeInformation=true`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to fetch recipe with ID ${id}.`
      );
    }
    const data = await response.json();
    return transformSpoonacularRecipe(data);
  }
);

export const fetchFavoriteRecipes = createAsyncThunk(
  "recipes/fetchFavoriteRecipes",
  async (ids: string[]) => {
    if (ids.length === 0) return [];
    const response = await fetch(
      `${API_BASE_URL}/informationBulk?apiKey=${SPOONACULAR_API_KEY}&ids=${ids.join(
        ","
      )}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch favorite recipes.");
    }
    const data = await response.json();
    return data.map(transformSpoonacularRecipe);
  }
);

// --- SLICE ---
const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<RecipesState>) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchRecipes.fulfilled,
        (state, action: PayloadAction<Recipe[]>) => {
          state.status = "succeeded";
          state.recipes = action.payload;
        }
      )
      .addCase(fetchRecipes.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error?.message ?? "Failed to fetch recipes.";
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(
        fetchRecipeById.fulfilled,
        (state, action: PayloadAction<Recipe>) => {
          state.detailStatus = "succeeded";
          state.selectedRecipe = action.payload;
        }
      )
      .addCase(fetchRecipeById.rejected, (state, action: any) => {
        state.detailStatus = "failed";
        state.error =
          action.error?.message ?? "Failed to fetch recipe details.";
      })
      .addCase(fetchFavoriteRecipes.pending, (state) => {
        state.favoritesStatus = "loading";
      })
      .addCase(
        fetchFavoriteRecipes.fulfilled,
        (state, action: PayloadAction<Recipe[]>) => {
          state.favoritesStatus = "succeeded";
          state.favoriteDetails = action.payload;
        }
      )
      .addCase(fetchFavoriteRecipes.rejected, (state, action: any) => {
        state.favoritesStatus = "failed";
        state.error =
          action.error?.message ?? "Failed to fetch favorite recipes.";
      });
  },
});

export default recipesSlice.reducer;
