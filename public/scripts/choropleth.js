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

// detect which radio button is selected

// Calculate US aggregate data
let usPop = 0,
    usConfirmed = 0,
    usDeaths = 0,
    usPercentDeaths = 0;
    usPercentConfirmed = 0;

for (state in stateCovidData)
{
    usPop += stateCovidData[state].population;
    usConfirmed += stateCovidData[state].confirmed;
    usDeaths += stateCovidData[state].deaths;
}

usPercentConfirmed = 100 * usConfirmed / usPop;
usPercentDeaths = 100 * usDeaths / usPop;

// Display data in tooltip
tooltipConfirmed.text("Absolute: " + usConfirmed);
tooltipPercentageConfirmed.text("% of Population: " + usPercentConfirmed.toFixed(2));
tooltipPopulation.text("Population: " + usPop);
tooltipDeaths.text("Absolute: " + usDeaths);
tooltipPercentageDeaths.text("% of Population:" + usPercentDeaths.toFixed(2));

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

                    percentage = 100 * stateCovidData[stateFips[id]].confirmed / 
                                    stateCovidData[stateFips[id]].population;
                }
                else
                {
                    console.log(id);
                }

                return "rgba(138, 29, 74, " + percentage / 15 + ")";
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
                window.location.href = 'choropleth/state?name=' + stateFips[id];
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
                        percentage = 100 * stateCovidData[stateFips[id]].deaths / 
                                        stateCovidData[stateFips[id]].population;
                        
                        document.getElementById("statsHeader").style.backgroundColor = "rgb(48, 72, 150)";
                        return "rgba(48, 72, 150, " + percentage * 4 + ")";
                    }
                    else
                    {
                        percentage = 100 * stateCovidData[stateFips[id]].confirmed / 
                                        stateCovidData[stateFips[id]].population;

                        document.getElementById("statsHeader").style.backgroundColor = 'rgb(138, 29, 74)';
                        return "rgba(138, 29, 74, " + percentage / 15 + ")";
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