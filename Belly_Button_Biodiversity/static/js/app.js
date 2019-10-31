function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sample) => {
    console.log(sample);
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var row = sampleData.append("p");
      row.text(`${key}: ${value}`);
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    console.log(data);

    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var text_values = data.otu_labels;
    var marker_size = data.sample_values;
    var marker_colors = data.otu_ids;

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = [{
      x: x_values,
      y: y_values,
      text: text_values,
      mode: 'markers',
      marker: {
        color: marker_colors,
        size: marker_size
      }
    }];

    var layout = {
      xaxis: { title: "OTU ID" },
    };

    Plotly.newpPlot('bubble', bubbleTrace, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(`samples/${smaple}`).then((data) => {
      var pieValues = data.sample_values.slice(0, 10);
      var pieLabels = data.otu_ids.slice(0, 10);
      var pieText = data.otu_labels.slice(0, 10);

      var pieTrace = [{
        values: pieValues,
        labels: pieLabels,
        hovertext: pieText,
        type: 'pie'
      }];

      Plotly.newPlot('pie', pieTrace);
    });
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
