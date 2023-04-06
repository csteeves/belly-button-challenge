// API endpoint 
const queryUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

///// Use the D3 library to read in samples.json from the URL /////
function init(){
    // D3 to select drop down menu
    let dropdMenu= d3.select("#selDataset");

    // Retreiving json data and logging it
    d3.json(queryUrl).then((data)=> {
        console.log(`Data:${data}`)

        // Data array for name ids
        let names= data.names;

        // For Each to iterate through array of names
        names.forEach((name) =>{
            dropdMenu.append("option").text(name).property("value",name);
        });
        
        let name = names[0];

        // calling functions
        demographics(name);
        barGraph(name);
        bubbleGraph(name);
    });
}

///// Display the sample metadata, i.e., an individual's demographic information. /////
// Display each key-value pair from the metadata JSON object somewhere on the page.

// creating demopgraphics function
function demographics(selection){

    // Retreiving json data and logging it
    d3.json(queryUrl).then((data)=> {
        console.log(`Data:${data}`);

        // retreiving metaData
        let metadata= data.metadata;

        // Filtering for id
        let filterdata= metadata.filter((meta)=> meta.id== selection);
        let obj = filterdata[0]

        // adding blank line
        d3.select("#sample-metadata").html("");

        // return an array of object keys and values
        let entry= Object.entries(obj);
        
        entry.forEach(([key,value])=>{
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
        console.log(entry);
    });
}

///// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual. /////

// creating barGraph function
function barGraph(selection){

  // Retreiving json data and logging it
  d3.json(queryUrl).then((data)=> {
    console.log(`Data: ${data}`);

    // storing samples data and filtering sample id
    let samples = data.samples;
    let filterdata= samples.filter((sample)=> sample.id== selection);  
    let entry = filterdata[0];

    // creating trace for graph data
    let trace1=[{
    
    // using slice to get the top 10 results and reverse to make it desencing
    x:entry.sample_values.slice(0,10).reverse(),
    y:entry.otu_ids.slice(0,10).map((otu_id)=> `OTU ${otu_id}`).reverse(),
    text: entry.otu_labels.slice(0,10).reverse(),
    type:"bar",
    marker:{
        color:"blue"
    },
    orientation:"h"
    }];

    let layout = {
        height: 500,
        width: 500
    };

    // generate plot
    Plotly.newPlot("bar",trace1,layout);
    
    });
}

///// Create a bubble chart that displays each sample. /////

// creating bubbleGraph function
function bubbleGraph(selection) {
    // Fetch the JSON data and console log it
    d3.json(queryUrl).then((data) => {

        // sample objects array
        let samples = data.samples;
    
        // Filter data 
        let filteredData = samples.filter((sample) => sample.id === selection);
        let entry = filteredData[0];
        
        // creating trace for graph data
        let trace2 = [{
            x: entry.otu_ids,
            y: entry.sample_values,
            text: entry.otu_labels,
            mode: "markers",
            marker: {
                size: entry.sample_values,
                color: entry.otu_ids,
                colorscale: "ColorCombo376"
            }
        }];
    
        // Apply title
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // generate plot
        Plotly.newPlot("bubble", trace2, layout);
    });
}

///// Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard.

function optionChanged(selection){
    demographics(selection);
    barGraph(selection);
    bubbleGraph(selection);
};

///// Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo.


init();