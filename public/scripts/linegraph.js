console.log(dataconfirm);
console.log(datadeath);


// 1. Create Buttons
var confirmbutton = document.createElement("button");
var deathbutton = document.createElement("button");

confirmbutton.innerHTML = "Confirmed Cases";
deathbutton.innerHTML = "Number of Deaths";

// 2. Append to Container
var graphContainer = document.getElementById("linegraphCard")
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

svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", height + 30)
  .text("Date");


// Initialize an Y axis
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
  .attr("class","myYaxis")

  // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      //.on("end", updateChart)


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

     var clip = svg.append("defs").append("svg:clipPath")
           .attr("id", "clip")
           .append("svg:rect")
           .attr("width", width )
           .attr("height", height )
           .attr("x", 0)
           .attr("y", 0);


      var idleTimeout
      function idled() { idleTimeout = null; }


     // Create a update selection: bind to the new data
      var u = svg.selectAll(".lineTest")
      .attr("clip-path", "url(#clip)")
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

          // Add the brushing
          u
              .append("g")
                .attr("class", "brush")
                .call(brush);

       // A function that set idleTimeOut to null
       svg.on("dblclick",function(){
         console.log("this happened");
         x.domain(d3.extent(data, function(d) { return d.x; }))
         xAxis.transition().call(d3.axisBottom(x))
         line
           .select('.u')
           .transition()
           .attr("d", d3.line()
             .x(function(d) { return x(d.x) })
             .y(function(d) { return y(d.y) })
         )
       });

       function updateChart() {

         // What are the selected boundaries?
         extent = d3.event.selection

         // If no selection, back to initial coordinate. Otherwise, update X axis domain
         if(!extent){
           if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
           x.domain([ 4,8])
         }else{
           x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
           line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
         }

         // Update axis and line position
         xAxis.transition().duration(1000).call(d3.axisBottom(x))
         line
             .select('.u')
             .transition()
             .duration(1000)
             .attr("d", d3.line()
               .x(function(d) { return x(d.x) })
               .y(function(d) { return y(d.y) })
             )
       }

    };
    // A function that update the chart for given boundaries

    // If user double click, reinitialize the chart

update(bestdata1)
