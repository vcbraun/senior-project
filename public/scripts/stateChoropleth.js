let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;

// Select Relevant HTML elements
let statePleth = d3.select('#statePleth');
let tooltip = d3.select('#tooltip');
let tooltipName = d3.select('#stateName');
let tooltipConfirmed = d3.select('#absoluteCases');
let tooltipPercentageConfirmed = d3.select('#percentageCases');
let tooltipDeaths = d3.select('#absoluteDeaths');
let tooltipPercentageDeaths = d3.select('#percentageDeaths');
let tooltipPopulation = d3.select('#population');
let legendMaxLabel = d3.select('#legendMaxLabel');

// Populate Statistic information for tooltip
let percentageConfirmed = 100 * stateConf / statePop;
let percentageDeaths = 100 * stateDeaths / statePop;

tooltipPopulation.text("Population: " + statePop.toLocaleString());
tooltipPercentageConfirmed.text("% of Population: " + percentageConfirmed.toFixed(2));
tooltipConfirmed.text("Absolute: " + stateConf.toLocaleString());
tooltipDeaths.text("Absolute: " + stateDeaths.toLocaleString());
tooltipPercentageDeaths.text("% of Population:" + percentageDeaths.toFixed(2));

let maxConfirmedPercent = 0,
    maxDeathsPercent = 0;

for (county in countyCovidData)
{
    let conPercent = countyCovidData[county].confirmed / 
                            countyCovidData[county].population;

    let deathPercent = countyCovidData[county].deaths / 
                                countyCovidData[county].population;

    if (String(county).length < 5) county = '0' + county
    if (String(county).startsWith(stateId))
    {
        if (conPercent > maxConfirmedPercent)
        maxConfirmedPercent = conPercent;
    if (deathPercent > maxDeathsPercent)
        maxDeathsPercent = deathPercent;
    }
    
}

legendMaxLabel.text((100 * maxConfirmedPercent).toFixed(2) + "%");

// Create the legend
let legend = d3.select('#choroplethLegend');
let defs = legend.append('defs');

// Define gradient for confirmed
let confirmedGradient = defs.append('linearGradient')
                         .attr('id', 'confirmed-gradient');

confirmedGradient.attr('x1', '0%')
              .attr('y1', '0%')
              .attr('x2', '100%')
              .attr('y2', '0%');

confirmedGradient.append('stop')
              .attr('id', 'minValue')
              .attr('offset', '0%')
              .attr('stop-color', 'whitesmoke');

confirmedGradient.append('stop')
              .attr('id', 'maxValue')
              .attr('offset', '100%')
              .attr('stop-color', 'rgba(138, 29, 74, 1)');

legend.append('rect')
              .attr('id', 'legendGradient')
              .attr('width', 300)
              .attr('height', 20)
              .style('fill', 'url(#confirmed-gradient)');


let drawCountyMap = () => {
    statePleth.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', (item) => {
                let id = item['id'];
                if (String(id).startsWith(stateId))
                    return 'county'
            })
            .attr('fill', (countyDataItem) => {
                let id = String(countyDataItem['id']);
                
                let percentage = countyCovidData[id].confirmed / countyCovidData[id].population;

                if (id.length < 5) id = '0' + id;
                if (id.startsWith(stateId))
                    return "rgba(138, 29, 74, " + percentage / maxConfirmedPercent + ")";
                else
                    return "rgba(0, 0, 0, 0.05)"
            })
            .on('mouseover', (countyDataItem) => {
                let id = String(countyDataItem['id']);
                if (id.length < 5) id = '0' + id;
                
                let county = countyCovidData[id];

                if (id.startsWith(stateId))
                {
                    let percentageCases = 100 * county.confirmed / county.population;
                    let percentageDeaths = 100 * county.deaths / county.population;

                    tooltipName.text(county.name);
                    tooltipPopulation.text("Population: " + county.population.toLocaleString());

                    tooltipConfirmed.text("Absolute: " + county.confirmed.toLocaleString());
                    tooltipPercentageConfirmed.text("% of Population: " + percentageCases.toFixed(2));
                    
                    tooltipDeaths.text("Absolute: " + county.confirmed.toLocaleString());
                    tooltipPercentageDeaths.text("% of Population: " + percentageDeaths.toFixed(2));
                }     
            })
            .on('mouseout', (countyDataItem) => {
                let percentage = 100 * stateConf / statePop;

                tooltipName.text(state);
                tooltipConfirmed.text("Absolute: " + stateConf.toLocaleString());
                tooltipPercentageConfirmed.text("% of Population: " + percentage.toFixed(2));
                tooltipPopulation.text("Population: " + statePop.toLocaleString());
            })
}

function recolorMap(stat)
{
    statePleth.selectAll('path').attr('fill', (countyDataItem) => {
        let id = String(countyDataItem['id']);

        if (id.length < 5) id = '0' + id;
        
        if (id.startsWith(stateId)) {
            if (stat == "deaths") {
                percentage = countyCovidData[id].deaths / 
                                countyCovidData[id].population;
                
                document.getElementById("statsHeader").style.backgroundColor = "rgb(48, 72, 150)";
                d3.select('#maxValue').attr('stop-color', 'rgb(48, 72, 150)');
                return "rgba(48, 72, 150, " + percentage / maxDeathsPercent + ")";
            } else {
                percentage = countyCovidData[id].confirmed / 
                                countyCovidData[id].population;

                document.getElementById("statsHeader").style.backgroundColor = 'rgb(138, 29, 74)';
                d3.select('#maxValue').attr('stop-color', 'rgb(138, 29, 74)');
                return "rgba(138, 29, 74, " + percentage / maxConfirmedPercent + ")";
            }
        }
        return "rgba(0, 0, 0, 0.05)"
    });
}

d3.json(countyURL).then(
    (data, err) => {
        if(err) {
            console.log(err);
        } else {
            countyData = topojson.feature(data, data.objects.counties).features;

            console.log(countyData);

            drawCountyMap();

            d3.selectAll("input").on("change", function(){
                recolorMap(this.value);
            });
        }
    }
);