///This file handles the CRUD for accounts 


const express = require("express")
const prisma  = require("../db")
const router = express.Router();


// Create account 

router.get("/:id", async (req, res) => {
  const userId = req.params.id

  try{
    const user = await prisma.findUnique({
       where:{ userId}
  });

  res.status(201).json(user);
  }
  catch(error){
    console.error(error)
    res.status(500).json({error:error.message})

  }
  
});

    
module.export =router



