import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useEffect } from "react";
import { fetchRecipes } from "../features/recipes/recipesSlice";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(s => s.recipes);
  useEffect(() => { if (status==="idle") dispatch(fetchRecipes()); }, [status, dispatch]);
  const top = [...items].sort((a,b)=> (b.tags?.includes("top")?1:0) - (a.tags?.includes("top")?1:0) || b.time - a.time).slice(0,8);

  return (
    <section className="space-y-6">
      <div className="hero bg-base-100 rounded-2xl shadow">
        <div className="hero-content text-center">
          <div className="max-w-2xl py-10">
            <h1 className="text-4xl font-bold">Cook faster, eat better</h1>
            <p className="py-4">ค้นหาสูตรอาหารง่าย ๆ จัดแผนมื้อทั้งสัปดาห์ และบันทึกเมนูโปรดไว้ใน Cookbook ของคุณ</p>
            <Link to="/recipes" className="btn btn-primary">Browse Recipes</Link>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold">Featured</h2>
      {status==="loading" && <div className="loading loading-lg" />}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {top.map(r => <RecipeCard key={r.id} r={r} />)}
      </div>
    </section>
  );
}
