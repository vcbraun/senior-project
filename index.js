/** File: /index.js
 *  Desc: The entrypoint to the node application.
 *  Authors: Viktoria Braun
 *           Abbie Hurwitz
 *           Tanjuma Haque
*/

// set up express app
var express = require('express');
var app = express();
const port = process.env.PORT || 3000;
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
  var stateDataMostRecent = {};
  var countyDataMostRecent = {};

  var stateConfirmedByDate = {};
  var stateDeathsByDate = {};
  stateConfirmedByDate["all"] = {};
  stateDeathsByDate["all"] = {}; //used to keep track of total confirmed and deaths by date for the main page

  // connect to the mongo client
  client.connect((err) => {
    // extract data
    var data = client.db('covid19')
                     .collection('us_only')
                     .find()
                     .sort(["date", -1]);

    // push the data objects into the results array
    data.forEach((doc, err) => {
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
        if(doc.state in stateConfirmedByDate == true){
          if(doc.date in stateConfirmedByDate[doc.state] == true){
            stateConfirmedByDate[doc.state][doc.date] += doc.confirmed;
            stateDeathsByDate[doc.state][doc.date] += doc.deaths;
          }
          else{
            stateConfirmedByDate[doc.state][doc.date] = doc.confirmed;
            stateDeathsByDate[doc.state][doc.date] = doc.deahts;
          }
        }
        else{
          stateConfirmedByDate[doc.state] = {};
          stateDeathsByDate[doc.state] = {};
          stateConfirmedByDate[doc.state][doc.date] = doc.confirmed;
          stateDeathsByDate[doc.state][doc.date] = doc.deaths;
        }
        if(doc.date in stateConfirmedByDate["all"] == true){
          stateConfirmedByDate["all"][doc.date]+= doc.confirmed;
          stateDeathsByDate["all"][doc.date] += doc.deaths;
        }
        else{
          stateConfirmedByDate["all"][doc.date] = doc.confirmed;
          stateDeathsByDate["all"][doc.date] = doc.deaths;
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
  res.render('barchart', {dict: {tot: stateDataMostRecent}});
});

app.use('/line', (req, res) => {
  res.render('line', { data: {itemsc: stateConfirmedByDate["all"], itemsd: stateDeathsByDate["all"]} });
});

//simple c3 graph with hardcoded data from the items array
app.use('/graph2', (req, res) => {
    var resultArray = [];

        res.render('c3test', {items: usData});

});

// state-specific page
app.use('/state', (req, res) => {
  let name = req.query.name;
  let id = req.query.id;
  let state = stateDataMostRecent[name];

  res.render('stateViz', {counties: countyDataMostRecent,
                            stateName: name,
                            stateFips: id,
                            stateConfirmed:state.confirmed,
                            statePopulation:state.population,
                            stateDeaths: state.deaths,
                            data: {itemsc: stateConfirmedByDate[name],
                                    itemsd: stateDeathsByDate[name]}});
})

// home page
app.use('/', (req, res) => {


  res.render('usViz', { states: stateDataMostRecent,
                        data: {itemsc: stateConfirmedByDate["all"],
                                itemsd: stateDeathsByDate["all"]}});
})

// listen for requests
app.listen(port, () => {
    console.log(`Listening for requests at http://localhost:${port}`);
});
