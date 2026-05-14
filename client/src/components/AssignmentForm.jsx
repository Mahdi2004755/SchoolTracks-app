import React from "react";

const empty = {
  title: "",
  course_name: "",
  due_date: "",
  weight: 20,
  current_grade: 75,
  expected_grade: 85,
  status: "not_started",
  estimated_hours: 3,
};

export default function AssignmentForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = React.useState(initial || empty);

  React.useEffect(() => {
    setValues(initial || empty);
  }, [initial]);

  function update(field, v) {
    setValues((prev) => ({ ...prev, [field]: v }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title: values.title,
      course_name: values.course_name,
      due_date: values.due_date,
      weight: Number(values.weight),
      current_grade: Number(values.current_grade),
      expected_grade: Number(values.expected_grade),
      status: values.status,
      estimated_hours: Number(values.estimated_hours),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-h-[80vh] gap-4 overflow-y-auto p-1 sm:grid-cols-2"
    >
      <label className="block text-sm text-slate-300 sm:col-span-2">
        Title
        <input
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
          placeholder="e.g. Chapter 5 problem set"
        />
      </label>

      <label className="block text-sm text-slate-300 sm:col-span-2">
        Course name
        <input
          required
          value={values.course_name}
          onChange={(e) => update("course_name", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
          placeholder="e.g. ECON 1001"
        />
      </label>

      <label className="block text-sm text-slate-300">
        Due date
        <input
          required
          type="date"
          value={values.due_date}
          onChange={(e) => update("due_date", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
        />
      </label>

      <label className="block text-sm text-slate-300">
        Weight (% of final grade)
        <input
          required
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={values.weight}
          onChange={(e) => update("weight", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
        />
      </label>

      <label className="block text-sm text-slate-300">
        Current grade in course (%)
        <input
          required
          type="number"
          min={0}
          max={100}
          value={values.current_grade}
          onChange={(e) => update("current_grade", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
        />
      </label>

      <label className="block text-sm text-slate-300">
        Expected grade on this assignment (%)
        <input
          required
          type="number"
          min={0}
          max={100}
          value={values.expected_grade}
          onChange={(e) => update("expected_grade", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
        />
      </label>

      <label className="block text-sm text-slate-300">
        Completion status
        <select
          value={values.status}
          onChange={(e) => update("status", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
        >
          <option value="not_started">Not started</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      <label className="block text-sm text-slate-300">
        Estimated study hours
        <input
          required
          type="number"
          min={0}
          step={0.5}
          value={values.estimated_hours}
          onChange={(e) => update("estimated_hours", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
        />
      </label>

      <div className="flex items-end justify-end gap-2 sm:col-span-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {initial?.id ? "Save changes" : "Add assignment"}
        </button>
      </div>
    </form>
  );
}
