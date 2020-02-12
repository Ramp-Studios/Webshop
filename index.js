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
    /*console.log(JSON.parse(JSON.stringify({
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
      category: item.category,
      stock: stock,
      reviews: reviews
    })))
    console.log(item.image); */
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
    //if header get is last10 get the last 10 sorted by most recent.
    if (request.headers.get === 'last10') {
      const thePromise = new Promise((resolve, reject) => {
        db.find({item: {$exists: true}, stock: {$exists: true}}, function (err, docs) {
          docs = docs.sort((a, b) => b.lastlook - a.lastlook)
          docs.every(function(element, index) {
            const item = items[element.item];
            const result = {
              name: item.name,
              price: item.price,
              description: item.description,
              image: item.image,
              category: item.category,
              stock: element.stock,
              lastlook: element.lastlook
            }
            results[index+1] = result;
            if (index >= 9) return false;
            else return true; 
          });
          resolve()
        });
      }, 250)
      await thePromise;
      //console.log(results);
      response.json(JSON.stringify(results));
    } else if (request.headers.get === 'newest10') {
      const thePromise = new Promise((resolve, reject) => {
        db.find({item: {$exists: true}, stock: {$exists: true}}, function (err, docs) {
          docs = docs.sort((a, b) => b.added - a.added)
          docs.every(function(element, index) {
            const item = items[element.item];
            const result = {
              name: item.name,
              price: item.price,
              description: item.description,
              image: item.image,
              category: item.category,
              stock: element.stock,
              lastlook: element.lastlook
            }
            results[index+1] = result;
            if (index >= 9) return false;
            else return true; 
          });
          resolve()
        });
      }, 250)
      await thePromise;
      //console.log(results);
      response.json(JSON.stringify(results));
    } else if (request.headers.get === 'top10') {
      const thePromise = new Promise((resolve, reject) => {
        db.find({item: {$exists: true}, stock: {$exists: true}}, function (err, docs) {
          docs = docs.sort((a, b) => b.lastlook - a.lastlook)
          docs.every(function(element, index) {
            const item = items[element.item];
            const result = {
              name: item.name,
              price: item.price,
              description: item.description,
              image: item.image,
              category: item.category,
              stock: element.stock,
              lastlook: element.lastlook
            }
            results[index+1] = result;
            if (index >= 9) return false;
            else return true; 
          });
          resolve()
        });
      }, 250)
      await thePromise;
      //console.log(results);
      response.json(JSON.stringify(results));
    }
  }
})
//api post, used for reviews
app.post('/api', (request, response) => {
  response.end(); //literally dont do anything
})
