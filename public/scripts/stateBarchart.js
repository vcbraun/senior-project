var confirmedData = [];
var deathData = [];
var percentCon = [];
var percentDeath = [];
var date;

document.getElementById('stateCounty').innerHTML = state;

for (var key in countyCovidData) {
  if (countyCovidData.hasOwnProperty(key)) {
      var objDeath = {};
      var objCon = {};
      var objCPer = {};
      var objDPer = {};
      var countyD = countyCovidData[key];
      if (state === countyD.state){
        objDeath["County"] = countyD.name;
        objCon["County"] = countyD.name;
        objCPer["County"] = countyD.name;
        objDPer["County"] = countyD.name;
        date = countyD.date
        if (typeof countyD.population !== 'undefined' && countyD.population !== 0){
          var deathPer = ((countyD.deaths/countyD.population)*100);
          var confirmPer = ((countyD.confirmed/countyD.population)*100);
          objDPer["Value"] = deathPer;
          objCPer["Value"] = confirmPer;
          percentCon.push(objCPer);
          percentDeath.push(objDPer);
        }

        objDeath["Value"] = countyD.deaths;
        objCon["Value"] = countyD.confirmed;

        confirmedData.push(objCon);
        deathData.push(objDeath);
      }
  }
}
date = date.substring(0,10)
window.onload = function(){
  document.getElementById('b1').innerHTML = date;
  };
var d = "confirmedData";
var perabs ="absolute";
var highesttenbtn = "";

var s1 = JSON.parse(JSON.stringify(confirmedData));
var s2 = JSON.parse(JSON.stringify(deathData));
var s3 = JSON.parse(JSON.stringify(percentCon));
var s4 = JSON.parse(JSON.stringify(percentDeath));

function percentAb(val){
  perabs = val;
  if(val == "absolute"){
    if(d == "confirmedData"){
      barupdate(confirmedData);
    }
    else{
      barupdate(deathData);
    }
  }
  else{
    if(d == "confirmedData"){
      barupdate(percentCon);
    }
    else{
      barupdate(percentDeath);
    }
  }
}
function formdisplay(val){
  if(val == "Cases"){
    document.getElementById('heading').innerHTML = "Confirmed Cases";
    d = "confirmedData";
    if(perabs == "absolute"){
      barupdate(confirmedData);
    }
    else{
      barupdate(percentCon);
    }
  }
  else{
    document.getElementById('heading').innerHTML = "Deaths";
    d = "deathData";
    if(perabs == "absolute"){
      barupdate(deathData);
    }
    else{
      barupdate(percentDeath);
    }
  }
}
function sortandupdatebyCounty(dat){
  dat.sort(function (a, b) {
  return a.County.localeCompare(b.County);
  });
  barupdate(dat);
}

function sortandupdatebyValue(dat){
  dat.sort(function (a, b) {
  return parseFloat(b.Value) - parseFloat(a.Value);
  });
  if (highesttenbtn !== "clicked"){
    barupdate(dat);
  }
}
function ascendingC() {
  if(d == "confirmedData"){
    if(perabs == "absolute"){
      sortandupdatebyCounty(s1);
    }
    else{
      sortandupdatebyCounty(s3);
    }
  }
  else{
    if(perabs == "absolute"){
      sortandupdatebyCounty(s2);
    }
    else{
      sortandupdatebyCounty(s4);
    }
  }
}

function descendingV(){
  if(d == "confirmedData"){
    if(perabs == "absolute"){
      sortandupdatebyValue(s1);
    }
    else{
      sortandupdatebyValue(s3);
    }
  }
  else{
    if(perabs == "absolute"){
      sortandupdatebyValue(s2);
    }
    else{
      sortandupdatebyValue(s4);
    }
  }
}

var highestArr = [];
function highestten(){
  highesttenbtn = "clicked";
  if(d == "confirmedData"){
    if(perabs == "absolute"){
      sortandupdatebyValue(s1);
      highestArr = [];
      for (i in s1){
        if (i < 10){
          highestArr.push(s1[i]);
        }
      }
      barupdate(highestArr)
    }
    else{
      sortandupdatebyValue(s3);
      highestArr = [];
      for (i in s3){
        if (i < 10){
          highestArr.push(s3[i]);
        }
      }
      barupdate(highestArr)
    }
  }
  else{
    if(perabs == "absolute"){
      sortandupdatebyValue(s2);
      highestArr = [];
      for (i in s2){
        if (i < 10){
          highestArr.push(s2[i]);
        }
      }
      barupdate(highestArr)
    }
    else{
      sortandupdatebyValue(s4);
      highestArr = [];
      for (i in s4){
        if (i < 10){
          highestArr.push(s4[i]);
        }
      }
      barupdate(highestArr)
    }
  }
  highesttenbtn = "";
}

// set the dimensions and margins of the graph
var w = (window.screen.width)*.95;
var barmargin = {top: 10, right: 30, bottom: 70, left: 60},
    width = w - barmargin.left - barmargin.right,
    height = 400 - barmargin.top - barmargin.bottom;

// append the svg object to the body of the page
var barsvg = d3.select("#chart")
  .append("svg")
    .attr("width", width + barmargin.left + barmargin.right)
    .attr("height", height + barmargin.top + barmargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + barmargin.left + "," + barmargin.top + ")");

var toolTipDiv = d3.select("body").append("div")
    .style("opacity", 0)
    .attr("id", "myTooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")


// Initialize the X axis
var barx = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var barxAxis = barsvg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var bary = d3.scaleLinear()
  .range([ height, 0]);
var baryAxis = barsvg.append("g")
  .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function barupdate(data) {

  // Update the X axis
  barx.domain(data.map(function(d) { return d.County; }))
  barxAxis.call(d3.axisBottom(barx))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-35)")
    .style("text-anchor", "end");

    barsvg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                             (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("County");

  // Update the Y axis
  bary.domain([0, d3.max(data, function(d) { return d.Value }) ]);
  baryAxis.transition().duration(1000).call(d3.axisLeft(bary));

  // Create the u variable
  var baru = barsvg.selectAll("rect")
    .data(data)

  function onMouseOver(d){
    var tooltipDiv = d3.select("#myTooltip");

    tooltipDiv.transition()
       .duration(200)
       .style("opacity", 1);

    if (perabs == "absolute"){
      tooltipDiv.html(d.County + '<hr/>' + d.Value.toFixed(4))
      .style("left", d3.event.pageX - 50 + "px")
      .style("top", d3.event.pageY - 70 + "px")
    }
    else{
      tooltipDiv.html(d.County + '<hr/>' + d.Value.toFixed(4) + "%")
      .style("left", d3.event.pageX - 50 + "px")
      .style("top", d3.event.pageY - 70 + "px")
    }

     d3.select(this)
       .style("stroke", "black")
       .style("opacity", 0.5)
}

function onMouseOut(d){
    var tooltipDiv = d3.select("#myTooltip");
    tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
}

  if(d == "confirmedData"){
  baru
    .enter()
    .append("rect") // Add a new rect for each new elements
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .merge(baru) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return barx(d.County); })
      .attr("y", function(d) { return bary(d.Value); })
      .attr("width", barx.bandwidth())
      .attr("height", function(d) { return height - bary(d.Value); })
      .attr("fill", "#4d4dff")
    }
  else{
    baru
      .enter()
      .append("rect") // Add a new rect for each new elements
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .merge(baru) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
        .attr("x", function(d) { return barx(d.County); })
        .attr("y", function(d) { return bary(d.Value); })
        .attr("width", barx.bandwidth())
        .attr("height", function(d) { return height - bary(d.Value); })
        .attr("fill", "#00008b")
  }
  // If less State in the new dataset, I delete the ones not in use anymore
  baru
    .exit()
    .remove()
}
  document.getElementById('heading').innerHTML = "Confirmed Cases";
  barupdate(confirmedData);
