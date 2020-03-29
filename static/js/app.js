// Belly Button Biodiversity Dasboard
// Code by: Henry Greyner

// Initial function at load
// Use d3.json() to fetch data from JSON file and populate Names for user selection
function init() {
         var subject = d3.select("#selDataset");
         d3.json("samples.json").then((importedSamples) => {
         var subjectID = importedSamples.names;
         console.log("subjectID", subjectID)
         subjectID.forEach(name => {
             subject.append("option")
             .text(name)
             .property("value", name);
         });

         // Initial configuration to run at load with a sujectID at Index 0        
         var initialID = 0;
         demographics(initialID)
         graphs(initialID)
        });
};


// Function to run when user changes ID
function optionChanged() {

    // Obtain value entered by user    
    var newID = d3.select("#selDataset").property("value");
    console.log("New ID Selected: ", newID)
 
    // Obtain the full list of values    
    d3.json("samples.json").then((importedSamples) => {
        var subjectID = importedSamples.names;
        console.log("subjectID", subjectID)
 
        // Calculate the new index postion for the new value    
        var index = subjectID.findIndex(function(i){
        return i === newID
    });
    console.log("New Subject ID index postion: ", index);

    // Run demographics and graphs function with new values
    demographics(index)
    graphs(index)
});
};
    

// Funtion to obatain subject id metadata
function demographics(id) {
    //Metadata
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.html("");
        d3.json("samples.json").then(function(data){
            var metadata = data.metadata[`${id}`];
            console.log("metadata", metadata);
            Object.entries(metadata).forEach(([key, value]) => {
                demographicInfo.append("h6")
                .text(`${key}: ${value}`);
            });
        });
    };
 
// Functions to obatain plots    
function graphs(id) {    
    // Graphs
       d3.json("samples.json").then((graphsData) => {    
        
            var graphSamples = graphsData.samples[`${id}`]; 
            console.log("samples", graphSamples);
                
        // Bar Chart
            var barX = graphSamples.sample_values.slice(0, 10).reverse();
            var barY = graphSamples.otu_ids.slice(0, 10).map(y => `OTU ${y} `).reverse();
            
            var trace1 = {
                x: barX,
                y: barY,
                type: "bar",
                orientation: "h"
            };
            
            console.log("bar_x", barX);
            console.log("bar_y", barY);
            
            var data1 = [trace1];
            var layout1 = {
                title: "Top 10 OTUs per Subject",
                };
            Plotly.newPlot("bar", data1, layout1);
            
            
        // Bubble Chart
            var bubbleX = graphSamples.otu_ids;
            var bubbleY = graphSamples.sample_values;

            var trace2 = {
                x: bubbleX,
                y: bubbleY,
                mode: "markers",
                text: graphSamples.otu_labels,
                marker: {
                    color: graphSamples.otu_ids,
                    size: graphSamples.sample_values,
                    colorscale: "colorful"
                }
            };
            
            var data2 = [trace2];
            var layout2 = {
                title: "OTU IDs",
                };
            Plotly.newPlot("bubble", data2, layout2);
        
        });
            
            // Gauge Plot
            
            d3.json("samples.json").then(function(data2){
                var metadata2 = data2.metadata[`${id}`];
            
            var frequency = metadata2.wfreq
            console.log("washing frequncy: ", frequency)
            
            var data3 = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: frequency,
                    title: { text: "Belly Button Washing Frequency" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 9] },
                        bar: { color: "rgb(31, 119, 180)" },
                    }
                }
            ];
            
            //var data3 = [trace3];
            var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 } };
            Plotly.newPlot('gauge', data3, layout3);        
        
        });
        
    };       
         
   
        init();

      