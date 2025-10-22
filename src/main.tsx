import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";

import App from "./pages/App";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Collection from "./pages/Collection";
import About from "./pages/About";
import RecipeDetail from "./pages/RecipeDetail";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "recipe/:id", element: <RecipeDetail /> },
      { path: "favorites", element: <Collection /> },
      { path: "planner", element: <Planner /> },
      { path: "about", element: <About /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
