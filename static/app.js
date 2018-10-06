function loadsample(sample){

    var url = `/sample/${sample}`;

    Plotly.d3.json(url,function(error,response){

        if(error){ 

            return console.warn(error);

        }

        populateBackground(response['personal']);

        populatePieChart(response['otu_distribution'])

        populateBubbleChart(response['otu_sample']);

        populateGauge(response['washing_frequency']);

        console.log(response);

    });

}



function populateBubbleChart(otu_sample_data){

    console.log("tryyyyyyyyyyyyyyyyyyy bubble");

    console.log("test - > ",otu_sample_data['y'])

    console.log(d3.min(otu_sample_data['y']));

    console.log(d3.max(otu_sample_data['y']));



    var radiusScale = d3.scaleSqrt();



    radiusScale.range([0,100]);



    var rMin;

    var rMax;

    rMin = d3.min(otu_sample_data['y']);

    rMax = d3.max(otu_sample_data['y']);



    radiusScale.domain([rMin,rMax]);



    console.log("Radius ->",otu_sample_data['y'].map(d=>radiusScale(parseInt(d))))

      

      var data = [{

        y:otu_sample_data['y'].map(d=>d),

        'mode':'markers',

        'marker':{

            size: otu_sample_data['y'].map(d=>radiusScale(parseInt(d))),

            color: otu_sample_data['y'].map(d=>d)

                  }

      }];



      console.log(data);

      

      var layout = {

        title: 'Germs in the sample',

        xaxis: {

            title: "OTUs"

          },

          yaxis: {

            title: "Intensity found in sample"

          },

      };



      var bubbleDiv = document.querySelector('.otu-sample-bubble');

      

      Plotly.newPlot(bubbleDiv, data, layout);

      





}





function populatePieChart(sample_otu_distribution){

    console.log("Pie chart data");

    sample_otu_distribution["type"] = "pie";

    console.log(sample_otu_distribution);



    var pieDiv = document.querySelector(".germs-pie")



    var data = [sample_otu_distribution];

    var layout = {

        height: 400,

        width: 500,

        title: "Top 10 Operational Taxonomic Units <br> (OTU) found in this sample"

      };

      

    Plotly.newPlot(pieDiv,data,layout);





}



function populateBackground(personal_data){

    

    console.log(personal_data);



    var table = Plotly.d3.select("#personal-background");

    var tbody = table.select("tbody");



    var data_list = []



    for(var key in personal_data){

        var item = [key,personal_data[key]];

        data_list.push(item);

    }



    var rows = tbody.selectAll('tr')

    .data(data_list)

    .enter()

    .append('tr')

    .html(function(d){

        return `<td>${d[0]}</td><td>${d[1]}</td>`

    })

}



function populateGauge(num){

    if(!num){

        num = 1;

    }

            var level = num*18;

            // Trig to calc meter point

            var degrees = level,

                radius = .9;

            var radians = degrees * Math.PI / 180;

            var x = radius * Math.cos(radians);

            var y = radius * Math.sin(radians);

    

            // Path: may have to change to create a better triangle

            var mainPath = 'M -.0 -0.025 L .0 0.025 L ',

                pathX = String(x),

                space = ' ',

                pathY = String(y),

                pathEnd = ' Z';

            var path = mainPath.concat(pathX,space,pathY,pathEnd);

    

            var data = [{ type: 'scatter',

            x: [0], y:[0],

                marker: {size: 10, color:'850000'},

                showlegend: false,

                name: 'speed',

                text: level,

                hoverinfo: 'text+name'},

            { values: [50/5, 50/5, 50/5, 50/5, 50/5, 50],

            rotation: 90,

            text: ['0-2','3-4','5-6','7-8','9-10', ''],

            textinfo: 'text',

            textposition:'inside',

            marker: {colors:['rgba(210, 206, 145, .5)','rgba(202, 209, 95, .5)','rgba(170, 202, 42, .5)', 'rgba(110, 154, 22, .5)',

                                            'rgba(14, 127, 0, .5)', 'rgba(255, 255, 255, 0)']},

            labels:['1-2','3-4','5-6','7-8','9-10', ''],

            hoverinfo: 'label',

            hole: .5,

            type: 'pie',

            showlegend: false

            }];

    

            var layout = {

            shapes:[{

                type: 'path',

                path: path,

                fillcolor: '850000',

                line: {

                    color: '850000'

                }

                }],

            title: 'Washing Frequency (0-10) per week',

            height: 500,

            width: 500,

            xaxis: {zeroline:false, showticklabels:false,

                        showgrid: false, range: [-1, 1]},

            yaxis: {zeroline:false, showticklabels:false,

                        showgrid: false, range: [-1, 1]}

            };

    

            var gauge = document.querySelector('.washing-frequency');

            Plotly.newPlot(gauge, data, layout);    

}



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
