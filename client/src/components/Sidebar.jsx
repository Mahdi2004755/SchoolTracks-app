import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
      : "text-slate-300 hover:bg-slate-800 hover:text-white",
  ].join(" ");

export default function Sidebar() {
  return (
    <aside className="flex w-full flex-col border-b border-slate-800 bg-slate-950/80 p-4 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">SchoolTracks</p>
        <h1 className="text-xl font-bold text-white">Smart Assignment Tracker</h1>
        <p className="mt-1 text-sm text-slate-400">Plan study time where it moves the needle most.</p>
      </div>

      <nav className="flex flex-col gap-1">
        <NavLink to="/" end className={linkClass}>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Dashboard
        </NavLink>
        <NavLink to="/calculator" className={linkClass}>
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Grade impact calculator
        </NavLink>
      </nav>

      <div className="mt-auto hidden pt-8 text-xs text-slate-500 lg:block">
        Tip: mark finished work as completed so it drops out of your priority list.
      </div>
    </aside>
  );
}
