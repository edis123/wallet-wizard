require("dotenv").config();

const express = require("express");
const cors = require("cors");

const transactionItem = require("./routes/transactions");
const categoryItem = require("./routes/categories");
const title = require("./routes/title");
const authRouting = require("./routes/auth");
const authentication = require("./middleware/middleware.auth");

const app = express();
const PORT = process.env.PORT || 3100;

const corsOptions = {
  origin: "https://wallet-wizard-zxes.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://wallet-wizard-zxes.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors(corsOptions));
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