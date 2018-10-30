function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
      var url = 'metadata/' + sample;
      d3.json(url).then(function(data){
        var sel = d3.select('#sample-metadata');
        sel.html('');
        var metadata = Object.entries(data).forEach(([key, value]) => sel.append('p').text(`${key}: ${value}`)); 
       
      });
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
   console.log(sample)
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = 'samples/' + sample;
    d3.json(url).then(function(data){
      var otusIds = data.otu_ids;
      var sampleValues =data.sample_values;
      var labels = data.otu_labels;
      // use map to multimply each value 10x
      let sizes = sampleValues.map(num => {
        return num * 10;
      });

      let colors = otusIds.map(num => {
        return num * 33;
      });
      // @TODO: Build a Bubble Chart using the sample data

      // use otu ids for marker colors

      // use otu_labels for text values

      var traceA = {
        type: "scatter",
        mode: "markers",
        x: otusIds,
        y: sampleValues,
        marker: {
          size: sizes,
          sizemode: 'area',
          color: colors
        },
        text: labels
      };
      
      var data = [traceA];
      
      var layout = {
        title: "A Bubble Chart in Plotly"
      };
      
      Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,

    // otu_ids, and labels (10 each).
    var pievalues = sampleValues.slice(0,9);
    var hoverInfos = labels.slice(0,9);
    var pielabels = otusIds.slice(0,9)
      var pieTrace = {
        type: 'pie',
        values: pievalues,
        labels: pielabels,
        text: hoverInfos
      }
      var pt = [pieTrace];
      Plotly.newPlot('pie',pt)
  });
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
