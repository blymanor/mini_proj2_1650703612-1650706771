// src/pages/Planner.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecipes, Recipe } from "../features/recipes/recipesSlice";

const Planner = () => {
  const dispatch = useAppDispatch();
  const { recipes, status } = useAppSelector((s) => s.recipes);

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
        <div className="h-24 rounded-lg border border-base-300 bg-base-200/60 flex items-center justify-center">
          <span className="text-xs opacity-60">—</span>
        </div>
      );
    }

    return (
      <Link
        to={`/recipe/${r.id}`}
        className="
        h-24 rounded-lg border border-base-300 bg-base-100 hover:bg-base-200
        transition-colors grid grid-cols-[64px_minmax(0,1fr)] gap-3 p-3
      "
      >
        <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
          <img
            src={
              r.image ||
              `https://placehold.co/160x160/cccccc/ffffff?text=${encodeURIComponent(
                r.title
              )}`
            }
            alt={r.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.onerror = null;
              el.src = `https://placehold.co/160x160/cccccc/ffffff?text=${encodeURIComponent(
                r.title
              )}`;
            }}
          />
        </div>

        <div className="min-w-0 flex flex-col justify-center">
          <div className="font-medium text-sm truncate">{r.title}</div>

          <div className="flex flex-wrap items-center gap-1 mt-1 text-[11px] text-gray-500">
            <span className="whitespace-nowrap shrink-0 flex items-center gap-1">
              🕒 {r.time || 0} min
            </span>
            <span
              className={`
              badge badge-outline badge-sm whitespace-nowrap shrink-0
              overflow-hidden text-ellipsis px-2
            `}
            >
              {r.difficulty || "Medium"}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-10 min-h-screen">
      <div className="max-w-none w-full mx-auto">
        <div className="relative mb-6 flex justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-center">
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

        <div className="md:hidden space-y-4">
          {days.map((day, dIdx) => (
            <div
              key={day}
              className="card bg-base-100 border border-base-300 shadow-sm"
            >
              <div className="card-body">
                <h2 className="card-title text-lg">{day}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {meals.map((m, mIdx) => (
                    <div key={m} className="space-y-2">
                      <div className="text-xs uppercase opacity-60">{m}</div>
                      <Cell r={getSlotRecipe(dIdx, mIdx)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full table-fixed">
            <colgroup>
              <col style={{ width: "160px" }} /> {/* Day */}
              <col style={{ width: "calc((100% - 160px)/3)" }} />
              <col style={{ width: "calc((100% - 160px)/3)" }} />
              <col style={{ width: "calc((100% - 160px)/3)" }} />
            </colgroup>

            <thead className="bg-base-200">
              <tr>
                <th className="text-xs uppercase tracking-wide sticky left-0 bg-base-200 z-10">
                  Day
                </th>
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
                  <th className="font-medium sticky left-0 bg-base-100 z-10">
                    {day}
                  </th>
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
    </div>
  );
};

export default Planner;
