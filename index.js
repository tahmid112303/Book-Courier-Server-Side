const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())

const client = new MongoClient(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.fuph8ia.mongodb.net/?appName=Cluster0`);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

async function connectToMongoDB() {

    const myDB = client.db(`${process.env.USER}`);
    const bookCollection = myDB.collection("books");
    const userCollection = myDB.collection("users")

    // ADD USER
    app.post('/users', async(req,res)=>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    //FIND ALL USERS
    app.get('/users', async(req,res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    //FIND ONE USER
    app.get('/users/:id', async(req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    // ADD BOOK
    app.post('/books', async(req,res)=>{
      const newBook = req.body;
      const result = await bookCollection.insertOne(newBook);
      res.send(result); 
    })

    //FIND BOOKS
    app.get('/books', async(req,res)=>{
      const books = await bookCollection.find().toArray()
      res.send(books)
    })

    //FIND BOOKS FOR HOME PAGE
    app.get('/books/home', async(req,res)=>{
      const books = await bookCollection.find().limit(6).toArray();
      res.send(books);
    })

    //FIND ONE BOOK
    app.get('/books/:id', async(req,res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    })

  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

connectToMongoDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});