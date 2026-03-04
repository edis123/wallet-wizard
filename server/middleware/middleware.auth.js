const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET

if(!JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

//using req,res,next types from express
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

function authentication(req, res, next){

    const header = req.headers.authorization ///express types
     if(!header|| !header.startsWith("Bearer ")) return res.status(401).json({error:"Missing Bearer!"})

    const token = header.slice("Bearer ".length) // get the token part

    try{
   
        const tokenPayload = jwt.verify(token,JWT_SECRET) // retrurn decoded token data
        
        req.user = {id: tokenPayload.sub} //check this, might not work!!!!!!
        
        return next()// continue to the next route or finction

    }catch(error){
      console.error(error)
     return  res.status(500).json({error: "invalid TOKEN!"})
    }
    
    }

    module.exports = authentication