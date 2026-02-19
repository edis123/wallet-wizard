const express = require('express')
const app = express();//backend
const prisma  = require("./db")
const cors = require('cors');//connects backend to frontend
const PORT = 3100

app.use(cors())
const path = require('path');
const result = require('dotenv').config({ path: path.resolve(__dirname, '../server/.env.development') });

app.get("/api/home", (req, res)=>{

    res.json({status : "OK" ,message:"Welcome to wallet Wizzard Project"})

})

app.get("/api/transaction", async(req, res )=>{
   try{

    // console.log("HIT /api/transaction on", req.socket.localPort);
 const trans = await prisma.transaction.findMany();
 
    if(trans.length ===0){
       console.log("Empty table")
       return res.status(200).json({message: "Empty Table"})
       
    }
    res.json(trans)
 
   }
   catch(error){

    console.error("failed to get transactions ",error)
    res.status(500).json({error:"Failed to get Transaction"})
   }
})







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