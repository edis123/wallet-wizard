///CRUD for Transaction
const express = require("express")
const prisma = require("../db")
const router = express.Router()
const {error} = require("node:console");
const { uptime } = require("node:process");

 const User_ID = process.env.User_ID;


//create 

router.post("/", async (req,res)=>{

try{
  
 if(!User_ID) return res.status(401).json({error:"Unauthorized!"})
 const {amountCents, direction, currency, date, description, categoryId} = req.body

 if(amountCents=== 0 || amountCents === null || !direction || !date||!description){

    return res.status(400).json({error:"BAD REQUEST /n Amount, Direction, Date , Description are required!"})
 }
   
 const newTransaction  = await prisma.transaction.create({

    data: {
        userId: User_ID,
        amountCents,
        direction,
        currency: currency?? undefined,   /// default if undefined
        date,
        description,
        categoryId: categoryId?? null,
      
    }

 })
     res.status(201).json(newTransaction);
}catch(error){

    console.error(error)
    res.status(500).json({error:error.message})
}

})
// Read ALl

router.get("/", async (req, res )=>{

    try{

       if(!User_ID) return res.status(401).json("Unauthorized").json // require the user id 
 
       let allTransactions = await prisma.findMany({


         where :{userId: User_ID},
         orderBy:{date:"desc"},
         include: {category:true}  // details about category
       })
    
       res.status(200).json(allTransactions);
    }catch(error){

       console.log(error)
       res.status(400).json({error:error.message})

    }
})

//  Read by id
router.get("/:id", async(req,res)=>{
try{


 if(!User_ID) return res.status(401).json("Unauthorized").json

 const id = req.params.id                               // get tr id

 const  transaction = await prisma.transaction.findFirst({
        
    where:{id, userId:User_ID},   // tr id and userid should pass
    include:{category:true}
 
 });
 res.status(200).json(transaction);

}catch(error){
 
    console.error(error)
    res.status(500).json({error:error.message})

}
})
//  Read by date // Queries by larger gaps can be implemented(maybe later)
router.get("/", async(req,res)=>{
try{


 if(!User_ID) return res.status(401).json({error:"Unauthorized"}).json

 const {date} = req.query                           // get the date 

 if(!date) return res.status(400).json({error:"Date required"})

 const start  = new Date(`${date}T00:00:00.000Z`) // create time interval for the whole day since hours are stored
if(isNaN(start.getTime())) return res.status(401).json({error:"Valide date required"})
 const end  = new Date(start)
 end.setUTCDate(end.getUTCDate()+1)     //start + 24h = 1 day


 const  transaction = await prisma.transaction.findMany({
        
    where:{date:{gte:start, lt:end},  //gte: >=   , lt: <  (  time gap)  
     userId:User_ID},
     orderBy:{date:"desc"},
    include:{category:true}
 
 });
 res.status(200).json(transaction);
}catch(error){
 
    console.error(error)
    res.status(500).json({error:error.message})

}
})  

// Update
router.put("/:id", async(req,res)=>{
try{


 if(!User_ID) return res.status(401).json("Unauthorized").json

 const id = req.params.id                               // get tr id
 const {amountCents, direction, currency,date,description,categoryId} = req.body
 const  transaction = await prisma.transaction.findFirst({
    where:{id, userId:User_ID},   // tr id and userid should pass
 });
 
 if(!transaction) return res.status(404).json({error:"NOt Faound"})

  const transUpdated = await prisma.transaction.update({
    where:{id},
    data:{
        amountCents,
        direction,
        currency,
        date,
        description,
        categoryId: categoryId??null
    }

  })

 res.status(200).json(transUpdated);

}catch(error){
 
    console.error(error)
    res.status(500).json({error:error.message})

}
})


// Delete

router.delete("/:id", async(req,res)=>{
 try{
   if(!User_ID) return res.status(401).json("Unauthorized").json
    const id  = req.params.id
const  transaction = await prisma.transaction.findFirst({
    where:{id, userId:User_ID},   // tr id and userid should pass
 });
 
 if(!transaction) return res.status(404).json({error:"NOt Faound"})
  
  
  await prisma.transaction.delete({
    where:{id}

  })

  res.status(201).json({message:`${transaction} Deleted!`})
     
 }catch(error){
 
     console.error(error)
     res.status(500).json({error: error.message})
 }
  
})

module.exports = router