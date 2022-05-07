const express = require ('express');
const cors = require ('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { use } = require('express/lib/application');
const port = process.env.PORT || 5000;

// Use middleware
app.use (cors());
app.use (express.json());


//user: dbuser1
//password: jfzdsXTDNZBRuTF8


const uri = "mongodb+srv://dbuser1:jfzdsXTDNZBRuTF8@cluster0.lbaak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const userCollection = client.db('bikeExpress').collection('user');
        const user = {name: 'Shakil Khan', email: 'm.shakilkhan702@gmail.com'};
        const result = await userCollection.insertOne(user);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }
    finally {

        // await client.close();
    }
}

    run().catch(console.dir);


app.get('/', (req, res) => {
    res.send ('Running My Node Server')
});

app.listen(port, () => {
    console.log('Server is running')
})