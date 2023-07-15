var layoutAV = {
        title: "Time against distance",
        xaxis: {range: [0, 16.5],
                title: "Distance [m]"},
        yaxis: {range: [0, 5],
                title: "Time [s]"}
        };

function plot_accel_vel_time(){
    
    var xValues1;
    var yValues1;
    [xValues1,yValues1] = accel_vel_time_vs_x(4,5.7);
    var trace1 = {
        x:xValues1, 
        y:yValues1, 
        mode:"lines"
        };

    var xValues2;
    var yValues2;
    [xValues2, yValues2] = accel_vel_time_vs_x(4.5, 5.1);
    var trace2 = {
        x:xValues2, 
        y:yValues2, 
        yAxis: 'y2',
        mode:"lines"
        };


    var data = [trace1, trace2];

    Plotly.newPlot("plot_window_t_vs_x", data, layoutAV);


}