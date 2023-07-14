const layoutH = {title: "Maximum acceleration against center of gravity height",
                xaxis: {range: [0, 1],
                        title: "Height of CG [m]"},
                yaxis: {range: [0, 10],
                        title: "Maximum acceleration [m/s^2]"}};

const layoutT = {title: "Maximum acceleration against motor stall torque",
                xaxis: {range: [0, 4],
                        title: "Motor stall torque [Nm]"},
                yaxis: {range: [0, 10],
                        title: "Maximum acceleration [m/s^2]"}};

function inputChange(){
    let mu = parseFloat(document.getElementById('number_input_mu').value);
    let l = parseFloat(document.getElementById('number_input_l').value);
    let h = parseFloat(document.getElementById('number_input_h').value);
    let m = parseFloat(document.getElementById('number_input_m').value);
    let r_t = parseFloat(document.getElementById('number_input_r_t').value);
    let T_stall = parseFloat(document.getElementById('number_input_T_stall').value);
    let gear_ratio = parseFloat(document.getElementById('number_input_gear_ratio').value);

    [xValuesH,yValuesH] = formula_ax_vs_h(mu, l, m, r_t, T_stall, gear_ratio);
    const dataH = [{x:xValuesH, y:yValuesH, mode:"lines"}];

    Plotly.newPlot("plot_window_ax_vs_h", dataH, layoutH);

    [xValuesTStall,yValuesTStall] = formula_ax_vs_t_stall(mu, l, h, m, r_t, gear_ratio);
    const dataT = [{x:xValuesTStall, y:yValuesTStall, mode:"lines"}];

    Plotly.newPlot("plot_window_ax_vs_t_stall", dataT, layoutT);
}