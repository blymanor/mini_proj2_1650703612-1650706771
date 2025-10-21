import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleFavorite } from "../features/collection/collectionSlice";
import type { Recipe } from "../types";

export default function RecipeCard({ r }: { r: Recipe }) {
  const dispatch = useAppDispatch();
  const favs = useAppSelector(s => s.collection.ids);
  const isFav = favs.includes(r.id);

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="aspect-[4/3] bg-base-300">
        {r.image ? <img src={r.image} alt={r.title} className="w-full h-full object-cover" /> :
          <div className="w-full h-full grid place-items-center text-3xl">{r.title.slice(0,1)}</div>}
      </figure>
      <div className="card-body">
        <h3 className="card-title">{r.title}
          <div className="badge badge-secondary">{r.time} min</div>
          <div className="badge">{r.difficulty}</div>
        </h3>
        <p className="line-clamp-2 text-sm opacity-80">{r.summary}</p>
        <div className="flex gap-2 flex-wrap">
          <div className="badge">{r.cuisine}</div>
          {(r.tags||[]).slice(0,2).map(t => <div key={t} className="badge badge-outline">{t}</div>)}
        </div>
        <div className="card-actions justify-between items-center">
          <Link to={`/recipe/${r.id}`} className="btn btn-primary btn-sm">Details</Link>
          <button onClick={() => dispatch(toggleFavorite(r.id))}
                  className={`btn btn-sm ${isFav ? "btn-accent" : "btn-outline"}`}>
            {isFav ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
