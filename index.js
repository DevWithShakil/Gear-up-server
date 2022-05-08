const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { use } = require('express/lib/application');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());


function verifyJwt(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: "unauthorized" })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.DB_TOKEN, (error, decoded) => {
        if (error) {
            res.status(403).send({ message: "forbidden" })
        }
        req.decoded = decoded
        next()
    })
}


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
        // delete api
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(filter);
            res.send(result)
        })
        // post data 
        app.post('/service', async (req, res) => {
            const query = req.body
            const result = await serviceCollection.insertOne(query)
            res.send(result)
        })

        // jwt token
        app.post('/login', async (req, res) => {
            const user = req.body
            const accessToken = jwt.sign(user, process.env.DB_TOKEN, {
                expiresIn: "1d"
            })
            res.send(accessToken)
        })

        // Mypost
        app.get('/userpost', verifyJwt, async (req, res) => {
            const email = req.query.email
            console.log(email);
            const decodedEmail = req.decoded.email
            if (decodedEmail === email) {
                const query = { email: email }
                const cursor = serviceCollection.find(query)
                const result = await cursor.toArray()
                res.send(result)
            }
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