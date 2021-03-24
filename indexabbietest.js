/** File: /index.js
 *  Desc: The entrypoint to the node application.
 *  Authors: Viktoria Braun
 *           Abbie Hurwitz
 *           Tanjuma Haque
*/

// set up express app
var express = require('express');
var app = express();

// set view engine to ejs
app.set('view engine', 'ejs');


// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));

// set up mongo client
var MongoClient = require("mongodb").MongoClient;
var uri = 'mongodb+srv://readonly:readonly@covid-19.hip2i.mongodb.net/covid19';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// get-data requests render a webpage with data from the database
// ---------------------- Load Data into usData -----------------------------
var usData = [];
var dateconfirm = {};
var datedeath = {};

// connect to the mongo client
client.connect((err) => {
  // extract data
  var data = client.db('covid19')
                   .collection('us_only')
                   .find()
                   .sort(["date", -1])

  // push the data objects into the results array
  data.forEach((doc, err) => {
      usData.push(doc);
      if (doc.date in dateconfirm == true){
        dateconfirm[doc.date] = dateconfirm[doc.date] + doc.confirmed;
        datedeath[doc.date] = datedeath[doc.date] + doc.deaths;
      }
      else{
        dateconfirm[doc.date] = doc.confirmed;
        datedeath[doc.date] = doc.death;
      }

  }, () => {
      client.close();
  });
});

app.use('/line', (req, res) => {
  res.render('line', {itemsc: dateconfirm});
});
