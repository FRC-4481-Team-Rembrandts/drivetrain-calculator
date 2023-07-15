const layoutA = {
    grid: {rows: 1, columns: 2, pattern: 'independent'},
    width: 1200,
    xaxis: {range: [0, 1],
            title: "Height of CG [m]"},
    yaxis: {range: [0, 10],
            title: "Maximum acceleration [m/s^2]"},
    xaxis2: {range: [0, 6],
            title: "Motor stall torque [Nm]"},
    yaxis2: {range: [0, 10],
            title: "Maximum acceleration [m/s^2]"},
    //Annotations are used to display subplot title
    annotations: [{
        text: "Maximum acceleration against center of gravity height",
            font: {
            size: 16,
        },
        showarrow: false,
        align: 'center',
        x: 0.03, //position in x domain
        y: 1.2, //position in y domain
        xref: 'paper',
        yref: 'paper',
        },
        {
            text: "Maximum acceleration against motor stall torque",
            font: {
            size: 16,
        },
        showarrow: false,
        align: 'center',
        x: 1, //position in x domain
        y: 1.2,  // position in y domain
        xref: 'paper',
        yref: 'paper',
        }
        ],
    showlegend: false,
    };


function plot_max_accel(){
    let mu = parseFloat(document.getElementById('number_input_mu').value);
    let l = parseFloat(document.getElementById('number_input_l').value);
    let h = parseFloat(document.getElementById('number_input_h').value);
    let m = parseFloat(document.getElementById('number_input_m').value);
    let r_t = parseFloat(document.getElementById('number_input_r_t').value);
    let T_stall = parseFloat(document.getElementById('number_input_T_stall').value);
    let gear_ratio = parseFloat(document.getElementById('number_input_gear_ratio').value);

    var xValuesH;
    var yValuesH;
    [xValuesH,yValuesH] = formula_ax_vs_h(mu, l, m, r_t, T_stall, gear_ratio);
    var traceH = {
        x: xValuesH,
        y: yValuesH,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'lines'
    }

    var xValuesTStall;
    var yValuesTStall;
    [xValuesTStall,yValuesTStall] = formula_ax_vs_t_stall(mu, l, h, m, r_t, gear_ratio);
    var traceT = {
                x:xValuesTStall, 
                y:yValuesTStall,
                xaxis: 'x2',
                yaxis: 'y2', 
                type:"lines"};
    
    const data = [traceH, traceT];
    var new_layout = draw_vert_line(layoutA, h, T_stall);

    Plotly.newPlot("plot_window_accel", data, new_layout);
}

function draw_vert_line(old_layout, h, T_stall){
    var new_layout = {
        ...old_layout,
        shapes: [{
            type: 'line',
            x0: h,
            y0: 0,
            x1: h,
            xref: 'x',
            yref: 'paper',
            y1: 1,
            line: {
              color: 'grey',
              width: 1.5,
              dash: 'dot'
            }
          },
          {
            type: 'line',
            x0: T_stall,
            y0: 0,
            x1: T_stall,
            xref: 'x2',
            yref: 'paper',
            y1: 1,
            line: {
              color: 'grey',
              width: 1.5,
              dash: 'dot'
            }
          }],
    }
    return new_layout;
}