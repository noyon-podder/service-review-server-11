const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

const port = process.env.PORT || 5000;

//middle ware 
app.use(cors())
app.use(express.json())


app.get('/', async(req, res) => {
    res.send('justice server was running')
})


app.listen(port, () => {
    console.log(`server running port is ${port}`)
})