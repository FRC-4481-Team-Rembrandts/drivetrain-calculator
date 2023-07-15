function accel_vel_time_vs_x(max_vel, accel){
    const yValues = [];
    const xValues = [];

    for (let x = 0; x < 16.5; x += 0.01){
        let t = acceleration_velocity_time(max_vel, accel, x);

        xValues.push(x);
        yValues.push(t);
    }

    return [xValues, yValues];
}



//Determine the time it takes to cover a distance x, with acceleration accel and max velocity max_vel
function acceleration_velocity_time(max_vel, accel, x){
    let accel_x = max_velocity_distance(max_vel, accel); //Distance when max_vel is reached
    
    if (x < accel_x){
        //Max velocity is not reached
        let t = Math.sqrt(2*x/accel);
        return t;
    }

    //Max velocity is reached
    let t_accel = max_vel/accel; //Time that is spent accelerating
    let t_vel = (x-accel_x)/max_vel; //Time that is spent at constant velocity
    
    return t_accel + t_vel;
}


//Determine the distance that is covered before the maximum velocity is reached
function max_velocity_distance(max_vel, accel){
    let t = max_vel / accel;
    let x = 1/2 * accel * Math.pow(t,2);
    return x;
}