console.log(countyCovidData);

let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;

let statePleth = d3.select('#statePleth');
let tooltip = d3.select('#tooltip');
let tooltipName = d3.select('#stateName');
let tooltipConfirmed = d3.select('#absoluteCases');
let tooltipPercentageConfirmed = d3.select('#percentageCases');
let tooltipDeaths = d3.select('#absoluteDeaths');
let tooltipPercentageDeaths = d3.select('#percentageDeaths');
let tooltipPopulation = d3.select('#population');

let percentageConfirmed = 100 * stateConf / statePop;
let percentageDeaths = 100 * stateDeaths / statePop;

tooltipPopulation.text("Population: " + statePop);

tooltipPercentageConfirmed.text("Confirmed Cases: " + percentageConfirmed.toFixed(2));
tooltipConfirmed.text("Absolute: " + stateConf);

tooltipDeaths.text("Absolute: " + stateDeaths);
tooltipPercentageDeaths.text("% of Population:" + percentageDeaths.toFixed(2));

let drawCountyMap = () => {

    statePleth.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id'];

                let percentage = (countyCovidData[id].confirmed / countyCovidData[id].population) * 100;

                return "rgba(138, 29, 74, " + (percentage / 20) + ")";
            })
            .on('mouseover', (countyDataItem) => {
                var e = window.event;
                var x = (e.clientX + 20) + 'px',
                    y = (e.clientY + 20) + 'px';

                    tooltip.style.top = y;
                    tooltip.style.left = x;

                let id = countyDataItem['id'];
                let county;

                if (countyCovidData[id])
                    county = countyCovidData[id];

                let percentageCases = 100 * county.confirmed / county.population;
                let percentageDeaths = 100 * county.deaths / county.population;

                tooltipName.text(county.name);
                tooltipPopulation.text("Population: " + county.population);

                tooltipConfirmed.text("Absolute: " + county.confirmed);
                tooltipPercentageConfirmed.text("% of Population: " + percentageCases.toFixed(2));
                
                tooltipDeaths.text("Absolute: " + county.confirmed);
                tooltipPercentageDeaths.text("% of Population: " + percentageDeaths.toFixed(2));
            })
            .on('mouseout', (countyDataItem) => {
                let percentage = 100 * stateConf / statePop;

                tooltipName.text(state);
                tooltipConfirmed.text("Abolute: " + stateConf);
                tooltipPercentageConfirmed.text("% of Population: " + percentage.toFixed(2));
                tooltipPopulation.text("Population: " + statePop);
            })
}

function recolorMap(stat)
{
    statePleth.selectAll('path').attr('fill', (countyDataItem) => {
        let id = countyDataItem['id'];

        if (stat == "deaths")
        {
            percentage = 100 * countyCovidData[id].deaths / 
                            countyCovidData[id].population;
            
            document.getElementById("statsHeader").style.backgroundColor = "rgb(48, 72, 150)";
            return "rgba(48, 72, 150, " + percentage * 2 + ")";
        }
        else
        {
            percentage = 100 * countyCovidData[id].confirmed / 
                            countyCovidData[id].population;

            document.getElementById("statsHeader").style.backgroundColor = 'rgb(138, 29, 74)';
            return "rgba(138, 29, 74, " + percentage / 20 + ")";
        }

        return "black";
    });
}

d3.json(countyURL).then(
    (data, err) => {
        if(err) {
            console.log(err);
        } else {
            countyData = topojson.feature(data, data.objects.counties).features;

            drawCountyMap();

            d3.selectAll("input").on("change", function(){
                recolorMap(this.value);
            });
        }
    }
);