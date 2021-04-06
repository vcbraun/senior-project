console.log(dataconfirm);
console.log(datadeath);


// 1. Create Buttons
var confirmbutton = document.createElement("button");
var deathbutton = document.createElement("button");

confirmbutton.innerHTML = "Confirmed Cases";
deathbutton.innerHTML = "Number of Deaths";

// 2. Append to Container
var graphContainer = document.getElementById("linegraphContainer")
graphContainer.appendChild(confirmbutton);
graphContainer.appendChild(deathbutton);

// 3. Add event handlers
confirmbutton.addEventListener ("click", function() {
  update(bestdata1);
});

deathbutton.addEventListener ("click", function() {
  update(bestdata2);
});

// Get dates
var thedates = Object.keys(dataconfirm);
const maxy = dataconfirm[thedates[0]];

const parseDate = d3.isoParse;


function storeCoordinate(xVal, yVal, array) {
    array.push({x: xVal, y: yVal});
}

const maxdate = parseDate(thedates[0]); //for the axis
var confirmnums = [];
var deathnums = [];
var i;
for(i = 0; i < thedates.length; i++){
  confirmnums[i] = dataconfirm[thedates[i]];
  deathnums[i] = datadeath[thedates[i]];
  thedates[i] = parseDate(thedates[i]);
}
var con
var bestdata1 = [];
var bestdata2 = [];
var j;
for(j = 0; j < thedates.length; j++){
  storeCoordinate(thedates[j], confirmnums[j], bestdata1);
  storeCoordinate(thedates[j], deathnums[j], bestdata2);
}



let lineGraph = d3.select('#lineGraph');

// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 30, left: 70},
    width = 1200 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Initialise a X axis:
var x = d3.scaleTime().range([0,width]);
var xAxis = d3.axisBottom().scale(x);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class","myXaxis")

// Initialize an Y axis
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
  .attr("class","myYaxis")

  //data.forEach(function(d) {
    //    d[0] = parseDate(d[0]);
    //});

  // Now I can use this dataset:
  function update(data) {

    // update X axis --> it is a date format
    x.domain(d3.extent(thedates))
    svg.selectAll(".myXaxis").transition()
      .duration(3000)
      .call(xAxis);

    // update Y axis
    y.domain([0, d3.max(data, function(d) { return d.y  }) ])
    svg.selectAll(".myYaxis")
     .transition()
     .duration(3000)
     .call(yAxis);


     // Create a update selection: bind to the new data
      var u = svg.selectAll(".lineTest")
        .data([data], function(d){ return d.x });

      // Updata the line
      u
        .enter()
        .append("path")
        .attr("class","lineTest")
        .merge(u)
        .transition()
        .duration(3000)
        .attr("d", d3.line()
        .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); }))
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2.5)


    }

update(bestdata1)
