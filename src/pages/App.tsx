import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Footer = () => (
  <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-10">
    <aside>
      <p>
        Copyright © 2025 - All right reserved by Ingnop Khunra and Tipparida
        Rujisunkuntorn
      </p>
    </aside>
  </footer>
);

const App = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default App;
