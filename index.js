const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
      const reviewCollection = client.db('justice').collection('reviews');
  
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

      app.get('/services/:id', async(req, res) => {
        const service = req.params.id;
        console.log(service);
        const query = {_id: ObjectId(service)}
        const result = await servicesCollection.findOne(query);
        res.send(result);
      })

      //review server 
      app.get('/reviews/:id', async(req, res) => {
        const id = req.params.id;
        const query = {serviceId: id}
        const result = await reviewCollection.find(query).toArray();
        res.send(result); 
      })

      app.get('/reviews', async(req, res) => {
        const email = req.query.email;
        const query = {userEmail: email}
        const cursor = await reviewCollection.find(query).sort({date: -1}).toArray();
        res.send(cursor);
      })

      app.post('/reviews', async(req, res) => {
       const reviews = req.body;
       const result = await reviewCollection.insertOne(reviews);
       res.send(result);
      })

      app.put('/reviews/:id', async(req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id)}
        const updatedDoc = {
          $set: {
            message: message
          }
        }
        const cursor = await reviewCollection.updateOne(filter, updatedDoc);
        res.send(cursor)
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