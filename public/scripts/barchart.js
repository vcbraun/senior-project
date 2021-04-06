//getting keys of the dictionary (i.e.- dates)
var dkey = Object.keys(dataCopy);
//grabbing the first and last dates available in the dataset
var date1 = dkey[0];
//grabbing the data of the latest date
var dat = dataCopy[date1];
//to transform the data into a form that works for d3 bar chart
var data = [];
var highest = 0;
for (var key in dat) {
  if (dat.hasOwnProperty(key)) {
      var obj = {};
      obj["State"] = key;
      obj["Confirmed"] = dat[key];
      data.push(obj);
      //to decide the y-axis range
      if (dat[key]>highest){
        highest = dat[key];
      }
  }
}

//displaying the latest data's date
window.onload = function(){
  document.getElementById('b1').innerHTML = date1;
  };

var w = (window.screen.width);
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 90, left: 100},
    width = w - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.State; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, highest])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.State); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    // no bar at the beginning thus:
    .attr("height", function(d) { return height - y(0); }) // always equal to 0
    .attr("y", function(d) { return y(0); })

// Animation
svg.selectAll("rect")
  .transition()
  .duration(500)
  .attr("y", function(d) { return y(d.Confirmed); })
  .attr("height", function(d) { return height - y(d.Confirmed); })
  .delay(function(d,i){console.log(i) ; return(i*100)})
