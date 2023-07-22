const layoutTorque = {
    width: 700,
    xaxis: {autorange: true,
            title: "Current [A]"},
    yaxis: {autorange: true,
            title: "Torque [Nm]"},
    title: "Torque against motor controller input and winding current",
    showlegend: true,
    legend: {
      x: 1.35,
      xanchor: 'right',
      y: 1
    }
    };

//Declare input variables
let T_stall;
let I_stall;
let I_lim;
let K_T;
let R;

function update_input_torque(){
    T_stall = parseFloat(document.getElementById('number_input_T_stall').value);
    I_stall = parseFloat(document.getElementById('number_input_I_stall').value);
    I_lim = parseFloat(document.getElementById('number_input_I_lim').value);
    K_T = parseFloat(document.getElementById('number_input_K_T').value);
    R = parseFloat(document.getElementById('number_input_R').value);
}

function plot_torque_method_1(){   
    update_input_torque();

    let k_t_input = document.getElementById('number_input_K_T');
    k_t_input.value = (T_stall / I_stall).toFixed(4);

    let R_input = document.getElementById('number_input_R');
    R_input.value = (12 / I_stall).toFixed(4);

    update_torque_plot();
}

function plot_torque_method_2(){   
    update_input_torque();

    let T_stall_input = document.getElementById('number_input_T_stall');
    T_stall_input.value = ((K_T * 12) / R).toFixed(3);

    let I_stall_input = document.getElementById('number_input_I_stall');
    I_stall_input.value = (12 / R).toFixed(0);

    update_torque_plot();
}

function update_torque_plot(){

    update_input_torque();

    let xValuesIn;
    let yValuesIn;
    [xValuesIn, yValuesIn] = torque_vs_I_in(T_stall, I_stall);
    var trace1 = {
        x: xValuesIn,
        y: yValuesIn,
        type: 'lines',
        name: 'Input current'
    };

    let xValuesWinding;
    let yValuesWinding;
    [xValuesWinding, yValuesWinding] = torque_vs_I_winding(T_stall, I_stall);
    var trace2 = {
        x:xValuesWinding,
        y:yValuesWinding,
        type: 'lines',
        name: 'Winding current'
    }

    var data = [trace1, trace2];
    let new_layout_torque = draw_vert_line_torque(layoutTorque, I_lim);    
    Plotly.react('plot_window_torque', data, new_layout_torque);

    let outcome_div = document.getElementById("torque_outcome");
    let torque = torque_current_in(T_stall, I_stall, I_lim);
    let torque_text = "Current limited stall torque: " + torque.toFixed(2).toString() + " Nm";
    outcome_div.innerHTML = torque_text;

}

function draw_vert_line_torque(old_layout, I_lim){
    var new_layout = {
        ...old_layout,
        shapes: [{
            type: 'line',
            x0: I_lim,
            y0: 0,
            x1: I_lim,
            xref: 'x',
            yref: 'paper',
            y1: 1,
            line: {
              color: 'grey',
              width: 1.5,
              dash: 'dot'
            }
          }]
    }
    return new_layout;
}