import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Collection from "./pages/Collection";
import Planner from "./pages/Planner";
import About from "./pages/About";

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="p-6 text-center opacity-70">Â© 2025 Recipe Shelf</footer>
      </div>
    </HashRouter>
  );
}