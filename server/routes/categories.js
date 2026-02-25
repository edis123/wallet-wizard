const express = require("express")
const router = express.Router();
const prisma = require("../db");


const User_ID = process.env.User_ID;



router.post("/", async (req,res)=>{
try{
   if(!User_ID) return res.status(401).json({error:"Unauthorized Access!"})

  const{name, type} = req.body
 
  if(name==="" || name===null || !type ) return res.status(400).json({error:"Enter valid Name and Type!"})

   
    const cat = await prisma.category.create({

   data:{

    userId: User_ID,
    name,
    type
   }

    })
 
     res.status(201).json(cat);
}
catch(error){

    console.error(error)
    res.status(500).json({error:error.message})
}

})