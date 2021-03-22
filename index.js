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
  var countyData = {};
  var stateCon = {};

  // connect to the mongo client
  client.connect((err) => {
    // extract data
    var data = client.db('covid19')
                     .collection('us_only')
                     .find()
                     .sort(["date", -1]);

    // push the data objects into the results array
    data.forEach((doc, err) => {
        usData.push(doc);

        if (!(doc.fips in countyData))
        {
          countyData[doc.fips] = 100 * doc.confirmed / doc.population;
        }

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

app.use('/choropleth', (req, res) => {
  res.render('choropleth', {items: countyData});
});

//simple d3 graph with hardcoded data
app.use('/graph', (req, res) => {
    res.render('d3testj');
});

//piechart attempt -- tanjuma will pull out stateCon later
app.use('/piechart', (req, res) => {
  //populating stateCon dictionary from usData
  //the purpose is to sum up all the counties data for each state on a day
  for(i = 0; i < usData.length; i++){
    var date = usData[i].date;
    var stateN = (usData[i].state);
    var confirmed = usData[i].confirmed;
    if(date in stateCon){
      var statesL = stateCon[date];
      if(stateN in statesL){
        var num = statesL[stateN];
        (stateCon[date])[stateN] = (num+confirmed);
      }
      else{
        (stateCon[date])[stateN] = confirmed;
      }
    }
    else{
      stateCon[date] = {};
      (stateCon[date])[stateN] = confirmed;
    }
  }
  // var keyz = Object.keys(stateCon);
  // var printdate1 = keyz[0];
  // var printdate2 = keyz[keyz.length - 1];
  // var val1 = stateCon[printdate1];
  // var val2 = stateCon[printdate2];
  // console.log(val1);
  // console.log(val2);
  // console.log(keyz);
  res.render('pie', {dict: stateCon});
});

app.use('/line', (req, res) => {
  //in my code this section had been in the original section of loading data. it may be fully possible to just add the for each loop up above and have it work fine
  //i didn't want to mess with it just yet and mess up the choropleth though
    var data = client.db('covid19')
                   .collection('us_only')
                   .find()
                   .sort(["date", -1])

  // push the data objects into the results array
  var dateconfirm = {};
  var datedeath = {};
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
  res.render('line', {itemsc: dateconfirm}); //this will eventually take confirmed and death somehow when i find the best way to combine but for the sake of running it i just included the confirms
});

//simple c3 graph with hardcoded data from the items array
app.use('/graph2', (req, res) => {
    var resultArray = [];

        res.render('c3test', {items: usData});

});

//home page
app.use('/', express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'public')))

// listen for requests
app.listen(port, () => {
    console.log(`Listening for requests at http://localhost:${port}`);
    console.log(`Click on http://localhost:${port}/query.html`)
});
