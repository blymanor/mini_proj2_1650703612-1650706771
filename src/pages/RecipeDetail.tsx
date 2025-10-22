import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecipeById } from "../features/recipes/recipesSlice";
import { toggleFavorite } from "../features/collection/collectionSlice";

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

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    selectedRecipe: recipe,
    detailStatus,
    error,
  } = useAppSelector((s) => s.recipes);
  const isFavorite = useAppSelector((s) =>
    s.favorites.favoriteIds.includes(id || "")
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
    }
  }, [id, dispatch]);

  if (detailStatus === "loading") return <LoadingSpinner />;
  if (detailStatus === "failed")
    return <ErrorMessage message={error || "Could not load recipe."} />;
  if (!recipe) return <div className="text-center p-10">Recipe not found.</div>;

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
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Steps</h3>
              {recipe.steps.length > 0 ? (
                <ul className="steps steps-vertical">
                  {recipe.steps.map((step, i) => (
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

export default RecipeDetail;
