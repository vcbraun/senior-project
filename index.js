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
  var stateDeath = {};
  var statePop = {};

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

          var date = doc.date;
          var stateN = doc.state;
          var confirmed = doc.confirmed;
          var death = doc.death;
          var pop = doc.population;

          if(date in stateCon){
            var statesL = stateCon[date];
            if(stateN in statesL){
              var numConfirmed = statesL[stateN];
              var numDeath = stateDeath[date][stateN];
              var numPop = statePop[date][stateN];

              stateCon[date][stateN] = numConfirmed + confirmed;
              stateDeath[date][stateN] = numDeath + death;

              if (pop != null)
                statePop[date][stateN] = numPop + pop;
            }
            else{
              stateCon[date][stateN] = confirmed;
              stateDeath[date][stateN] = death;

              if (pop != null)
                statePop[date][stateN] = pop;
            }
          }
          else{
            stateCon[date] = {};
            stateDeath[date] = {};
            statePop[date] = {};

            stateCon[date][stateN] = confirmed;
            stateDeath[date][stateN] = death;
            if (pop != null)
              statePop[date][stateN] = pop;
          }
        

    }, () => {
        client.close();
    });
});

// ---------------------- Finish Loading Data ---------------------------------

app.use('/', express.static(path.join(__dirname, 'public')))

// get-data requests render a webpage with data from the database
app.use('/get-data', (req, res) => {
    // render the data view
    res.render('dataTable', {items: usData});
});

app.use('/choropleth', (req, res) => {
  res.render('choropleth', {counties: countyData,
                            pop: statePop['Mon Mar 22 2021 20:00:00 GMT-0400 (Eastern Daylight Time)'],
                            stateConfirmed: stateCon['Mon Mar 22 2021 20:00:00 GMT-0400 (Eastern Daylight Time)']});
});

//simple d3 graph with hardcoded data
app.use('/graph', (req, res) => {
    res.render('d3testj');
});

//piechart attempt -- tanjuma will pull out stateCon later
app.use('/piechart', (req, res) => {
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
app.use('/', (req, res) => {
  res.render('index.ejs');
})

// listen for requests
app.listen(port, () => {
    console.log(`Listening for requests at http://localhost:${port}`);
    console.log(`Click on http://localhost:${port}/query.html`)
});
