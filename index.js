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

// get-data requests render a webpage with data from the database
app.use('/get-data', (req, res) => {
    var resultArray = [];

    //get user input
    var countrySel = req.body.countries;

    // connect to the mongo client
    client.connect((err) => {

        ////getting array of countries
        // client.db('covid19')
        //       .collection('metadata')
        //       .find()
        //       .toArray((err, docs) => {
        //         if (err) {
        //           console.error(err);
        //         }
        //         const countrylist = docs[0].countries;
        //         console.log(util.inspect(countrylist, { maxArrayLength: null }));
        //       });

        // extract data
        var data = client.db('covid19')
                         .collection('global_and_us')
                         .find({ country: countrySel })
                         .sort(["date", -1])
                         .limit(15);

        // push the data objects into the results array
        data.forEach((doc, err) => {
            resultArray.push(doc);
        }, () => {
            client.close();
            // render the data view
            res.render('dataTable', {items: resultArray});
        });
    });
});

//simple d3 graph with hardcoded data
app.use('/graph', (req, res) => {
    res.render('d3testj');
});

//simple c3 graph with hardcoded data from the items array
app.use('/graph2', (req, res) => {
    var resultArray = [];

    client.connect((err) => {
      var data = client.db('covid19')
                        .collection('global_and_us')
                        .find({country: 'Germany' })
                        .sort(["date", -1])
                        .limit(15);
      data.forEach((doc, err) => {
        resultArray.push(doc);
      }, () => {
        client.close();
        res.render('c3test', {items: resultArray});

      });
    });
});

//home page
app.use('/', express.static(path.join(__dirname, 'public')))

// listen for requests
app.listen(port, () => {
    console.log(`Listening for requests at http://localhost:${port}`);
    console.log(`Click on http://localhost:${port}/query.html`)
});
