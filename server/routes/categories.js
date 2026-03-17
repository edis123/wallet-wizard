const express = require("express")
const router = express.Router();
const prisma = require("../db");



// Create

router.post("/", async (req,res)=>{
  
    const userId = req.user.id
    
try{
   if(!userId) return res.status(401).json({error:"Unauthorized Access!"})

  const{name, type} = req.body
 
  if(name==="" || name===null || !type ) return res.status(400).json({error:"Enter valid Name and Type!"})


    const cat = await prisma.category.create({

   data:{

    userId,
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

// get ALL categories

router.get("/", async(req,res)=>{

 const userId = req.user.id
    try{
    
        if(!userId)  return res.status(401).json({error:"Unauthorized Access!"})

         const cats = await prisma.category.findMany({

            where:{userId},
            orderBy:{name:"asc"}
         }
         )

         res.status(200).json(cats)

        }catch(error){

      console.error(error)
      res.status(500).json({error:error.message})


        }



})
// Get by name

router.get("/:name", async (req,res)=>{
     const userId = req.user.id
    try{
    
        if(!userId)  return res.status(401).json({error:"Unauthorized Access!"})
     
        const catName =req.params.name

        let cat = await  prisma.category.findFirst({

           where:{ 
            userId,
            name:catName
           }
        })
 
        res.status(200).json(cat)

    }catch(error){

        console.error(error)
        res.status(500).json({error:error.message})
    }

})

//update
router.put("/:name", async (req,res)=>{
      const userId = req.user.id
    try{
    
        if(!userId)  return res.status(401).json({error:"Unauthorized Access!"})
        const oldName = req.params.name
        const {name,type} = req.body

       if(name==="" || name===null || !type ) return res.status(400).json({error:"Enter valid Name and Type!"})

        let cat = await  prisma.category.findUnique({
           where:{ userId_name:{  //unique index for faster search
            userId,
            name:oldName
           }
            
           }
        })
       
        if(!cat) return res.status(404).json({error:"Category not found!"})


        const updated = await prisma.category.update({
      
            where:{userId_name:{userId,name:oldName}},
            data:{
            
            name,
            type

            }
        })
        res.status(200).json(updated)

    }catch(error){

        console.error(error)
        res.status(500).json({error:error.message})
    }

})

// Delete 


router.delete("/:name", async (req,res)=>{
const userId = req.user.id  
    try{
    
        if(!userId)  return res.status(401).json({error:"Unauthorized Access!"})
     
        const catName = req.params.name

        let catDeleted = await  prisma.category.delete({

           where:{ userId_name:{ userId, name:catName} }

        })
 
        res.status(200).json(catDeleted)

    }catch(error){

        console.error(error)
        res.status(500).json({error:error.message})
    }

})


module.exports = router;