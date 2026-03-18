const express = require("express")
const router = express.Router();




router.get("/",(req,res)=>{
   
    
  try{
 
    res.json( {title:process.env.NEXT_PUBLIC_APP_TITTLE})
  }catch(err){

    console.error(err)
    res.status(500).json({error:err.message})
  }
   
})

module.exports = router;