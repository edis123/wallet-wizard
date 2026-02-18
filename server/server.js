const express = require('express')
const app = express();//backend

const cors = require('cors');//connects backend to frontend
const PORT = 3100

app.use(cors())
const path = require('path');
const result = require('dotenv').config({ path: path.resolve(__dirname, '../server/.env.development') });

app.get("/api/home", (req, res)=>{

    res.json({status : "OK" ,message:"Welcome to wallet Wizzard Project"})

})

app.get("/api/transaction", async (req, res) => {
  let client
  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('SELECT * FROM transaction');
    res.json(resp.rows);
  } catch (err) {
    console.error(err);
    res.json({error: err});
  } finally {
    client?.release();
  }
});
app.listen(PORT,()=>{

 console.log(`Server is running on port ${PORT}`)


})