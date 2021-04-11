console.log(stateCovidData);

let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let stateData;

let stateFips = 
   {'01': 'Alabama',
    '02': 'Alaska',
    '04': 'Arizona',
    '05': 'Arkansas',
    '06': 'California',
    '08': 'Colorado',
    '09': 'Connecticut',
    10: 'Delaware',
    12: 'Florida',
    13: 'Georgia',
    15: 'Hawaii',
    16: 'Idaho',
    17: 'Illinois',
    18: 'Indiana',
    19: 'Iowa',
    20: 'Kansas',
    21: 'Kentucky',
    22: 'Louisiana',
    23: 'Maine',
    24: 'Maryland',
    25: 'Massachusetts',
    26: 'Michigan',
    27: 'Minnesota',
    28: 'Mississippi',
    29: 'Missouri',
    30: 'Montana',
    31: 'Nebraska',
    32: 'Nevada',
    33: 'New Hampshire',
    34: 'New Jersey',
    35: 'New Mexico',
    36: 'New York',
    37: 'North Carolina',
    38: 'North Dakota',
    39: 'Ohio',
    40: 'Oklahoma',
    41: 'Oregon',
    42: 'Pennsylvania',
    44: 'Rhode Island',
    45: 'South Carolina',
    46: 'South Dakota',
    47: 'Tennessee',
    48: 'Texas',
    49: 'Utah',
    50: 'Vermont',
    51: 'Virginia',
    53: 'Washington',
    54: 'West Virginia',
    55: 'Wisconsin',
    56: 'Wyoming',
    60: 'American Samoa',
    66: 'Guam',
    69: 'Northern Mariana Islands',
    72: 'Puerto Rico',
    78: 'Virgin Islands'
};

// select all the relevant html elements
let statePleth = d3.select('#countryPleth');
let tooltip = d3.select('#tooltip');
let tooltipName = d3.select('#stateName');
let tooltipPopulation = d3.select('#population');
let tooltipConfirmed = d3.select('#absoluteCases');
let tooltipPercentageConfirmed = d3.select('#percentageCases');
let tooltipDeaths = d3.select('#absoluteDeaths');
let tooltipPercentageDeaths = d3.select('#percentageDeaths');


// Calculate US aggregate data
let usPop = 0,
    usConfirmed = 0,
    usDeaths = 0,
    usPercentDeaths = 0;
    usPercentConfirmed = 0;

let maxConfirmedPercent = 0,
    maxDeathsPercent = 0;


for (state in stateCovidData)
{
    usPop += stateCovidData[state].population;
    usConfirmed += stateCovidData[state].confirmed;
    usDeaths += stateCovidData[state].deaths;

    let conPercent = stateCovidData[state].confirmed / 
                           stateCovidData[state].population;

    let deathPercent = stateCovidData[state].deaths / 
                             stateCovidData[state].population;

    if (conPercent > maxConfirmedPercent)
        maxConfirmedPercent = conPercent;
    if (deathPercent > maxDeathsPercent)
        maxDeathsPercent = deathPercent;
}

console.log("max conf" + maxConfirmedPercent);
console.log("max deaths" + maxDeathsPercent);

usPercentConfirmed = 100 * usConfirmed / usPop;
usPercentDeaths = 100 * usDeaths / usPop;

// Display data in tooltip
tooltipConfirmed.text("Absolute: " + usConfirmed);
tooltipPercentageConfirmed.text("% of Population: " + usPercentConfirmed.toFixed(2));
tooltipPopulation.text("Population: " + usPop);
tooltipDeaths.text("Absolute: " + usDeaths);
tooltipPercentageDeaths.text("% of Population:" + usPercentDeaths.toFixed(2));

// Create the legend
// let legend = d3.select('#choroplethLegend');
// let defs = legend.append('defs');

// let linearGradient = defs.append('linearGradient')
//                          .attr('id', 'linear-gradient');

// linearGradient.attr('x1', '0%')
//               .attr('y1', '0%')
//               .attr('x2', '100%')
//               .attr('y2', '0%');

// linearGradient.append('stop')
//               .attr('offset', '0%')
//               .attr('stop-color', 'whitesmoke');

// linearGradient.append('stop')
//               .attr('offset', '100%')
//               .attr('stop-color', 'rgba(138, 29, 74, 1)');

// legend.append('rect')
//       .attr('width', 300)
//       .attr('height', 20)
//       .style('fill', 'url(#linear-gradient)');

// Draw the choropleth
function drawStateMap(){
    statePleth.selectAll('path')
            .data(stateData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'state')
            .attr('fips', (item) => {
                return item['id'];
            })
            .attr('data-confirmed', (item) => {
                let id = item['id'];
                if (stateCovidData[stateFips[id]])
                    return stateCovidData[stateFips[id]].confirmed;
                else
                    return 0;
            })
            .attr('fill', (stateDataItem) => {
                let id = stateDataItem['id'];
                let percentage = 0;

                if (stateCovidData[stateFips[id]])
                {

                    percentage = stateCovidData[stateFips[id]].confirmed / 
                                    stateCovidData[stateFips[id]].population;
                }
                else
                {
                    console.log(id);
                }

                return "rgba(138, 29, 74, " + percentage / maxConfirmedPercent + ")";
            })
            .attr('stroke', 'whitesmoke')
            .on('mouseover', (stateDataItem) => {
                var e = window.event;
                var x = (e.clientX + 20) + 'px',
                    y = (e.clientY + 20) + 'px';

                    tooltip.style.top = y;
                    tooltip.style.left = x;

                let id = stateDataItem['id'];
                let state;

                if (stateCovidData[stateFips[id]])
                    state = stateCovidData[stateFips[id]];

                let percentageConfirmed = 100 * state.confirmed / state.population;
                let percentageDeaths = 100 * state.deaths / state.population;

                tooltipName.text(stateFips[id]);
                tooltipPopulation.text("Population: " + state.population);

                tooltipConfirmed.text("Absolute: " + state.confirmed);
                tooltipPercentageConfirmed.text("% of Population: " + percentageConfirmed.toFixed(2));

                tooltipDeaths.text("Absolute: " + state.deaths);
                tooltipPercentageDeaths.text("% of Population: " + percentageDeaths.toFixed(2));
            })
            .on('mouseout', (countyDataItem) => {
                tooltipName.text('United States');
                tooltipPopulation.text("Population: " + usPop);

                tooltipConfirmed.text("Absolute: " + usConfirmed);
                tooltipPercentageConfirmed.text("% of Population: " + usPercentConfirmed.toFixed(2));

                tooltipDeaths.text("Absolute: " + usDeaths);
                tooltipPercentageDeaths.text("% of Population:" + usPercentDeaths.toFixed(2));
            })
            .on('click', (stateDataItem) => {
                let id = stateDataItem['id'];
                window.location.href = 'state?name=' + stateFips[id];
            })
}

function recolorMap(stat)
{
    statePleth.selectAll('path').attr('fill', (stateDataItem) => {
        let id = stateDataItem['id'];
                let percentage = 0;

                if (stateCovidData[stateFips[id]])
                {
                    if (stat == "deaths")
                    {
                        percentage = stateCovidData[stateFips[id]].deaths / 
                                        stateCovidData[stateFips[id]].population;
                        
                        document.getElementById("statsHeader").style.backgroundColor = "rgb(48, 72, 150)";
                        return "rgba(48, 72, 150, " + percentage/maxDeathsPercent + ")";
                    }
                    else
                    {
                        percentage = stateCovidData[stateFips[id]].confirmed / 
                                        stateCovidData[stateFips[id]].population;

                        document.getElementById("statsHeader").style.backgroundColor = 'rgb(138, 29, 74)';
                        return "rgba(138, 29, 74, " + percentage / maxConfirmedPercent + ")";
                    }
                }

                return "black";
    });
}


d3.json(countyURL).then(
    (data, err) => {
        if(err) {
            console.log(err);
        } else {
            stateData = topojson.feature(data, data.objects.states).features;

            drawStateMap();

            d3.selectAll("input").on("change", function(){
                recolorMap(this.value);
            });

            
        }
    }
);