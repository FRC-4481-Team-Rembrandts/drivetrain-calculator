const layoutSprint = {
    grid: {rows: 1, columns: 2, pattern: 'independent'},
    width: 1200,
    xaxis: {range: [0, 16.5],
            title: "Distance [m]"},
    yaxis: {range: [0, 5],
            title: "Time [s]"},
    xaxis2: {range: [0, 7.5],
            title: "Time [s]"},
    yaxis2: {range: [0, 16.5],
            title: "Distance [m], Velocity [m/s]"},
    //Annotations are used to display subplot title
    annotations: [{
        text: "Time against distance",
            font: {
            size: 16,
        },
        showarrow: false,
        align: 'center',
        x: 0.15, //position in x domain
        y: 1.2, //position in y domain
        xref: 'paper',
        yref: 'paper',
        },
        {
            text: "Distance against time",
            font: {
            size: 16,
        },
        showarrow: false,
        align: 'center',
        x: 0.89, //position in x domain
        y: 1.2,  // position in y domain
        xref: 'paper',
        yref: 'paper',
        }
        ],
    showlegend: false,
    };

function plot_sprint(){

    let max_vel_1 = parseFloat(document.getElementById('number_input_max_vel_1').value);
    let max_accel_1 = parseFloat(document.getElementById('number_input_max_accel_1').value);
    
    let max_vel_2 = parseFloat(document.getElementById('number_input_max_vel_2').value);
    let max_accel_2 = parseFloat(document.getElementById('number_input_max_accel_2').value);

    let x1;
    let y1;
    [x1,y1] = sprint_time_vs_x(max_vel_1,max_accel_1);
    var trace1 = {
        x: x1,
        y: y1,
        type: 'lines'
      };

      let x2;
      let y2;
      [x2,y2] = sprint_time_vs_x(max_vel_2,max_accel_2);
      
      var trace2 = {
        x: x2,
        y: y2,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'lines'
      };

      let x3;
      let y3;
      [y3,x3] = sprint_time_vs_x(max_vel_1,max_accel_1);
      
      var trace3 = {
        x: x3,
        y: y3,
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'lines'
      };

      let x4;
      let y4;
      [x4, y4] = v_vs_sprint_time(max_vel_1,max_accel_1);
      var trace4 = {
        x: x4,
        y: y4,
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'lines'
      };


      
      var data = [trace1, trace2, trace3, trace4];
      
      var layout = {
        grid: {rows: 1, columns: 2, pattern: 'independent'},
      };
      
      Plotly.newPlot('plot_window_sprint', data, layoutSprint);


}