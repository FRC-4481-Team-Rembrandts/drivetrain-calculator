function torque_vs_I_in(T_stall, I_stall){
    const xValues = [];
    const yValues = [];

    for (let i = 0; i < I_stall; i += 0.1){
        let T = torque_current_in(T_stall, I_stall,i);

        xValues.push(i);
        yValues.push(T);
    }

    return [xValues, yValues];
}

function torque_vs_I_winding(T_stall, I_stall){
    const xValues = [];
    const yValues = [];

    for (let i = 0; i < I_stall; i += 0.1){
        let T = torque_current_winding(T_stall, I_stall,i);

        xValues.push(i);
        yValues.push(T);
    }

    return [xValues, yValues];
}


function torque_current_in(T_stall, I_stall, I_in){
    let T = Math.sqrt(I_in/I_stall) * T_stall;
    return T;
}

function torque_current_winding(T_stall, I_stall, I_w){
    let k_t = T_stall / I_stall;
    let T = k_t * I_w;
    return T;
}