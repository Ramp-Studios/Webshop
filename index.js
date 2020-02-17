const cors = require ('cors');
const items = require ('./products.json')
//make the nedb database
const Datastore = require('nedb')
  , db = new Datastore({ filename: './database.db', autoload: true });
module.exports.database = db;
db.persistence.setAutocompactionInterval(1000);

const express = require('express');
const app = express();

app.use(cors());

app.listen(5000, () => console.log('Listening at port 5000'))
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

//making sure everything is in the db
for (let element in items) {
  db.find({item: element}, function(err, docs) {
    if (!docs[0]) {
      db.insert({item: element, stock: 100, lastlook: 0, added: new Date().getTime()})
    }
  });
}
//api get, used to get data from the database
app.get('/api', async (request, response) => {
  if (request.headers.item) {
    const item = items[request.headers.item];
    let stock;
    let reviews = {};
    //promise to get the data
    const thePromise = new Promise((resolve, reject) => {
      db.find({item: request.headers.item}, function(err, docs) {
        if (docs[0]) {
          docs.forEach((doc) => {
            if (doc.stock) stock = doc.stock;
            else if (doc.review) {
              reviews[Object.keys(reviews).length] = {
                user: doc.user,
                review: doc.review,
                stars: doc.stars,
                timestamp: doc.timestamp,
                likes: doc.likes,
                dislikes: doc.dislikes,
              }
            }
          })
        } else {
          //if theres no database entry for this item  make a new one
          console.log('no item')
          console.log(JSON.parse({
            item: request.headers.item,
            stock: 100,
            lastlook: new Date().getTime()
          }))
          db.insert({item: request.headers.item, stock: 100, lastlook: new Date().getTime()}, function(err, newDoc) {
            console.log(newDoc);
            stock = newDoc.stock;
          })
        }
        resolve()
      })
    }, 250)
    await thePromise;
    response.json(JSON.stringify({
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
      category: item.category,
      stock: stock,
      reviews: reviews
    }));
  } else if (request.headers.get) {
    let results = {};
    let finaldocs = [];
    db.find({item: {$exists: true}, stock: {$exists: true}}, async function (err, docs) {
      const thePromise2 = new Promise(async (resolve, reject) => {
        docs.forEach(async (doc) => {
          let ratings = 0;
          let ratingtotal = 0;
          const thePromise3 = new Promise(async (resolve, reject) => {
            db.find({item: doc.item, rating: {$exists: true}}, function (err, docs) {
              docs.forEach((doc) => {
                ratings ++;
                ratingtotal += doc.rating;
              })
              resolve();
            })
          }, 300)
          await thePromise3;
          if (ratings >= 1) doc.rating = ratingtotal / ratings
          else doc.rating = 3;
          doc.ratings = ratings;

          const item = items[doc.item];
          const result = {
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
            category: item.category,
            rating: doc.rating,
            ratings: doc.ratings,
            stock: doc.stock,
            lastlook: doc.lastlook,
            added: doc.added
          }
          finaldocs.push(result);
          if (finaldocs.length >= 10 || finaldocs.length === docs.length) {
            resolve();
          }
        })
      }, 300);
      await thePromise2;
      //sort it all
      if (request.headers.get === 'last10') { 
        docs = docs.sort(function (a, b) {
          return b.lastlook - a.lastlook
        })
      } else if (request.headers.get === 'newest10') {
        docs = docs.sort(function (a, b) {
          return a.added - b.added
        })
      } else if (request.headers.get === 'top10') {
        finaldocs.sort(function(a, b) {
          return b.rating - a.rating;
        });
      }
      finaldocs.forEach((doc, index) => {
        results[index+1] = doc;
      })
      response.json(JSON.stringify(results));
    });
  }
})
//api post, used for reviews
app.post('/api/review', (request, response) => {
  console.log(request.body);
  response.end(); //literally dont do anything

  if (String(request.body.product) && parseInt(request.body.rating) >= 1 && parseInt(request.body.rating) <= 5 && String(request.body.writer) && String(request.body.review)) {
    db.find({item: request.body.product}, function (err, docs) {
      if (docs[0]) {
        //db.insert({item: element, stock: 100, lastlook: 0, added: new Date().getTime()})
        console.log('Inserting review')
        db.insert({item: String(request.body.product), rating: parseInt(request.body.rating), writer: String(request.body.writer), review: String(request.body.review)})
      } else {
        console.log('Review for unknown product. Canceling it but wtf')
      }
    })
  }
  db.find({item: request.body.product, review: request.body.review}, function (err, docs) {
    console.log(docs);
  })
})
