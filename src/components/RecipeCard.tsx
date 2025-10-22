import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleFavorite } from "../features/collection/collectionSlice";
import { Recipe } from "../features/recipes/recipesSlice";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
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
      className="card h-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
    >
      <figure className="relative">
        <div className="w-full aspect-[16/9] overflow-hidden">
          <img
            src={
              recipe.image ||
              `https://placehold.co/800x450/a7c957/ffffff?text=${encodeURIComponent(
                recipe.title
              )}`
            }
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.onerror = null;
              el.src = `https://placehold.co/800x450/a7c957/ffffff?text=${encodeURIComponent(
                recipe.title
              )}`;
            }}
          />
        </div>

        <button
          onClick={handleFavoriteClick}
          className="btn btn-circle btn-ghost btn-sm absolute top-2 right-2 bg-black/40 text-white hover:bg-red-500"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
        <div className="flex justify-between items-start gap-2">
          <h2 className="card-title text-lg line-clamp-2">{recipe.title}</h2>
          <div className="badge badge-outline shrink-0">{recipe.cuisine}</div>
        </div>

        <p className="text-sm opacity-70 line-clamp-2">{recipe.summary}</p>

        <div className="mt-auto card-actions justify-start pt-2 flex-wrap gap-2">
          <span className="badge badge-ghost whitespace-nowrap shrink-0">
            🕒 {recipe.time} min
          </span>
          <span className="badge badge-ghost whitespace-nowrap shrink-0">
            🍽️ {recipe.servings}
          </span>
          <span className="badge badge-ghost whitespace-nowrap shrink-0">
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
