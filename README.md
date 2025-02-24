# KTAF Simulator


1. On click on country apply baseline scenario (we can fetch baseline scenario with countries api and apply it on selection instead of fixed json, then no need to change any thing in future when more countries come in list)

2. If already applied policies then on country change need to send a request to server to apply all applied policies and get result data to show map and charts accordingly

3. On each policy apply request to server to get result data of applied policy and show maps and charts based on result data

4. while applying pre-defined scenario need to refresh all applied policies which is not saved in any scenario yet ?

5. while applying saved scenario need to refresh all applied policies which is not saved in any scenario

6. how to apply multiple scenarios ?
   my idea about applying multiple scenarios is show all scenarios applied policies in pane as group.
   with multiple scenarios applied we need to give option to remove scenario accordingly
   e.g. scenario name as group name and under scenario show its applied policies
   scenario1 ----- remove icon to remove whole scenario
   scenario2 ----- remove icon to remove whole scenario
   in comparison mode remove single policy not allowed



   country:name

year:value

Default ponderable: value

[

{region:name1, ponderable1:value; ponderable2:value, ...4-5 },

{region:name2, ponderable1:value; ponderable2:value, ... },

..

num of states

]

Single Country JSON Object to apply on map to generate choropleth map for the given country and year
{
    countryId:"",
    year:"",
    defaultPonderable:"tons",
    data:[
        {
            region: "name/code",
            //active ponderable values
            tons:"",
            co2:"",
            fuel:"",
            nox:""
        },
        {
            region: "name/code",
            //active ponderable values
            tons:"",
            co2:"",
            fuel:"",
            nox:""
        }
    ]
}
----------------------

Discussed chart data to generate charts based upon given parameters

ponderable = [{name:'Tons', order:1}, {name:'Fuel', order:2}, 'Co2', 'Nox'];

zone = ['All', 'Urban', 'Regional', 'Inter-regional', 'International'];
mode = ['All', 'Road', 'Rail', 'Air', 'Maritime'];
sector = ['All', 'Primary', 'Secondary', 'Tertiary'];
technology = ['All', 'Electricity', 'Diesel', 'Gasoline'];


chart data = [
    {
        year: '2015',
        countryId:0,
        baseLine:100,
        scenaro1:1200,
        scenaro2:300,
        scenaro3:1020,
    },
    {
        year: '2016',
        countryId:0,
        baseLine:200,
        scenaro1:500,
        scenaro2:700,
        scenaro3:1000,
    },
]

Compare Scenario hide Y Axis in charts

Locale change
1. fetch initial data again
2. if policies applied and not saved
    re-apply policies by requesting bau-map-data with all policies and if year selector has different value then send year with it
2. if any scenario applied then all scenario by requesting data of apply scenario
3. if scenario applied and compare mode on then perform action 2 with apply compare scenario for charts


appliedPolicies
scenarios

rest of the data automatically coming with initial data load

resetLocale ()

