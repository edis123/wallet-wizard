const express  = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const prisma = require("../db")
const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET 
if(!JWT_SECRET) throw new Error("Missing JWT_SECRET!")

function signToken(userId){  //creates a token with id, sectret and exp

  return jwt.sign({sub:userId}, JWT_SECRET, {expiresIn:"1d"})

}

//register and automatically logged in 
// create user then use the id for creating a token
router.post("/register",async(req,res)=>{

try{

    const{email,password,name} = req.body

    if(!email|| !password) return res.status(400).json({error:"Email and password required!"})

    const emailUsed = await prisma.user.findUnique({
     
        where:{email}

    })

    if(emailUsed) return res.status(409).json({error:"Email already used!"})

    const passwordHash = await bcrypt.hash(password,12) // generate hash

    const newUser = await prisma.user.create({ // create user

       data:{
        email,
        passwordHash,
        name: name?? null
       },

       select:{
        id:true,
        email:true,
        name:true,
        currency:true,
        timezone:true
       }

    })

 const token = signToken(newUser.id) // get the token 
 res.status(201).json({newUser,token})
}catch(error){

    console.error(error)
    res.status(500).json({error: error.message})

}

})
 
//login only, a new token created eacht ime

router.post("/login", async(req,res)=>{
try{

   const{email,password}= req.body

   if(!email|| !password) return res.status(400).json({error:"Email and password required!"})

   const user = await prisma.user.findUnique({

    where:{email}

   })
   if(!user) return res.status(401).json({error:"Invalid User!"})

   const passwordCheck = await bcrypt.compare(password,user.passwordHash)
   if(!passwordCheck) return res.status(401).json({error:"Invalid password!"})
   
const token = signToken(user.id)  //create new token
res.json({ user: { id: user.id, email: user.email, name: user.name, currency: user.currency, timezone: user.timezone }, token })

}catch(error){

   console.error(error)
   res.status(500).json({error:error.message})

}


})

module.exports = router