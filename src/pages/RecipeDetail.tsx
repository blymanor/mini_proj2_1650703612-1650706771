import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import { fetchRecipes } from "../features/recipes/recipesSlice";
import { toggleFavorite } from "../features/collection/collectionSlice";

export default function RecipeDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, status } = useAppSelector(s => s.recipes);
  const favs = useAppSelector(s => s.collection.ids);

  useEffect(() => { if (status==="idle") dispatch(fetchRecipes()); }, [status, dispatch]);
  const r = items.find(x => x.id === id);

  if (status==="loading") return <div className="loading loading-lg" />;
  if (!r) return <div className="alert">Not found. <button className="link" onClick={()=>navigate(-1)}>Go back</button></div>;

  const isFav = favs.includes(r.id);

  return (
    <article className="grid md:grid-cols-3 gap-6">
      <div>
        <div className="aspect-[4/3] bg-base-300 rounded-xl overflow-hidden">
          {r.image ? <img src={r.image} alt={r.title} className="w-full h-full object-cover" /> : null}
        </div>
        <div className="mt-4 space-x-2">
          <span className="badge badge-secondary">{r.time} min</span>
          <span className="badge">{r.difficulty}</span>
          <span className="badge badge-outline">{r.cuisine}</span>
        </div>
      </div>
      <div className="md:col-span-2 space-y-3">
        <h1 className="text-3xl font-bold">{r.title}</h1>
        <p>{r.summary}</p>
        <div className="flex gap-2">
          <button className={`btn ${isFav?"btn-accent":"btn-outline"}`} onClick={()=>dispatch(toggleFavorite(r.id))}>
            {isFav ? "★ In My Cookbook" : "☆ Save to My Cookbook"}
          </button>
          <Link to="/recipes" className="btn">Back</Link>
        </div>
        <div className="divider" />
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <ul className="list-disc ml-6 space-y-1">{r.ingredients.map((it,i)=><li key={i}>{it}</li>)}</ul>
        <h2 className="text-xl font-semibold mt-4">Steps</h2>
        <ol className="list-decimal ml-6 space-y-2">{r.steps.map((s,i)=><li key={i}>{s}</li>)}</ol>
      </div>
    </article>
  );
}
