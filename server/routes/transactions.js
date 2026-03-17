///CRUD for Transaction
const express = require("express")
const prisma = require("../db")
const router = express.Router()
const {error} = require("node:console");
const { uptime } = require("node:process");

 


//create (with idempotency)

router.post("/", async (req,res)=>{
const userId = req.user.id
try{
  
 if(!userId) return res.status(401).json({error:"Unauthorized!"})
 const {amountCents, direction, currency, date, description, categoryId, clientRequestId} = req.body
 
//  if(amountCents=== 0 || amountCents === null || !direction || !date||!description){

//     return res.status(400).json({error:"BAD REQUEST /n Amount, Direction, Date , Description are required!"})
//  }
 if(clientRequestId){
    const existingTr = await prisma.transaction.findUnique({
 
     where:{
       userId_clientReqId:{userId,clientRequestId}  //use unique index 
     }

 }) 

 if(existingTr) res.status(200).json(existingTr)

 }
 

 const newTransaction  = await prisma.transaction.create({

    data: {
        userId,
        amountCents,
        direction,
        currency: currency?? undefined,   /// default if undefined
        date,
        description,
        categoryId: categoryId?? null,
        clientRequestId,
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
const userId = req.user.id
    try{

       if(!userId) return res.status(401).json("Unauthorized") // require the user id 
 
       let allTransactions = await prisma.transaction.findMany({


         where :{userId, deletedAt:null},
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
    const userId = req.user.id
try{


 if(!userId) return res.status(401).json("Unauthorized")

 const id = req.params.id                               // get tr id

 const  transaction = await prisma.transaction.findFirst({
        
    where:{id, userId, deletedAt:null},   // tr id and userid should pass
    include:{category:true}
 
 });
 res.status(200).json(transaction);

}catch(error){
 
    console.error(error)
    res.status(500).json({error:error.message})

}
})
//  Read by date // Queries by larger gaps can be implemented(maybe later)
router.get("/by-date", async(req,res)=>{
    const userId = req.user.id
try{


 if(!userId) return res.status(401).json({error:"Unauthorized"})

 const {date} = req.query                           // get the date 

 if(!date) return res.status(400).json({error:"Date required"})

 const start  = new Date(`${date}T00:00:00.000Z`) // create time interval for the whole day since hours are stored
if(isNaN(start.getTime())) return res.status(401).json({error:"Valide date required"})
 const end  = new Date(start)
 end.setUTCDate(end.getUTCDate()+1)     //start + 24h = 1 day


 const  transaction = await prisma.transaction.findMany({
        
    where:{date:{gte:start, lt:end},  //gte: >=   , lt: <  (  time gap)  
     userId},
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
    const userId = req.user.id
try{


 if(!userId) return res.status(401).json("Unauthorized")

 const id = req.params.id                               // get tr id
 const {amountCents, direction, currency,date,description,categoryId} = req.body
 const  transaction = await prisma.transaction.findFirst({
    where:{id, userId},   // tr id and userid should pass
 });
 
 if(!transaction) return res.status(404).json({error:"NOt Faound"})


   const data = {};

    if (amountCents !== undefined) data.amountCents = amountCents;
    if (direction !== undefined) data.direction = direction;
    if (currency !== undefined) data.currency = currency;
    if (date !== undefined) data.date = date;
    if (description !== undefined) data.description = description;
    if (categoryId !== undefined) data.categoryId = categoryId;

  const transUpdated = await prisma.transaction.update({
    where:{id},
    data,
      include: {
    category: true
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
    const userId = req.user.id
 try{
   if(!userId) return res.status(401).json("Unauthorized")
    const id  = req.params.id

const  transaction = await prisma.transaction.findFirst({
    where:{id, userId,deletedAt:null},   // tr id and userid should pass
 });
 
 if(!transaction) return res.status(404).json({error:"NOt Faound"})
  
  
     const del = await prisma.transaction.update({
    where:{id},
     data:{deletedAt:new Date()}

  })

  res.status(200).json({message:`${del} Deleted!`})
     
 }catch(error){
 
     console.error(error)
     res.status(500).json({error: error.message})
 }
  
})

module.exports = router