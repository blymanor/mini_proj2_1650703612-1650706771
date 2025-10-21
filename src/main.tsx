import "./index.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createHashRouter,
  RouterProvider,
  Outlet,
  Link,
  useParams,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  configureStore,
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

// --- CONFIGURATION ---
// IMPORTANT: Get your own API key from https://spoonacular.com/food-api
const SPOONACULAR_API_KEY = "5c449fe4217545e48cd681248dacc9e6";
const API_BASE_URL = "https://api.spoonacular.com/recipes";

// --- TYPES ---
interface Recipe {
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
  return {
    id: String(apiRecipe.id),
    title: apiRecipe.title || "Untitled Recipe",
    cuisine: apiRecipe.cuisines?.[0] || "International",
    difficulty: difficulty,
    time: apiRecipe.readyInMinutes || 0,
    servings: apiRecipe.servings || 0,
    summary: cleanSummary,
    image: apiRecipe.image,
    ingredients:
      apiRecipe.extendedIngredients?.map((ing: any) => ing.original) || [],
    steps:
      apiRecipe.analyzedInstructions?.[0]?.steps.map(
        (step: any) => step.step
      ) || [],
    tags: [
      ...(apiRecipe.vegetarian ? ["Vegetarian"] : []),
      ...(apiRecipe.vegan ? ["Vegan"] : []),
      ...(apiRecipe.glutenFree ? ["Gluten-Free"] : []),
      ...(apiRecipe.dairyFree ? ["Dairy-Free"] : []),
    ],
  };
};

// --- REDUX: RECIPES SLICE ---
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

// Async thunk to fetch a list of random recipes
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

// Async thunk to fetch a single recipe by its ID
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

// Async thunk to fetch multiple recipes by their IDs (for the favorites page)
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
    // The bulk endpoint returns an array of recipe objects, which need transformation.
    return data.map(transformSpoonacularRecipe);
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<RecipesState>) => {
    builder
      // Cases for fetching random recipes
      .addCase(fetchRecipes.pending, (state: RecipesState) => {
        state.status = "loading";
      })
      .addCase(
        fetchRecipes.fulfilled,
        (state: RecipesState, action: PayloadAction<Recipe[]>) => {
          state.status = "succeeded";
          state.recipes = action.payload;
        }
      )
      .addCase(fetchRecipes.rejected, (state: RecipesState, action: any) => {
        state.status = "failed";
        state.error = action.error?.message ?? "Failed to fetch recipes.";
      })
      // Cases for fetching a single recipe detail
      .addCase(fetchRecipeById.pending, (state: RecipesState) => {
        state.detailStatus = "loading";
      })
      .addCase(
        fetchRecipeById.fulfilled,
        (state: RecipesState, action: PayloadAction<Recipe>) => {
          state.detailStatus = "succeeded";
          state.selectedRecipe = action.payload;
        }
      )
      .addCase(fetchRecipeById.rejected, (state: RecipesState, action: any) => {
        state.detailStatus = "failed";
        state.error =
          action.error?.message ?? "Failed to fetch recipe details.";
      })
      // Cases for fetching favorite recipes
      .addCase(fetchFavoriteRecipes.pending, (state: RecipesState) => {
        state.favoritesStatus = "loading";
      })
      .addCase(
        fetchFavoriteRecipes.fulfilled,
        (state: RecipesState, action: PayloadAction<Recipe[]>) => {
          state.favoritesStatus = "succeeded";
          state.favoriteDetails = action.payload;
        }
      )
      .addCase(
        fetchFavoriteRecipes.rejected,
        (state: RecipesState, action: any) => {
          state.favoritesStatus = "failed";
          state.error =
            action.error?.message ?? "Failed to fetch favorite recipes.";
        }
      );
  },
});

// --- REDUX: FAVORITES SLICE (Personal Collection) ---
interface FavoritesState {
  favoriteIds: string[];
}

// Load initial state from LocalStorage
const initialFavoritesState: FavoritesState = {
  favoriteIds: JSON.parse(localStorage.getItem("favoriteRecipeIds") || "[]"),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialFavoritesState,
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
      // Persist to LocalStorage
      localStorage.setItem(
        "favoriteRecipeIds",
        JSON.stringify(state.favoriteIds)
      );
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

// --- REDUX: STORE CONFIGURATION ---
const store = configureStore({
  reducer: {
    recipes: recipesSlice.reducer,
    favorites: favoritesSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected
) => TSelected = useSelector;

// --- UI COMPONENTS ---

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <span className="loading loading-lg loading-spinner text-primary"></span>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div role="alert" className="alert alert-error">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>Error! {message}</span>
  </div>
);

const Navbar = () => {
  const themes = ["cupcake", "emerald", "dracula", "night", "winter"];
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "cupcake"
  );
  const favoriteCount = useAppSelector(
    (state: RootState) => state.favorites.favoriteIds.length
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/planner">Meal Planner</NavLink>
            </li>
            <li>
              <NavLink to="/favorites">My Collection</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          🍳 Recipe Shelf
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        {/* Desktop Menu */}
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/planner"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Meal Planner
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              My Collection
              {favoriteCount > 0 && (
                <div className="badge badge-secondary">+{favoriteCount}</div>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">
            Theme
            <svg
              width="12px"
              height="12px"
              className="h-2 w-2 fill-current opacity-60 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
          >
            {themes.map((theme: string) => (
              <li key={theme}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  value={theme}
                  checked={currentTheme === theme}
                  onChange={() => setCurrentTheme(theme)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-10">
    <aside>
      <p>
        Copyright © 2025 - All right reserved by Ingnop Khunra and Tipparida
        Rujisunkuntorn
      </p>
    </aside>
  </footer>
);

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state: RootState) =>
    state.favorites.favoriteIds.includes(recipe.id)
  );

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(recipe.id));
  };

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
    >
      <figure className="relative">
        <img
          src={
            recipe.image ||
            `https://placehold.co/400x225/a7c957/ffffff?text=${recipe.title}`
          }
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          className="btn btn-circle btn-ghost btn-sm absolute top-2 right-2 bg-black bg-opacity-40 text-white hover:bg-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={isFavorite ? "red" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </figure>
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-lg">{recipe.title}</h2>
          <div className="badge badge-outline">{recipe.cuisine}</div>
        </div>
        <p className="text-sm opacity-70 line-clamp-2">{recipe.summary}</p>
        <div className="card-actions justify-start mt-2">
          <div className="badge badge-ghost">🕒 {recipe.time} min</div>
          <div className="badge badge-ghost">🍽️ {recipe.servings} servings</div>
          <div className="badge badge-ghost">{recipe.difficulty}</div>
        </div>
      </div>
    </Link>
  );
};

// --- PAGES ---

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { recipes, status, error } = useAppSelector(
    (state: RootState) => state.recipes
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRecipes());
    }
  }, [status, dispatch]);

  const filteredRecipes = recipes.filter(
    (recipe: Recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="hero min-h-64 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Find Your Next Meal</h1>
            <p className="py-6">
              Discover delicious recipes from around the world. Start exploring
              now!
            </p>
            <input
              type="text"
              placeholder="Search for recipes..."
              className="input input-bordered w-full max-w-xs"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Featured Recipes
        </h2>
        {status === "loading" && <LoadingSpinner />}
        {status === "failed" && (
          <ErrorMessage message={error || "An unknown error occurred"} />
        )}
        {status === "succeeded" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <p className="text-center col-span-full">
                No recipes found for "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedRecipe: recipe,
    detailStatus,
    error,
  } = useAppSelector((state: RootState) => state.recipes);
  const isFavorite = useAppSelector((state: RootState) =>
    state.favorites.favoriteIds.includes(id || "")
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
    }
  }, [id, dispatch]);

  if (detailStatus === "loading") return <LoadingSpinner />;
  if (detailStatus === "failed")
    return <ErrorMessage message={error || `Could not load recipe.`} />;

  if (!recipe) {
    return <div className="text-center p-10">Recipe not found.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/3">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="card-body lg:w-2/3">
          <h1 className="card-title text-4xl font-bold">{recipe.title}</h1>
          <div className="flex flex-wrap gap-2 my-2">
            <div className="badge badge-accent">{recipe.cuisine}</div>
            <div className="badge badge-info">{recipe.difficulty}</div>
            <div className="badge badge-ghost">🕒 {recipe.time} min</div>
            <div className="badge badge-ghost">
              🍽️ {recipe.servings} servings
            </div>
          </div>
          <p className="py-4">{recipe.summary}</p>

          <button
            onClick={() => dispatch(toggleFavorite(recipe.id))}
            className={`btn ${isFavorite ? "btn-secondary" : "btn-primary"}`}
          >
            {isFavorite ? "Remove from Collection" : "Add to Collection"}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Ingredients</h3>
              <ul className="list-disc list-inside space-y-1">
                {recipe.ingredients.map((ing: string, i: number) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Steps</h3>
              {recipe.steps.length > 0 ? (
                <ul className="steps steps-vertical">
                  {recipe.steps.map((step: string, i: number) => (
                    <li key={i} className="step step-primary">
                      {step}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No instructions available.</p>
              )}
            </div>
          </div>
          <div className="card-actions justify-end mt-6">
            <button onClick={() => navigate(-1)} className="btn">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FavoritesPage = () => {
  const dispatch = useAppDispatch();
  const { favoriteIds } = useAppSelector((state: RootState) => state.favorites);
  const { favoriteDetails, favoritesStatus, error } = useAppSelector(
    (state: RootState) => state.recipes
  );

  useEffect(() => {
    // Fetch details of favorite recipes when the component mounts or favoriteIds change
    dispatch(fetchFavoriteRecipes(favoriteIds));
  }, [favoriteIds, dispatch]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        My Personal Collection
      </h1>
      {favoritesStatus === "loading" && <LoadingSpinner />}
      {favoritesStatus === "failed" && (
        <ErrorMessage message={error || "Could not load your collection."} />
      )}
      {favoritesStatus === "succeeded" && (
        <>
          {favoriteDetails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteDetails.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg">
                You haven't added any recipes to your collection yet.
              </p>
              <Link to="/" className="btn btn-primary mt-4">
                Explore Recipes
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const MealPlannerPage = () => {
  const dispatch = useAppDispatch();
  const { recipes, status } = useAppSelector((s: RootState) => s.recipes);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ] as const;

  const meals = ["Breakfast", "Lunch", "Dinner"] as const;

  useEffect(() => {
    if (status === "idle") dispatch(fetchRecipes());
  }, [status, dispatch]);

  const [shuffled, setShuffled] = React.useState<Recipe[]>([]);

  const shuffleRecipes = () => {
    if (!recipes || recipes.length === 0) return;
    const copy = [...recipes];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy.slice(0, 21));
  };

  useEffect(() => {
    if (status === "succeeded" && shuffled.length === 0) {
      shuffleRecipes();
    }
  }, [status]);

  const getSlotRecipe = (dayIdx: number, mealIdx: number) => {
    const index = dayIdx * meals.length + mealIdx;
    return shuffled[index] ?? null;
  };

  const Cell = ({ r }: { r: Recipe | null }) => {
    if (!r) {
      return (
        <div className="h-20 rounded-lg border border-base-300 bg-base-200/60 flex items-center justify-center">
          <span className="text-xs opacity-60">—</span>
        </div>
      );
    }
    return (
      <Link
        to={`/recipe/${r.id}`}
        className="h-20 rounded-lg border border-base-300 bg-base-100 hover:bg-base-200 transition-colors grid grid-cols-[64px_1fr] gap-3 p-3"
      >
        <div className="w-16 h-16 overflow-hidden rounded-md">
          <img
            src={
              r.image ||
              `https://placehold.co/160x160/cccccc/ffffff?text=${encodeURIComponent(
                r.title
              )}`
            }
            alt={r.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <div className="font-medium truncate">{r.title}</div>
          <div className="text-xs opacity-70 mt-1 flex items-center gap-2">
            <span>🕒 {r.time || 0} min</span>
            <span className="badge badge-outline badge-xs">
              {r.difficulty || "Medium"}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="relative mb-6 flex justify-center items-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-center">
          Weekly Meal Planner
        </h1>
        <button
          onClick={shuffleRecipes}
          disabled={status === "loading"}
          className="btn btn-sm md:btn-md btn-outline absolute right-0"
        >
          🎲 Shuffle Menu
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="text-xs uppercase tracking-wide w-28">Day</th>
              {meals.map((m) => (
                <th key={m} className="text-xs uppercase tracking-wide">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            {days.map((day, dIdx) => (
              <tr key={day} className="hover">
                <th className="font-medium">{day}</th>
                {meals.map((_, mIdx) => (
                  <td key={mIdx}>
                    <Cell r={getSlotRecipe(dIdx, mIdx)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="p-4 md:p-8 max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
    <p className="text-lg text-center mb-8">
      This Recipe Shelf application was created by passionate developers who
      love food and coding.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src="https://placehold.co/100x100/3498db/ffffff?text=P"
                alt="Pleng"
              />
            </div>
          </div>
          <h2 className="card-title mt-4">Tipparida Rujisunkuntorn</h2>
          <p>Student ID: 1650706771</p>
          <p>
            Frontend specialist with a love for React and clean UI. Enjoys
            cooking Thai food on weekends.
          </p>
          <p>Email: tipparida.ruj@bumail.net</p>
        </div>
      </div>
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
              <img
                src="https://placehold.co/100x100/e74c3c/ffffff?text=I"
                alt="Ing"
              />
            </div>
          </div>
          <h2 className="card-title mt-4">Ingnop Khunra</h2>
          <p>Student ID: 1650703612</p>
          <p>
            State management guru who ensures the app runs smoothly. Expert in
            baking sourdough bread.
          </p>
          <p>Email: ingnop.khun@bumail.net</p>
        </div>
      </div>
    </div>
  </div>
);

// --- ROUTER & APP SETUP ---

const AppLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Use hash-based router to avoid GitHub Pages 404 on refresh
const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "recipe/:id", element: <RecipeDetailPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "planner", element: <MealPlannerPage /> },
      { path: "about", element: <AboutPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);