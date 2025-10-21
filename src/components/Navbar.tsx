import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const nav = [
    ["/", "Home"],
    ["/recipes","Recipes"],
    ["/planner","Planner"],
    ["/collection","My Cookbook"],
    ["/about","About"]
  ];
  return (
    <div className="navbar bg-base-100 shadow">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link className="text-xl font-bold" to="/">🍳 Recipe Shelf</Link>
        </div>
        <ul className="menu menu-horizontal gap-2">
          {nav.map(([to,label]) => (
            <li key={to}>
              <NavLink to={to} className={({isActive})=> isActive ? "active" : ""}>{label}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
