require("dotenv").config();

const express = require("express");
const cors = require("cors");

const transactionItem = require("./routes/transactions");
const categoryItem = require("./routes/categories");
const userItem = require("./routes/accounts")
const title = require("./routes/title");
const authRouting = require("./routes/auth");
const authentication = require("./middleware/middleware.auth");

const app = express();
const PORT = process.env.PORT || 3100;

const allowedOrigins = [
  "https://wallet-wizard-zxes.onrender.com",
  "https://wallet-wizard-frontend-s0e1.onrender.com",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/////////////////////////////////////////////////////////////////////////////////////////
app.use(express.json());

app.get("/api/home", (req, res) => {
  res.json({ status: "OK", message: "Welcome to Wallet Wizard Project" });
});

app.use("/api/auth", authRouting);
app.use("/api/title", title);

app.use(authentication);
app.use("/api/categories", categoryItem);
app.use("/api/transactions", transactionItem);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});