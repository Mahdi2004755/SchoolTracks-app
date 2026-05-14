import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 lg:flex">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-8 lg:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
