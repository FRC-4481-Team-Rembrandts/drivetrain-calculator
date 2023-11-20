const layoutSim2 = {
    width: 1200,
    xaxis: {autorange: true,
            title: "Time [s]"},
    yaxis: {autorange: true,
            title: "Units"},
    yaxis2: {autorange: true,
            title: "Motor torque [Nm]",
            anchor: 'x1',
            overlaying: 'y1',
            side: 'right'},
    title: "Test",
    showlegend: true,
    legend: {
      x: 1.35,
      xanchor: 'left',
      y: 1
    }
    };

// Sim contants
var sim2 = {};

// Import values from HTML
function update_input_sim2(){
    sim2.kv = parseFloat(document.getElementById('number_input_kv_sim2').value);
    sim2.R_winding = parseFloat(document.getElementById('number_input_R_winding_sim2').value);

    sim2.kf = parseFloat(document.getElementById('number_mu_input_sim2').value);
    sim2.gear_ratio = parseFloat(document.getElementById('number_input_gear_ratio_sim2').value);
    sim2.efficiency = parseFloat(document.getElementById('number_input_efficiency_sim2').value);
    sim2.Intertia = parseFloat(document.getElementById('number_input_Inertia_sim2').value);

    sim2.I_lim = parseFloat(document.getElementById('number_input_I_lim_sim2').value);
    sim2.V_applied = parseFloat(document.getElementById('number_input_V_applied_sim2').value);
    sim2.looper_dt = parseFloat(document.getElementById('number_looper_dt_sim2').value);

    sim2.dt = parseFloat(document.getElementById('number_dt_input_sim2').value);
    sim2.t_max = parseFloat(document.getElementById('number_t_max_sim2').value);
    sim2.w_target = parseFloat(document.getElementById('number_w_target_sim2').value);
}

function compute_sim2(sim){
    let output = {rev_arr:[],w_arr:[],w_target_arr:[],t_arr:[],T_motor_arr:[],V_applied_arr:[], w_err_arr:[]};

    let rev = 0;
    let w_motor = 0;
    let T_motor = 0;
    let t = 0;
    let w_motion_profile = 0;
    let a_motion_profile = 0;
    let V_applied = 0;

    output.time_to_target_w_motor = NaN;

    let n = 0;
    let looper_step = Number.parseInt(sim.looper_dt/sim.dt);

    let a_max = sim.I_lim * 8.3 / sim.kv / sim.Intertia * 9.5; 
    console.log("a max: " + a_max);
    let last_a_target = NaN;
    let a_target = 0;
    const magic_dt = 0.02; // looper dt? acceleration to get to target speed in one dt
    const jerk_limit = 200000;

    const profile_amplitude = 100;
    const profile_period = 2;
    function motion_profile_speed(t) {
        return sim.w_target + profile_amplitude * Math.sin(t*t * Math.PI/profile_period);
    }

    function motion_profile_accel(t) {
        return profile_amplitude * Math.cos(t* Math.PI/profile_period) * Math.PI/profile_period;
        
    }
    // function motion_profile_jerk(t) {
    //     return - profile_amplitude * Math.sin(t* Math.PI/profile_period) * (Math.PI/profile_period)^2;
    // }
    
    // simulation loop
    while (t <= sim.t_max) {

        w_motion_profile = motion_profile_speed(t);
        a_motion_profile = motion_profile_accel(t);

        if (n % looper_step == 0) {
    
            // acceleration to reach target rpm in one magic_dt
            let dw = motion_profile_speed(t) - w_motor;            
            // a_target = Math.sign(dw) * Math.min(a_max, Math.abs(dw/magic_dt));
            a_target = dw/magic_dt;

            // use known acceleration
            // a_target = a_motion_profile;
            // if (Math.abs(a_target) > a_max) {
            //     console.log('passed max acceleration, t= ' + t + ', a=' + a_target);
            // }

            if (Number.isNaN(last_a_target)) {
                last_a_target = a_target;
            }

            // let jerk = (last_a_target - a_target)/sim.looper_dt;

            // if (Math.abs(jerk) > jerk_limit) {
            //     console.log(jerk, last_a_target, a_target);
            //     a_target = last_a_target - Math.sign(jerk) * jerk_limit * sim.looper_dt;
            //     console.log(a_target);
            // }

            
            let V_ideal = w_motor / sim.kv + sim.R_winding * sim.kv / 8.3 * sim.Intertia * a_target / 9.5;

            
            V_applied = Math.sign(V_ideal) * Math.min(12, Math.abs(V_ideal));
        }

        // let I_winding = (sim.V_applied - w_motor / sim.kv)/sim.R_winding;
        let I_winding = (V_applied - w_motor / sim.kv)/sim.R_winding;

        if (Math.abs(I_winding) > sim.I_lim) {
            I_winding = Math.sign(I_winding) * sim.I_lim;
        }

        T_motor = I_winding * 8.3 / sim.kv;
        let T_friction = sim.kf * w_motor;

        let ang_accel = T_motor/sim.Intertia * 9.5; // rad/s^2 to RPM/s 

        w_motor += ang_accel * sim.dt;
        rev += w_motor * sim.dt;

        if (!output.time_to_target_w_motor && Math.abs(w_motor - sim.w_target) < 10 ) {
            output.time_to_target_w_motor = t;
        }

        output.rev_arr.push(rev);
        output.w_arr.push(w_motor);
        output.w_target_arr.push(w_motion_profile);
        output.T_motor_arr.push(T_motor);
        output.t_arr.push(t);
        output.V_applied_arr.push(V_applied);
        output.w_err_arr.push(Math.abs(w_motion_profile - w_motor));

        t += sim.dt;
        n += 1;
        last_a_target = a_target;
    }

    return output;
}

// Plot sim
function plot_sim2(){  
    // Update values 
    update_input_sim2();

    // Compute sim
    let output = compute_sim2(sim2);
    
    // Show sim
    var rev_trace = {
        x: output.t_arr,
        y: output.rev_arr,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'lines',
        name: 'Revolutions'
    };
    var w_trace = {
        x: output.t_arr,
        y: output.w_arr,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'lines',
        name: 'Current angular velocity [RPM]'
    };
    var w_motion_trace = {
        x: output.t_arr,
        y: output.w_target_arr,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'lines',
        name: 'Target angular velocity [RPM]'
    };
    var torque_motor_trace = {
        x: output.t_arr,
        y: output.T_motor_arr,
        xaxis: 'x1',
        yaxis: 'y2',
        type: 'lines',
        name: 'Motor torque [Nm]'
    };
    var v_applied_trace = {
        x: output.t_arr,
        y: output.V_applied_arr,
        xaxis: 'x1',
        yaxis: 'y2',
        type: 'lines',
        name: 'Applied voltage [V]'
    };

    // var data = [rev_trace, w_trace, w_motion_trace];
    var data = [rev_trace, w_trace, w_motion_trace, torque_motor_trace, v_applied_trace];
    var data = [w_trace, w_motion_trace, torque_motor_trace, v_applied_trace];

    Plotly.react('plot_window_sim2', data, layoutSim2);

    document.getElementById("time_to_target_w").innerHTML = "Time till target speed " + output.time_to_target_w_motor.toFixed(2) + " seconds ";

    document.getElementById("w_err_mean").innerHTML = "Mean absolute error of motor speed " + (output.w_err_arr.reduce((a, b) => a + b) / output.w_err_arr.length).toFixed(2);
    
}