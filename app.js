const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tht2005:3qvYi92FumySSZn4@cluster0.pyfzxa1.mongodb.net/?retryWrites=true&w=majority";
const ObjectId = require('mongodb').ObjectId;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function mongoInsert(obj) {
  try {
    await client.connect();
    const db = client.db("work");
    const coll = db.collection("work");

    const result = await coll.insertOne(obj);
    console.log(`${result.insertedId} sent successfully`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function mongoGet() {
  try {
    await client.connect();
    const db = client.db("work");
    const coll = db.collection("work");
    const cursor = coll.find();
    var arr = [];
    await cursor.forEach(obj => {
      arr.push(obj);
    });
    return arr;
  }
  finally {
    await client.close();
  }
}
async function mongoDel(workId) {
  try {
    await client.connect();
    const db = client.db("work");
    const coll = db.collection("work");
    const result = await coll.deleteMany({"_id": new ObjectId(`${workId}`)});
    console.log(`${result.deletedCount} item(s) deleted`);
  }
  finally {
    await client.close();
  }
}

const express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.listen(3000);

app.get('/', (req, res) => {
  mongoGet().catch(console.dir).then(activities => {
    res.render('home', { works: activities });
  });
});
app.get('/upload', (req, res) => {
  if(req.query["activity"].length > 0) {
    mongoInsert(req.query).catch(console.dir).then(() => {
      res.redirect('/'); 
    });
  }
  else {
    res.redirect('/');
  }
});
app.get('/delete/:id', (req, res) => {
  mongoDel(req.params.id).catch(console.dir).then(() => {
    res.redirect('/');
  })
});
app.use((req, res) => {
  res.status(404).render('404');
});
