/** File: /index.js
 *  Desc: The entrypoint to the node application.
 *  Authors: Viktoria Braun
 *           Abbie Hurwitz
 *           Tanjuma Haque
*/

// set up express app
var express = require('express');
var app = express();
const port = 3000;
const path = require('path');
const util = require('util');

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
  // ---------------------- Load Data into usData -----------------------------
  var usData = [];

  // connect to the mongo client
  client.connect((err) => {
    // extract data
    var data = client.db('covid19')
                     .collection('us_only')
                     .find()
                     .sort(["date", -1])
                     .limit(100);

    // push the data objects into the results array
    data.forEach((doc, err) => {
        usData.push(doc);
    }, () => {
        client.close();
    });
});
// ---------------------- Finish Loading Data ---------------------------------

// get-data requests render a webpage with data from the database
app.use('/get-data', (req, res) => {
    // render the data view
    res.render('dataTable', {items: usData});
});
    

//simple d3 graph with hardcoded data
app.use('/graph', (req, res) => {
    res.render('d3testj');
});

//simple c3 graph with hardcoded data from the items array
app.use('/graph2', (req, res) => {
    var resultArray = [];

        res.render('c3test', {items: usData});

});

//home page
app.use('/', express.static(path.join(__dirname, 'public')))

// listen for requests
app.listen(port, () => {
    console.log(`Listening for requests at http://localhost:${port}`);
    console.log(`Click on http://localhost:${port}/query.html`)
});
