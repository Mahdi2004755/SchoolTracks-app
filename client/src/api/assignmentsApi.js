const base = "";

async function parseJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function fetchAssignments() {
  const res = await fetch(`${base}/assignments`);
  if (!res.ok) throw new Error("Failed to load assignments");
  return res.json();
}

export async function fetchPriorities() {
  const res = await fetch(`${base}/assignments/priorities`);
  if (!res.ok) throw new Error("Failed to load priorities");
  return res.json();
}

export async function createAssignment(payload) {
  const res = await fetch(`${base}/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || "Could not create assignment");
  return data;
}

export async function updateAssignment(id, payload) {
  const res = await fetch(`${base}/assignments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || "Could not update assignment");
  return data;
}

export async function deleteAssignment(id) {
  const res = await fetch(`${base}/assignments/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const data = await parseJson(res);
    throw new Error(data?.error || "Could not delete assignment");
  }
}
