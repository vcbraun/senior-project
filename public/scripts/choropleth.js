let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let contyData;
let educationData;

console.log(countyCovidData);

let canvas = d3.select('#canvas');

let drawMap = () => {

    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id'];

                // let county = educationData.find((item) => {
                //     return item['fips'] === id;
                // });

                //let percentage = county['bachelorsOrHigher']

                let percentage = countyCovidData[id];

                return "rgba(0, 0, 150, " + (percentage / 20) + ")";
                // if (percentage <= 15) {
                //     return 'tomato';
                // } else if (percentage <= 30) {
                //     return 'orange';
                // } else if (percentage <= 45) {
                //     return 'lightgreen';
                // } else {
                //     return 'limegreen';
                // }
            })
}

d3.json(countyURL).then(
    (data, err) => {
        if(err) {
            console.log(err);
        } else {
            countyData = topojson.feature(data, data.objects.counties).features;
            console.log(countyData);

            d3.json(educationURL).then(
                (data, err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        educationData = data;
                        console.log(educationData);
                        drawMap();
                    }
                }
            )
        }
    }
);