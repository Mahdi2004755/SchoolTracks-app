import express from "express";
import cors from "cors";
import { initSchema } from "./db/database.js";
import assignmentsRouter from "./routes/assignments.js";

initSchema();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "SchoolTracks API" });
});

app.use("/assignments", assignmentsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`SchoolTracks API listening on http://localhost:${PORT}`);
});
