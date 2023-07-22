const layoutSprint = {
    grid: {rows: 1, columns: 2, pattern: 'independent'},
    width: 1200,
    xaxis: {autorange: true,
            title: "Distance [m]"},
    yaxis: {autorange: true,
            title: "Time [s]"},
    xaxis2: {autorange: true,
            title: "Time [s]"},
    yaxis2: {autorange: true,
            title: "Distance [m], Velocity [m/s]"},
    yaxis3: {autorange: true,
            title: "Acceleration [m/s^2]",
            anchor: 'x2',
            overlaying: 'y2',
            side: 'right'},
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
            text: "Robot sprint against time",
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
    showlegend: true,
    legend: {
      x: 1.22,
      xanchor: 'right',
      y: 1.1
    }
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
        type: 'lines',
        name: 'Sprint #1'
      };

      let x2;
      let y2;
      [x2,y2] = sprint_time_vs_x(max_vel_2,max_accel_2);
      var trace2 = {
        x: x2,
        y: y2,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'lines',
        name: 'Sprint #2'
      };

      let x3;
      let y3;
      [y3,x3] = sprint_time_vs_x(max_vel_1,max_accel_1);
      var trace3 = {
        x: x3,
        y: y3,
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'lines',
        name: 'Distance #1'
      };

      let x4;
      let y4;
      [x4, y4] = v_vs_sprint_time(max_vel_1,max_accel_1);
      var trace4 = {
        x: x4,
        y: y4,
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'lines',
        name: 'Velocity #1'
      };

      let x5;
      let y5;
      [x5, y5] = a_vs_sprint_time(max_vel_1, max_accel_1);
      var trace5 = {
        x: x5,
        y: y5,
        xaxis: 'x2',
        yaxis: 'y3',
        type: 'lines',
        name: 'Acceleration #1'
      }

      
      var data = [trace1, trace2, trace3, trace4, trace5];
      
      Plotly.react('plot_window_sprint', data, layoutSprint);


}