import { useAppSelector, useAppDispatch } from "../app/hooks";
import RecipeCard from "../components/RecipeCard";
import { clearFavorites } from "../features/collection/collectionSlice";

export default function Collection() {
  const favs = useAppSelector(s => s.collection.ids);
  const items = useAppSelector(s => s.recipes.items);
  const dispatch = useAppDispatch();
  const recipes = items.filter(r => favs.includes(r.id));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Cookbook</h1>
        {favs.length>0 && <button className="btn btn-sm btn-outline" onClick={()=>dispatch(clearFavorites())}>Clear All</button>}
      </div>
      {recipes.length === 0 ? (
        <div className="alert">ยังไม่มีเมนูที่บันทึกไว้ — ไปที่หน้า Recipes แล้วกด ☆ Save ได้เลย</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipes.map(r => <RecipeCard key={r.id} r={r} />)}
        </div>
      )}
    </section>
  );
}
