function sprint_time_vs_x(v_max, a_max){
    const yValues = [0];
    const xValues = [0];

    let t = 0;
    let x = 0;
    let max_x = 16.5; //Field length

    while (x < max_x){
        t += 0.01;
        x = sprint_distance(v_max, a_max, t);

        xValues.push(x);
        yValues.push(t);
    }

    return [xValues, yValues];
}

function v_vs_sprint_time(v_max, a_max){
    const yValues = [];
    const xValues = [];

    for (let t = 0; t < 7.5; t += 0.01){
        let v = sprint_velocity(v_max, a_max, t);

        xValues.push(t);
        yValues.push(v);
    }

    return [xValues, yValues];
}

function a_vs_sprint_time(v_max, a_max){
    const xValues = [];
    const yValues = [];

    for (let t = 0; t < 7.5; t += 0.01){
        let a = sprint_acceleration(v_max,a_max,t);

        xValues.push(t);
        yValues.push(a);
    }

    return [xValues, yValues];
}

//Calculate the distance that is covered in a sprint at a certain time 
//with certain maximum velocity (v_max) and maximum acceleration (a_max)
function sprint_distance(v_max, a_max, t){
    let x;
    x = v_max * (t + (v_max/a_max) * Math.exp(-(a_max/v_max) * t) - v_max/a_max);
    return x;
}

//Calculate the velocity in a sprint at a certain time 
//with certain maximum velocity (v_max) and maximum acceleration (a_max)
function sprint_velocity(v_max, a_max, t){
    let v;
    v = v_max * (1 - Math.exp(-(a_max/v_max) * t));
    return v;
}

//Calculate the acceleration in a sprint at a certain time 
//with certain maximum velocity (v_max) and maximum acceleration (a_max)
function sprint_acceleration(v_max, a_max, t){
    let a;
    a = a_max * Math.exp(-(a_max/v_max)*t);
    return a;
}

