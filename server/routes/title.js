const express = require("express")
const router = express.Router();




router.get("/",(req,res)=>{
   
    
  try{
 
    res.json( {title:process.env.APP_TITLE|| "WALLET WIZZARD (v1.0)"})
  }catch(err){

    console.error(err)
    res.status(500).json({error:err.message})
  }
   
})

module.exports = router;