const express = require('express')
const app = express();//backend

const cors = require('cors');//connects backend to frontend
const PORT = 3100

app.use(cors())


app.get("/api/home", (req, res)=>{

    res.json({status : "OK" ,message:"Welcome to wallet Wizzard Project"})

})


app.listen(PORT,()=>{

 console.log(`Server is running on port ${PORT}`)


})