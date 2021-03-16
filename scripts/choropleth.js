// var svg = d3.select("#canvas"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");

// var path = d3.geoPath();
// var projection = d3.geoMercator()
//     .scale(70)
//     .center([0, 20])
//     .translate([width / 2, height / 2]);

// var data = d3.map();
// var colorScale = d3.scaleThreshold()
//     .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
//     .range(d3.schemeBlues[7]);

// // external data
// d3.queue()
//     .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
//     .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv")
//     .await(ready);

// function ready(error, topo) {
//     // draw map
//     svg.append("g")
//         .selectAll("path")
//         .data(topo.features)
//         .enter()
//         .append("path")
//         // draw countries
//         .attr("d", d3.geoPath()
//             .projection(projection))
//         // set colors
//         .attr("fill", function (d) {
//             d.total = data.get(d.id) || 0;
//             return colorScale(d.total);
//         });
// }