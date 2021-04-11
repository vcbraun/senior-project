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

  var stateDataMostRecent = {};
  var countyDataMostRecent = {};

  var stateCon = {};
  var stateDeath = {};
  var statePop = {};
  var dateconfirm = {};
  var datedeath = {};

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

        if (!(doc.fips in countyDataMostRecent)) {
          countyDataMostRecent[doc.fips] = {};
          countyDataMostRecent[doc.fips].name = doc.county;
          countyDataMostRecent[doc.fips].state = doc.state;
          countyDataMostRecent[doc.fips].date = doc.date;
          countyDataMostRecent[doc.fips].confirmed = doc.confirmed;
          countyDataMostRecent[doc.fips].population = doc.population;
          countyDataMostRecent[doc.fips].deaths = doc.deaths;

          if (doc.population && doc.confirmed && doc.deaths)
          {
            if (!(doc.state in stateDataMostRecent)) {
                stateDataMostRecent[doc.state] = {}

                stateDataMostRecent[doc.state].date = doc.date;
                stateDataMostRecent[doc.state].population = doc.population;
                stateDataMostRecent[doc.state].confirmed = doc.confirmed;
                stateDataMostRecent[doc.state].deaths = doc.deaths;
            }
            else {
              stateDataMostRecent[doc.state].population += doc.population;
              stateDataMostRecent[doc.state].confirmed += doc.confirmed;
              stateDataMostRecent[doc.state].deaths += doc.deaths;
            }
          }

        }
        if (doc.date in dateconfirm == true){
          dateconfirm[doc.date] = dateconfirm[doc.date] + doc.confirmed;
          datedeath[doc.date] = datedeath[doc.date] + doc.deaths;
        }
        else{
          dateconfirm[doc.date] = doc.confirmed;
          datedeath[doc.date] = doc.deaths;
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

app.use('/choropleth/state', (req, res) => {
  let name = req.query.name
  let state = stateDataMostRecent[name];
  res.render('stateChoropleth', {counties: countyDataMostRecent,
                                  stateName: name,
                                  stateConfirmed:state.confirmed,
                                  statePopulation:state.population,
                                  stateDeaths: state.deaths});
});

app.use('/choropleth', (req, res) => {
  res.render('choropleth', {states: stateDataMostRecent});
});

//simple d3 graph with hardcoded data
app.use('/graph', (req, res) => {
    res.render('d3testj');
});

app.use('/barchart', (req, res) => {
  res.render('barchart', {dict: {con: stateCon, tot: stateDataMostRecent}});
});

app.use('/line', (req, res) => {
  res.render('line', { data: {itemsc: dateconfirm, itemsd: datedeath} });
});

//simple c3 graph with hardcoded data from the items array
app.use('/graph2', (req, res) => {
    var resultArray = [];

        res.render('c3test', {items: usData});

});

// state-specific page
app.use('/state', (req, res) => {
  let name = req.query.name
  let state = stateDataMostRecent[name];

  res.render('stateViz', {counties: countyDataMostRecent,
                            stateName: name,
                            stateConfirmed:state.confirmed,
                            statePopulation:state.population,
                            stateDeaths: state.deaths,
                            dict: stateCon,
                            data: {itemsc: dateconfirm,
                                    itemsd: datedeath}});
})

// home page
app.use('/', (req, res) => {


  res.render('usViz', { states: stateDataMostRecent,
                        dict: {con: stateCon, tot: stateDataMostRecent},
                        data: {itemsc: dateconfirm,
                                itemsd: datedeath}});
})

// listen for requests
app.listen(port, () => {
    console.log(`Listening for requests at http://localhost:${port}`);
});
