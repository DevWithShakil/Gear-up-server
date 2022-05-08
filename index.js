const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { use } = require('express/lib/application');
const port = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());


//user: dbuser1
//password: jfzdsXTDNZBRuTF8


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lbaak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('bikeExpress').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })
        app.put('/service/:id', async (req, res) => {
            const updateQuantity = req.body
            console.log(updateQuantity);
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateQuantity.quantity
                },
            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

    }
    finally {

        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running My Node Server')
});

app.listen(port, () => {
    console.log('Server is running')
})