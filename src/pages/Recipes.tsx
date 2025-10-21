import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecipes } from "../features/recipes/recipesSlice";
import RecipeCard from "../components/RecipeCard";

const cuisines = ["All","Thai","Japanese","Korean","Chinese","Italian","Mexican","Indian","American","International"];

export default function Recipes() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(s => s.recipes);
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [maxTime, setMaxTime] = useState(120);
  const [sort, setSort] = useState<"title"|"time"|"difficulty">("title");

  useEffect(() => { if (status === "idle") dispatch(fetchRecipes()); }, [status, dispatch]);

  const filtered = useMemo(() => {
    let r = items.filter(x =>
      x.title.toLowerCase().includes(q.toLowerCase()) ||
      x.summary.toLowerCase().includes(q.toLowerCase())
    );
    if (cuisine !== "All") r = r.filter(x => x.cuisine === cuisine);
    r = r.filter(x => x.time <= maxTime);
    r.sort((a,b) => sort==="title" ? a.title.localeCompare(b.title) :
      sort==="time" ? a.time - b.time :
      a.difficulty.localeCompare(b.difficulty));
    return r;
  }, [items,q,cuisine,maxTime,sort]);

  if (status==="loading") return <div className="loading loading-lg" />;
  if (status==="failed") return <div className="alert alert-error">{error}</div>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Recipes</h1>
      <div className="flex flex-wrap gap-3 items-center">
        <input className="input input-bordered" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="select select-bordered" value={cuisine} onChange={e=>setCuisine(e.target.value)}>
          {cuisines.map(g=> <option key={g}>{g}</option>)}
        </select>
        <label className="flex items-center gap-2">Max Time
          <input type="range" min={5} max={180} value={maxTime} onChange={e=>setMaxTime(parseInt(e.target.value))} className="range range-primary w-48" />
          <span className="badge">{maxTime} min</span>
        </label>
        <select className="select select-bordered" value={sort} onChange={e=>setSort(e.target.value as any)}>
          <option value="title">Sort: Title</option>
          <option value="time">Sort: Time</option>
          <option value="difficulty">Sort: Difficulty</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(r => <RecipeCard key={r.id} r={r} />)}
      </div>
    </section>
  );
}
