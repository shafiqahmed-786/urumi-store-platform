const express = require("express");
const cors = require("cors");
const storeRoutes = require("./routes/stores");

const app = express();

const rateLimit = require("express-rate-limit");

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10
}));


// ✅ CORS FIRST
app.use(cors({
  origin: "http://localhost:5173",
}));

// Middleware
app.use(express.json());

// Routes
app.use("/stores", storeRoutes);

// Health
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
