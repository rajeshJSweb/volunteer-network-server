const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7yox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("eventDb");
        const eventCollection = database.collection("events");
       //Create a post API

       app.post('/volunteers', async (req, res) => {
        const services = req.body;
           const result = await eventCollection.insertOne(services);
           console.log(result);
           res.json(result);
       })
        
        //Get api
        app.get('/volunteers', async (req, res) => {
            const result = await eventCollection.find({}).toArray();
            res.send(result)
            console.log(result);
       })
        

        //Delete user 

        app.delete('/deleteVolunteer/:id', async (req, res) => {
            const deleteUser = (req.params.id);
            const result = await eventCollection.deleteOne({_id:ObjectId(deleteUser)})
            res.send(result)
        })
      } finally {
        // await client.close();
      }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Volunteer database connected')
})

app.listen(port, () => {
    console.log('Running Server on port',port);
})