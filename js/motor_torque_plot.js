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

function plot_motor_torque(){
    let T_stall = parseFloat(document.getElementById('number_input_T_stall').value);
    let I_stall = parseFloat(document.getElementById('number_input_I_stall').value);
    let I_lim = parseFloat(document.getElementById('number_input_I_lim').value);

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