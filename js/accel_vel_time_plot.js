const layout = {title: "Time against distance",
                xaxis: {range: [0, 10],
                        title: "Distance [m]"},
                yaxis: {range: [0, 4],
                        title: "Time [s]"}};

function inputChange(){
    

    [xValues,yValues] = accel_vel_time_vs_x(5,10);
    const data = [{x:xValues, y:yValues, mode:"lines"}];

    Plotly.newPlot("plot_window_t_vs_x", data, layout);


}