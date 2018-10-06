function buildMetadata(sample) {


    // Reference to Panel element for sample metadata

    var PANEL = document.getElementById("sample-metadata");

    // Clear any existing metadata

    PANEL.innerHTML = '';

    // Loop through all of the keys in the json response and

    // create new metadata tags

    for(var key in data) {

        h6tag = document.createElement("h6");

        h6Text = document.createTextNode(`${key}: ${data[key]}`);

        h6tag.append(h6Text);

        PANEL.appendChild(h6tag);

    }

}

function buildCharts(sample) {


    // Loop through sample data and find the OTU Taxonomic Name

    var labels = sample[0]['otu_ids'].map(function(item) {

        return otuData[item]

    });

    // Build Bubble Chart

    var bubbleLayout = {

        margin: { t: 0 },

        hovermode: 'closest',

        xaxis: { title: 'OTU ID' }

    };

    var bubbleData = [{

        x: sample[0]['otu_ids'],

        y: sample[0]['sample_values'],

        text: labels,

        mode: 'markers',

        marker: {

            size: sample[0]['sample_values'],

            color: sample[0]['otu_ids'],

            colorscale: "Earth",

        }

    }];

    var BUBBLE = document.getElementById('bubble');

    Plotly.plot(BUBBLE, bubbleData, bubbleLayout);

    // Build Pie Chart

    console.log(sample[0]['sample_values'].slice(0, 10))

    var pieData = [{

        values: sample[0]['sample_values'].slice(0, 10),

        labels: sample[0]['otu_ids'].slice(0, 10),

        hovertext: labels.slice(0, 10),

        hoverinfo: 'hovertext',

        type: 'pie'

    }];

    var pieLayout = {

        margin: { t: 0, l: 0 }

    };

    var PIE = document.getElementById('pie');

    Plotly.plot(PIE, pieData, pieLayout);

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
