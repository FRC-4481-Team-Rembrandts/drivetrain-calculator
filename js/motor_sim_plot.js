const layoutSim = {
    width: 700,
    xaxis: {autorange: true,
            title: "Time [s]"},
    yaxis: {autorange: true,
            title: "Units"},
    title: "Test",
    showlegend: true,
    legend: {
      x: 1.35,
      xanchor: 'left',
      y: 1
    }
    };

// Sim contants
var sim = {};

const MOTOR_DATA = {
    'falcon' : {
        T_stall: 4.69,
        I_stall: 257,
        V_free: 6380
    },
    'neo' : {
        T_stall: 3.28,
        I_stall: 181,
        V_free: 5820
    },
    'neo550' : {
        T_stall: 1.08,
        I_stall: 111,
        V_free: 11710
    },
}

// Take over table values
function take_over(type){
    document.getElementById('number_input_T_stall_sim').value = MOTOR_DATA[type].T_stall;
    document.getElementById('number_input_I_stall_sim').value = MOTOR_DATA[type].I_stall;
    document.getElementById('number_input_V_free_sim').value = MOTOR_DATA[type].V_free;
}

// Import values from HTML
function update_input_sim(){
    sim.T_stall = parseFloat(document.getElementById('number_input_T_stall_sim').value);
    sim.I_stall = parseFloat(document.getElementById('number_input_I_stall_sim').value);
    sim.V_free = parseFloat(document.getElementById('number_input_V_free_sim').value);
    // sim.v_max = parseFloat(document.getElementById('number_input_v_max_sim').value);

    sim.mu = parseFloat(document.getElementById('number_input_mu_sim').value);
    sim.l = parseFloat(document.getElementById('number_input_l_sim').value);
    sim.h = parseFloat(document.getElementById('number_input_h_sim').value);
    sim.m = parseFloat(document.getElementById('number_input_m_sim').value);
    sim.r_t = parseFloat(document.getElementById('number_input_r_t_sim').value);
    sim.gear_ratio = parseFloat(document.getElementById('number_input_gear_ratio_sim').value);
    sim.eff = parseFloat(document.getElementById('number_input_efficiency_sim').value);

    sim.I_lim = parseFloat(document.getElementById('number_input_I_lim_sim').value);
    
    sim.dt = parseFloat(document.getElementById('number_input_dt_sim').value);
    sim.t_max = parseFloat(document.getElementById('number_input_t_max_sim').value);
    sim.t_pos = parseFloat(document.getElementById('number_input_t_pos_sim').value);
}

function test(){
    let t = 0;
    let a = 0;

    let xValues = [];
    let yValues = [];

    for (let index = 0; index < 100; index++) {
        xValues.push(t + sim.t_max);
        yValues.push(a);

        t += 1;
        a += 1;
        
    }

    return [xValues, yValues];
}

function compute_sim(sim){
    let output = {a_arr:[],v_arr:[],x_arr:[],t_arr:[],T_arr:[]};

    let a = 0;
    let v = 0;
    let x = 0;
    let T = 0;
    let t = 0;

    output.v_max = sim.V_free / 60 / sim.gear_ratio * 2 * Math.PI * sim.r_t;

    T_stall_lim = torque_current_in(sim.T_stall, sim.I_stall, sim.I_lim);
    v_no_lim = output.v_max * (1 - T_stall_lim / sim.T_stall);

    
    // simulation loop
    while (t <= sim.t_max) {

        if (v < v_no_lim) {
            T = T_stall_lim;
        } else {
            T = sim.T_stall*(1- v/output.v_max);
        }

        a = formula_ax(sim.mu, sim.l, sim.h, sim.m, sim.r_t, T, sim.gear_ratio)[0];
        v += a * sim.dt;
        x += v * sim.dt;
        // x = T;

        output.a_arr.push(a);
        output.v_arr.push(v);
        output.x_arr.push(x);
        output.t_arr.push(t);
        output.T_arr.push(T);

        t += sim.dt;
    }

    return output;
}

// Plot sim
function plot_sim(){  
    // Update values 
    update_input_sim();

    // Compute sim
    let output = compute_sim(sim);
    
    // Show sim
    var accel_trace = {
        x: output.t_arr,
        y: output.a_arr,
        type: 'lines',
        name: 'Acceleration'
    };
    var vel_trace = {
        x: output.t_arr,
        y: output.v_arr,
        type: 'lines',
        name: 'Velocity'
    };
    var pos_trace = {
        x: output.t_arr,
        y: output.x_arr,
        type: 'lines',
        name: 'Position'
    };
    var torque_trace = {
        x: output.t_arr,
        y: output.T_arr,
        type: 'lines',
        name: 'Torque'
    };
    var data = [accel_trace, vel_trace, pos_trace, torque_trace];

    Plotly.react('plot_window_sim', data, draw_vert_line_torque(layoutSim, sim.t_pos));

    document.getElementById("max_speed").innerHTML = "Theoretical calculated max speed is " + output.v_max.toFixed(2) + " m/s ";
    document.getElementById("position_outcome").innerHTML = "Distance at t = " + sim.t_pos + " is " + output.x_arr[Math.round(sim.t_pos/sim.dt)].toFixed(2) + " meters";
}