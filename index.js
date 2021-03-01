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
app.use('/get-data', (req, res) => {
    var resultArray = [];

    // connect to the mongo client
    client.connect((err) => {
        // extract data (currently hardcoded)
        var data = client.db('covid19')
                         .collection('global_and_us')
                         .find({ country: 'Germany' })
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

// home page
app.use('/', (req, res) => {
    res.send('Try going to /get-data!');
});

// listen for requests
app.listen(3000, () => {
    console.log('Listening on port 3000');
});