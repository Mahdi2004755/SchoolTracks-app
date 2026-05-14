import React from "react";
import { gradeImpact } from "../utils/dates.js";

export default function GradeImpactCalculator() {
  const [weight, setWeight] = React.useState(25);
  const [expected, setExpected] = React.useState(85);

  const impact = gradeImpact(weight, expected);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">Grade impact calculator</h2>
        <p className="text-sm text-slate-400">
          Quick estimate:{" "}
          <span className="font-mono text-slate-200">final impact ≈ weight × expected grade</span>
          . This is a simple planning number, not a full course model.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Assignment weight (%)
          <input
            type="number"
            min={0}
            max={100}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Expected grade on assignment (0–100)
          <input
            type="number"
            min={0}
            max={100}
            value={expected}
            onChange={(e) => setExpected(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
        <p className="text-sm text-indigo-100">
          Estimated impact points:{" "}
          <span className="text-2xl font-bold text-white">{impact}</span>
        </p>
        <p className="mt-1 text-xs text-indigo-200/80">
          Example: 25% weight × 88 expected = {gradeImpact(25, 88)} impact points.
        </p>
      </div>
    </div>
  );
}
