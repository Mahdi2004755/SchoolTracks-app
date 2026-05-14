import GradeImpactCalculator from "../components/GradeImpactCalculator.jsx";

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Grade impact calculator</h1>
        <p className="mt-1 text-slate-400">
          Estimate how strongly an assignment can shape your final mark using the same simple formula
          used across SchoolTracks.
        </p>
      </header>
      <GradeImpactCalculator />
    </div>
  );
}
