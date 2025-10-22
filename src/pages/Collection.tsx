import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchFavoriteRecipes } from "../features/recipes/recipesSlice";
import RecipeCard from "../components/RecipeCard";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <span className="loading loading-lg loading-spinner text-primary"></span>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div role="alert" className="alert alert-error">
    <span>Error! {message}</span>
  </div>
);

const Collection = () => {
  const dispatch = useAppDispatch();
  const { favoriteIds } = useAppSelector((s) => s.favorites);
  const { favoriteDetails, favoritesStatus, error } = useAppSelector(
    (s) => s.recipes
  );

  useEffect(() => {
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
              {favoriteDetails.map((recipe) => (
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

export default Collection;
