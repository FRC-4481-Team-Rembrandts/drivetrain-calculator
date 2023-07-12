const layout = {title: "Beautiful graph"};


function inputChange(){
    let a = parseFloat(document.getElementById('number_input_a').value);
    let b = parseFloat(document.getElementById('number_input_b').value);

    let xValues,yValues = formula(a,b);
    const data = [{x:xValues, y:yValues, mode:"lines"}];

    Plotly.newPlot("plotWindow", data, layout);
}