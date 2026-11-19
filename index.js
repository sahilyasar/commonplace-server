import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';
import cors from 'cors';
const app = express();

const PORT = 3001


app.use(cors());

app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();

const db = mongoClient.db('commonplace');

const eventsCollection = db.collection('events');

app.get('/', (req, res) => {
    res.send('commonplace-server is running');
});

app.post('/add-event', async (req, res) => {
    const data = req.body;
    const result = await eventsCollection.insertOne(data);
    console.log(result);
    res.send(result);

   
})

app.get('/events', async (req, res) => {
    const result = await eventsCollection.find().toArray();
    res.send(result);
})

app.get('/event/:id', async (req, res) => {
    const id = req.params;
    const result = await eventsCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
});

app.get('/my-events/:email', async (req, res) => {
    const email = req.params.email;
    const result = await eventsCollection.find({ email: email }).toArray();
    res.send(result);
});


//http://localhost:3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});