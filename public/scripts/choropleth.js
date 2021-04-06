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

let statePleth = d3.select('#countryPleth');
let tooltip = d3.select('#tooltip');
let tooltipName = d3.select('#stateName');
let tooltipConfirmed = d3.select('#confirmedCases');
let tooltipPopulation = d3.select('#population');

let drawStateMap = () => {

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

                return "rgba(138, 29, 74, " + percentage / 18 + ")";
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

                tooltipName.text(stateFips[id]);
                tooltipConfirmed.text("Confirmed Cases: " + state.confirmed);
                tooltipPopulation.text("Population: " + state.population);
                
            })
            .on('mouseout', (countyDataItem) => {
                tooltipName.text('United States');
                tooltipConfirmed.text("Confirmed Cases: ");
                tooltipPopulation.text("Population: ");
            })
            .on('click', (stateDataItem) => {
                let id = stateDataItem['id'];
                window.location.href = 'choropleth/state?name=' + stateFips[id];
            })
}

d3.json(countyURL).then(
    (data, err) => {
        if(err) {
            console.log(err);
        } else {
            stateData = topojson.feature(data, data.objects.states).features;
            console.log(stateData);

            drawStateMap();
        }
    }
);