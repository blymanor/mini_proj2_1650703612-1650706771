import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecipes } from "../features/recipes/recipesSlice";
import RecipeCard from "../components/RecipeCard";

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

const Home = () => {
  const dispatch = useAppDispatch();
  const { recipes, status, error } = useAppSelector((s) => s.recipes);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchRecipes());
  }, [status, dispatch]);

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="hero min-h-[40vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Find Your Next Meal
            </h1>
            <p className="py-4 md:py-6">
              Discover delicious recipes from around the world. Start exploring
              now!
            </p>
            <input
              type="text"
              placeholder="Search for recipes..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
            Featured Recipes
          </h2>

          {status === "loading" && <LoadingSpinner />}
          {status === "failed" && (
            <ErrorMessage message={error || "An unknown error occurred"} />
          )}

          {status === "succeeded" && (
            <div
              className="
                grid gap-4 sm:gap-5 lg:gap-6
                grid-cols-1
                xs:grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
              "
            >
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <div key={r.id} className="h-full">
                    <RecipeCard recipe={r} />
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full">
                  No recipes found for “{searchTerm}”
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
