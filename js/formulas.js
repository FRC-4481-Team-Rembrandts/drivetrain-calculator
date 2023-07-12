function formula(mu, l, a, m, r_t, T_stall, gear_ratio){
    let b = l - a;
    let M_dmotor = T_stall * gear_ratio * 2;  //Max moment of two wheels combined limited by motor stall torque
    const yValues = [];
    const xValues = [];

    for (let x = 0; x <= 1; x += 0.01){
        let h = x;
        let a_x;
        // Theoretical maximum acceleration, forces and moments
        a_x = mu * g;

        let F_z1_max = (m*g*b)/l - (m*a_x*h)/l; //Vertical force on front wheels
        let F_z2_max = (m*g*a)/l + (m*a_x*h)/l; //Vertical force on rear wheels
        let F_z1 = F_z1_max;

        let M_d1_max = mu * F_z1_max * r_t; //Front wheels drive moment
        let M_d2_max = mu * F_z2_max * r_t; //Rear wheels drive moment
        let M_d2 = M_d2_max;

        //Maximum acceleration cannot result in negative vertical force on the
        //front wheel
        if (F_z1 < 0){
            //Acceleration when robot is at the limit of a wheelie
            F_z1 = 0;
            let F_z2 = m*g;

            a_x = -(l*(F_z1 - (b*g*m)/l))/(h*m);

            let F_x1 = 0;
            let F_x2 = m*a_x;

            let M_d1 = F_x1 * r_t;
            M_d2 = F_x2 * r_t;
        }

        //Required motor torque cannot be higher than stall torque of the motor
        if (M_d2 > M_dmotor){
            a_x = (20*M_dmotor - (mu*((20*M_dmotor*h)/l - (g*b*m)/(l)))/((h*mu)/l + 1))/m;
        }

        xValues.push(x);
        yValues.push(a_x)
    }

    return [xValues, yValues];
    
}