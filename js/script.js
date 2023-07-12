const layout = {title: "Beautiful graph",
                xaxis: {range: [0, 1]},
                yaxis: {range: [0, 10]}};


function inputChange(){
    let mu = parseFloat(document.getElementById('number_input_mu').value);
    let l = parseFloat(document.getElementById('number_input_l').value);
    let a = parseFloat(document.getElementById('number_input_a').value);
    let m = parseFloat(document.getElementById('number_input_m').value);
    let r_t = parseFloat(document.getElementById('number_input_r_t').value);
    let T_stall = parseFloat(document.getElementById('number_input_T_stall').value);
    let gear_ratio = parseFloat(document.getElementById('number_input_gear_ratio').value);

    [xValues,yValues] = formula(mu, l, a, m, r_t, T_stall, gear_ratio);
    const data = [{x:xValues, y:yValues, mode:"lines"}];

    Plotly.newPlot("plotWindow", data, layout);
}