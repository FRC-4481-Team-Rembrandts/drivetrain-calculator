function formula_ax_vs_h(mu, l, m, r_t, T_stall, gear_ratio){
    let M_dmotor = T_stall * gear_ratio * 2;  //Max moment of two wheels combined limited by motor stall torque
    const yValues = [];
    const xValues = [];

    for (let x = 0; x <= 1; x += 0.01){
        let h = x;
        let a_x = formula_ax(mu,l,h,m,r_t,T_stall, gear_ratio);

        xValues.push(x);
        yValues.push(a_x)
    }

    return [xValues, yValues];
    
}

function formula_ax_vs_t_stall(mu, l, h, m, r_t, gear_ratio){
    const yValues = [];
    const xValues = [];

    for (let x = 0; x <= 6; x += 0.01){
        let T_stall = x;
        a_x = formula_ax(mu, l, h, m, r_t, T_stall, gear_ratio);

        xValues.push(x);
        yValues.push(a_x);
    }

    return [xValues, yValues];
    
}

function formula_ax(mu, l, h, m, r_t, T_stall, gear_ratio){
    let b = l/2;
    let a = l/2;
    let M_dmotor = T_stall * gear_ratio * 2;  //Max moment of two wheels combined limited by motor stall torque
    let a_x;
    let M_d1;
    let M_d2;
    // Theoretical maximum acceleration, forces and moments
    a_x = mu * g;

    let F_z1_max = (m*g*b)/l - (m*a_x*h)/l; //Vertical force on front wheels
    let F_z2_max = (m*g*a)/l + (m*a_x*h)/l; //Vertical force on rear wheels
    let F_z1 = F_z1_max;

    let M_d1_max = mu * F_z1_max * r_t; //Front wheels drive moment
    let M_d2_max = mu * F_z2_max * r_t; //Rear wheels drive moment
    M_d2 = M_d2_max;

    //Maximum acceleration cannot result in negative vertical force on the
    //front wheel
    if (F_z1 < 0){
        //Acceleration when robot is at the limit of a wheelie
        F_z1 = 0;
        let F_z2 = m*g;

        a_x = -(l*(F_z1 - (b*g*m)/l))/(h*m);

        let F_x1 = 0;
        let F_x2 = m*a_x;

        M_d2 = F_x2 * r_t;
    }

    //Required motor torque cannot be higher than stall torque of the rear motor
    if (M_d2 > M_dmotor){
        //Assume F_x1 = mu*F_z1
        a_x = (M_dmotor*l + b*g*m*mu*r_t)/(m*r_t*(l + h*mu));

        let F_z1 = -(M_dmotor*h - b*g*m*r_t)/(r_t*(l + h*mu));
        let F_x1 = mu * F_z1;
        M_d1 = F_x1 * r_t;
    }

    //Check if front wheel does not exceed torque limits
    if (M_d1 > M_dmotor){
        a_x = (2*M_dmotor)/(m*r_t);
    }

    return a_x;
}