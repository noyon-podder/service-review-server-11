const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();


// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("server was running");
});


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tlsofwm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run () {

    const serviceCollection = client.db("justiceDB").collection('services');
   
    app.get('/homeService', async(req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query).limit(3);
        const services = await cursor.toArray();
        res.send(services); 
    })
}
run().catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server running port : ${port}`);
})