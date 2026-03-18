const path = require('path');
 require('dotenv').config({ path: path.resolve(__dirname, '../server/.env.development') });
require('dotenv').config()
 
const express = require('express')
const cors = require('cors');//connects backend to frontend
const prisma  = require("./db")

const transactionItem = require("./routes/transactions")
const categoryItem = require("./routes/categories")
const title = require("./routes/title")
const authRouting = require("./routes/auth")
const authentication = require("./middleware/middleware.auth")
const app = express();//backend
const PORT = 3100

app.use(cors({
  origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.options("*",cors())
app.use(express.json()) // for JSON body parsinng (IMPOSTANT)

app.get("/api/home", (req, res)=>{

    res.json({status : "OK" ,message:"Welcome to wallet Wizzard Project"})

})
//Prisma code
// app.get("/api/transaction", async(req, res )=>{
//    try{
//  const trans = await prisma.transaction.findMany();
 
//     if(trans.length ===0){
//        console.log("Empty table")
//        return res.status(200).json({message: "Empty Table"})
       
//     }
//     res.json(trans)
 
//    }
//    catch(error){

//     console.error("failed to get transactions ",error)
//     res.status(500).json({error:"Failed to get Transaction"})
//    }
// })

app.use("/api/auth",authRouting)
app.use(authentication)///enforces authemtication for the following operations
app.use("/api/title",title)
app.use("/api/categories",categoryItem)
app.use("/api/transactions", transactionItem)


//PG SQL
// app.get("/api/transaction", async (req, res) => {
//   let client
//   try {
//     client = await prisma.connect();
//     console.log('Got a connection from the DB');
//     const resp = await client.query('SELECT * FROM transaction');
//     res.json(resp.rows);
//   } catch (err) {
//     console.error(err);
//     res.json({error: err});
//   } finally {
//     client?.release();
//   }
// });
app.listen(PORT,()=>{

 console.log(`Server is running on port ${PORT}`)


})