const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: [
    // 'http://localhost:5173',

  'https://b9a11-fitness-client-2c51c.web.app',
  'https://b9a11-fitness-client-2c51c.firebaseapp.com'

  ],
  credentials: true,
  optionalSuccessStatus: 200,
}


app.use(cors(corsOptions));
app.use(express.json());
// hBQikgWdU9OJwuf2
// fitness
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rw7ggrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    const serviceCollection = client.db('fitnessDB').collection('services')
    const bookedCollection = client.db('fitnessDB').collection('booked')
    const feedbackCollection = client.db('fitnessDB').collection('feedback')


    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
// search option ___>
app.get('/search', async (req, res) => {
  const search=req.query.search 
  let query = {
    service_name:{$regex:search,$options:'i'},
  }
  const result = await serviceCollection.find(query).toArray();
  res.send(result);
})




    // app.get('/booked', async (req, res) => {
    //   const cursor = bookedCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })


    app.post('/services', async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await serviceCollection.insertOne(newItem);
      res.send(result)
    })
    // feedback:-->
    app.post('/feedback', async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await feedbackCollection.insertOne(newItem);
      res.send(result)
    })
// feedbacks get:---> 
    app.get('/feedback', async (req, res) => {
      const cursor = feedbackCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/details/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query)
      console.log(result)
      res.send(result)
    })

    app.get('/manage/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await serviceCollection.find({ provider_email: req.params.email }).toArray();
      res.send(result)
    })


    app.delete('/delete/:id', async (req, res) => {
      const result = await serviceCollection.deleteOne({ _id: new ObjectId(req.params.id) })
      console.log(result);
      res.send(result)
    })
    app.get('/singleItem/:id', async (req, res) => {
      const result = await serviceCollection.findOne({ _id: new ObjectId(req.params.id), })
      console.log(result)
      res.send(result)
    })

    // update er jonno:-->
    app.put('/updateItem/:id', async (req, res) => {
      console.log(req.params.id)
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          service_image: req.body.service_image,
          service_name: req.body.service_name,
          short_description: req.body.short_description,
          price: req.body.price,
          service_area: req.body.service_area,
          provider_email: req.body.provider_email,
          provider_name: req.body.provider_name,
          provider_image: req.body.provider_image,
          // const user_email = form.user_email.value
          //  user_name: req.body.user_name
        }
      }
      const result = await serviceCollection.updateOne(query, data);
      console.log(result);
      res.send(result)
    })

    // new db collection post:--> 

    app.post('/book', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookedCollection.insertOne(booking);
      res.send(result)
    })
    // get from new db mybook:-> 

    app.get('/myBook/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await bookedCollection.find({ user_email: req.params.email }).toArray();
      res.send(result)
    })
    // book requests:-->
    // app.get('/bookRequests/:email', async (req, res) => {
    //   const email = req.params.email
    //   const query = {provider_email:email} 
    //   const result = await bookedCollection.find(query).toArray()
    // })
    app.get('/bookRequests/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await bookedCollection.find({provider_email: req.params.email }).toArray();
      res.send(result)
    })

    app.patch('/status/:id', async (req, res) => {
      console.log(req.params.id)
      const status=req.query.status
console.log(status,req.params.id)
      const filter = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
                service_status:status
        }
      }
      const result = await bookedCollection.updateOne(filter, data);
      // console.log(result);
      res.send(result)
    })




    //   await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Fitness is running')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})