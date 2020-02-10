const cors = require ('cors');
//make the nedb database
const Datastore = require('nedb')
  , db = new Datastore({ filename: 'database.db', autoload: true });
module.exports.database = db;
db.persistence.setAutocompactionInterval(60000);

const express = require('express');
const app = express();

app.use(cors());

app.listen(5000, () => console.log('Listening at port 5000'))
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

//api post
app.post('/api', (request, response) => {
    response.end(); //literally dont do anything
})
//api get
app.get('/api', (request, response) => {
    response.json(JSON.stringify({ response: 'hi'}));
})