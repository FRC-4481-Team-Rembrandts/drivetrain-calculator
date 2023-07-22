const layoutA = {
    grid: {rows: 1, columns: 2},
    width: 1200,
    xaxis: {title: "Height of CG [m]",
            autorange: true},
    yaxis: {title: "Maximum acceleration [m/s^2]",
            autorange: true},
    xaxis2: {title: "Motor stall torque [Nm]",
            autorange: true},
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

const failmode_desc = ["Dual wheel slip (theoretical max)", "Wheelie", "Rear motor at stall torque", "Both motors at stall torque"];
const failmode_color = ['#00FF00', '#FF0000', '#FFFF00', '#FF8800'];


function plot_max_accel(){
    let mu = parseFloat(document.getElementById('number_input_mu').value);
    let l = parseFloat(document.getElementById('number_input_l').value);
    let h = parseFloat(document.getElementById('number_input_h').value);
    let m = parseFloat(document.getElementById('number_input_m').value);
    let r_t = parseFloat(document.getElementById('number_input_r_t').value);
    let T_stall = parseFloat(document.getElementById('number_input_T_stall_limited').value);
    let gear_ratio = parseFloat(document.getElementById('number_input_gear_ratio').value);

    var xValuesH;
    var yValuesH;
    var failModesH;
    [xValuesH,yValuesH, failModesH] = formula_ax_vs_h(mu, l, m, r_t, T_stall, gear_ratio);
    var traceH = {
        x: xValuesH,
        y: yValuesH,
        xaxis: 'x1',
        yaxis: 'y',
        type: 'lines',
        name: 'a_max'
    }

    var xValuesTStall;
    var yValuesTStall;
    var failModesT;
    [xValuesTStall,yValuesTStall, failModesT] = formula_ax_vs_t_stall(mu, l, h, m, r_t, gear_ratio);
    var traceT = {
                x:xValuesTStall, 
                y:yValuesTStall,
                xaxis: 'x2',
                yaxis: 'y', 
                type:"lines",
                name: 'T_stall'
            };
    
    const data = [traceH, traceT];
    new_layout = draw_vert_line(layoutA, h, T_stall);
    new_layout = draw_rect(new_layout, failModesH, xValuesH, 'x');
    new_layout = draw_rect(new_layout, failModesT, xValuesTStall, 'x2');

    Plotly.react("plot_window_accel", data, new_layout);
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

function draw_rect(old_layout, failModes, xValues, xref){
    var new_layout = old_layout;

    for (let i = 0; i < 4; i += 1){
        if (failModes.includes(i)){
            let min_index = failModes.indexOf(i);
            let max_index = failModes.lastIndexOf(i);
            new_layout.shapes.push(
                create_rect(failmode_color[i], xValues[min_index], xValues[max_index], xref)
            );
        }
    }

    return new_layout;
}

function create_rect(color, x0, x1, xref){
    return {
            type: 'rect',
            xref: xref,
            yref: 'paper',
            x0: x0,
            x1: x1,
            y0: 0,
            y1: 1,
            opacity: 0.1,
            fillcolor: color,
            line: {
                width: 0
            }
    }
}

function create_color_legend(){
    for (let i = 1; i <= 4; i += 1){
        let legend_text = document.getElementById("max_accel_legend_text" + i.toString());
        let text = document.createTextNode(failmode_desc[i-1]);
        legend_text.appendChild(text);
    
        let legend_color = document.getElementById("max_accel_legend_color" + i.toString());
        legend_color.style.backgroundColor = failmode_color[i-1];
    }
 
    
}