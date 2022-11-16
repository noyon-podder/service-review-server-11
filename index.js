const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


const app = express();

const port = process.env.PORT || 5000;

//middle ware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tlsofwm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
      const servicesCollection = client.db('justice').collection('services');
  
     app.get('/homeService', async(req, res) => {
        const query = {}
        const result = await servicesCollection.find(query).limit(3).toArray();
        res.send(result);
     })


      app.get('/services', async(req, res) => {
          const query = {}
          const result = await servicesCollection.find(query).toArray();
          res.send(result);
      })

      
    }
    finally{
  
    }
  }
  run().catch(console.log())

app.get('/', async(req, res) => {
    res.send('justice server was running')
})

app.listen(port, () => {
    console.log(`server running port is ${port}`)
})