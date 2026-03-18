///This file handles the CRUD for accounts 


const express = require("express")
const prisma  = require("./db")
const router = express.Router();


// Create account 

router.post("/register", async (req, res) => {
  const { email, password,name } = req.body;

  // validate
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // hash password
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashed,
      name
    },
  });

  res.status(201).json(user);
});

    
module.export =router



