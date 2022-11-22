const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();

const port = process.env.PORT || 5000;

//middle ware 
app.use(cors())
app.use(express.json())

function verifyJwt(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'unauthorized user'});
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
    if(err){
      return res.status(403).send({message: 'Forbidden Access'});
    }
    req.decoded = decoded;
    next();
  })
  
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tlsofwm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
      const servicesCollection = client.db('justice').collection('services');
      const reviewCollection = client.db('justice').collection('reviews');
      const usersCollection = client.db('justice').collection('users');
  
     app.get('/homeService', async(req, res) => {
        const query = {}
        const result = await servicesCollection.find(query).limit(3).toArray();
        res.send(result);
     })


      app.get('/services', async(req, res) => {
          const query = {}
          const result = await servicesCollection.find(query).sort({date: -1}).toArray();
          res.send(result);
      })

      app.get('/services/:id', async(req, res) => {
        const service = req.params.id;
        console.log(service);
        const query = {_id: ObjectId(service)}
        const result = await servicesCollection.findOne(query);
        res.send(result);
      })

      app.post('/services', async (req, res) => {
        const service = req.body;
        const result = await servicesCollection.insertOne(service);
        res.send(result);
      }) 

      app.get('/jwt', async(req, res) => {
        const email = req.query.email;
        const query = {email: email}
        const user = await usersCollection.findOne(query)

        if(user){
          const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1d'})
          return res.send({accessToken: token})
        }
        res.status(401).send({accessToken: ''})
      })

      app.post('/users', async (req, res) => {
        const user = req.body;
        console.log(user)
        const result = await usersCollection.insertOne(user);
        res.send(result);
      })
      //review server 
      app.get('/reviews/:id', async(req, res) => {
        const id = req.params.id;
        const query = {serviceId: id}
        const result = await reviewCollection.find(query).toArray();
        res.send(result); 
      })

      app.get('/reviews',verifyJwt, async(req, res) => {
        const email = req.query.email;

        const decodedEmail = req.decoded.email;
        if(email !== decodedEmail){
          return res.status(403).send({message: 'Forbidden access'})
        }

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
        const updateReview = req.body;
        const options = { upsert: true}
        const updatedDoc = {
          $set: {
            message: updateReview.message
          }
        }
        console.log(updateReview)
        const cursor = await reviewCollection.updateOne(filter, updatedDoc, options);
        res.send(cursor)
      })

      app.delete('/reviews/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)}
        const result = await reviewCollection.deleteOne(query);
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