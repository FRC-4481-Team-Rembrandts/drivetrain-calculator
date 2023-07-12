let exp = "Math.sin(x)";

// Generate values
const xValues = [];
const yValues = [];
for (let x = 0; x <= 10; x += 0.1) {
  xValues.push(x);
  yValues.push(eval(exp));
}

// Display using Plotly
const data = [{x:xValues, y:yValues, mode:"lines"}];
const layout = {title: "y = " + exp};
Plotly.newPlot("myPlot", data, layout);