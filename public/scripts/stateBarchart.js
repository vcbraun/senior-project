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
window.onload = function(){
  document.getElementById('b1').innerHTML = date;
  };
var d = "confirmedData";
var perabs ="absolute";
var s1 = JSON.parse(JSON.stringify(confirmedData));
var s2 = JSON.parse(JSON.stringify(deathData));
var s3 = JSON.parse(JSON.stringify(percentCon));
var s4 = JSON.parse(JSON.stringify(percentDeath));

var ascendingS = document.createElement("button");
var ascendingV = document.createElement("button");

ascendingS.setAttribute("class","smallbtn");
ascendingV.setAttribute("class","smallbtn");

ascendingS.innerHTML = "Ascending Order: By County";
ascendingV.innerHTML = "Ascending Order: By Value";


// 2. Append to Container
var graphDiv = document.getElementById("barchartContainer")
graphDiv.appendChild(ascendingS);
graphDiv.appendChild(ascendingV);

// 3. Add event handlers
function percentAb(val){
  perabs = val;
  if(val == "absolute"){
    if(d == "confirmedData"){
      update(confirmedData);
    }
    else{
      update(deathData);
    }
  }
  else{
    if(d == "confirmedData"){
      update(percentCon);
    }
    else{
      update(percentDeath);
    }
  }
}
function formdisplay(val){
  if(val == "Cases"){
    document.getElementById('heading').innerHTML = "Confirmed Cases";
    d = "confirmedData";
    if(perabs == "absolute"){
      update(confirmedData);
    }
    else{
      update(percentCon);
    }
  }
  else{
    document.getElementById('heading').innerHTML = "Deaths";
    d = "deathData";
    if(perabs == "absolute"){
      update(deathData);
    }
    else{
      update(percentDeath);
    }
  }
}
function sortandupdatebyCounty(dat){
  dat.sort(function (a, b) {
  return a.County.localeCompare(b.County);
  });
  update(dat);
}

function sortandupdatebyValue(dat){
  dat.sort(function (a, b) {
  return parseFloat(a.Value) - parseFloat(b.Value);
  });
  update(dat);
}
ascendingS.addEventListener ("click", function() {
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
});

ascendingV.addEventListener ("click", function() {
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
});

// set the dimensions and margins of the graph
var w = (window.screen.width)*.95;
var margin = {top: 10, right: 30, bottom: 70, left: 60},
    width = w - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var toolTipDiv = d3.select("body").append("div")
    .style("opacity", 0)
    .attr("id", "myTooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")


// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(data) {

  // Update the X axis
  x.domain(data.map(function(d) { return d.County; }))
  xAxis.call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-35)")
    .style("text-anchor", "end");

  // Update the Y axis
  y.domain([0, d3.max(data, function(d) { return d.Value }) ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  // Create the u variable
  var u = svg.selectAll("rect")
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

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return x(d.County); })
      .attr("y", function(d) { return y(d.Value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Value); })
      .attr("fill", "#69b3a2")

  // If less State in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove()
}
  document.getElementById('heading').innerHTML = "Confirmed Cases";
  update(confirmedData);
