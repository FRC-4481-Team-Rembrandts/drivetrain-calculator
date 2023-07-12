clear; clc; close all

%% Constants
g = 9.81;

%% Robot and wheel parameters
mu = 0.9; %Coefficient of friction
l = 0.55; %Wheel base distance
a = l/2;
b = l/2;
h = 0.40; %Height of CG
m = 55; %Mass of the robot
r_t = 0.05; %Wheel radius
T_stall = 1.4; %Emperical stall torque of NEO v1.1 @60 Amps
gear_ratio = 5; %Gear ratio of REV MAX Swerve
M_dmotor = T_stall * gear_ratio * 2; %Max moment of two wheels combined limited by motor stall torque

%% Determining maximum acceleration
clc

a_max = mu * g %Theoretical maximum acceleration

F_z1_max = (m*g*b)/l - (m*a_max*h)/l %Vertical force on front wheels
F_z2_max = (m*g*a)/l + (m*a_max*h)/l %Vertical force on rear wheels

M_d1_max = mu * F_z1_max * r_t %Front wheels drive moment
M_d2_max = mu * F_z2_max * r_t %Rear wheels drive moment

%% Determining acceleration at max motor torque
clc
syms F_z1_ F_z2_

%When the maximum moment a NEO can deliver is smaller than 
%the moment required for maximum acceleration calculated previously
%the maximum longitudonal force from the rear wheel is limited
%by the motor stall torque
F_x1_ = mu * F_z1_;
F_x2 = M_dmotor / r_t; 

eq_ax = (F_x1_ + F_x2)/m;

eq_F_z1 = F_z1_ == (m*g*b)/l - (m*eq_ax*h)/l;
eq_F_z2 = F_z2_ == (m*g*a)/l + (m*eq_ax*h)/l;

F_z1 = double(rhs(isolate(eq_F_z1, F_z1_)))
F_z2 = double(rhs(subs(eq_F_z2, F_z1_, F_z1)))

M_d1 = mu * F_z1 * r_t
M_d2 = M_dmotor

a_x = double(subs(eq_ax, F_z1_, F_z1))


%% Acceleration when robot is at the limit of wheelie
clc;
syms a_x_

F_z1 = 0;
F_z2 = m*g;

eq_F_z1 = F_z1_ == (m*g*b)/l - (m*a_x_*h)/l;
eq_ax = subs(eq_F_z1, F_z1_, F_z1);
eq_ax = isolate(eq_ax,a_x_);
a_x = double(rhs(eq_ax))

F_x1 = 0;
F_x2 = m*a_x;

M_d1 = F_x1 * r_t
M_d2 = F_x2 * r_t

%% Mooie plotjes
clc; close all;
syms F_z1_ F_z2_ a_x_

h_list = 0.05:0.01:1;
ax_list = zeros(length(h_list),4);
limit_list = zeros(length(h_list),4);
F_z1_list = zeros(length(h_list),4);
M_motor_list = T_stall * [0.5 0.75 1 1.25 1.5 2 2.5];
M_d_list = M_motor_list * gear_ratio * 2;

hold on
for i = 1:length(M_motor_list)
    M_d_i = M_d_list(i);
    for j = 1:length(h_list)
        k = 0;
        h_i = h_list(j);

        %Theoretical maximum acceleration, forces and moments
        a_x = mu * g; %Theoretical maximum acceleration

        F_z1_max = (m*g*b)/l - (m*a_x*h_i)/l; %Vertical force on front wheel
        F_z2_max = (m*g*a)/l + (m*a_x*h_i)/l; %Vertical force on rear wheel
        F_z1 = F_z1_max;

        M_d1_max = mu * F_z1_max * r_t; %Front wheel drive moment
        M_d2_max = mu * F_z2_max * r_t; %Rear wheel drive moment
        M_d2 = M_d2_max;

        %Maximum acceleration cannot result in negative vertical force on the
        %front wheel
        if (F_z1 < 0)
            k = k + 1;
            % Acceleration when robot is at the limit of a wheelie
            F_z1 = 0;
            F_z2 = m*g;

            eq_F_z1 = F_z1_ == (m*g*b)/l - (m*a_x_*h_i)/l;
            eq_ax = subs(eq_F_z1, F_z1_, F_z1);
            eq_ax = isolate(eq_ax,a_x_);
            a_x = double(rhs(eq_ax));

            F_x1 = 0;
            F_x2 = m*a_x;

            M_d1 = F_x1 * r_t;
            M_d2 = F_x2 * r_t;
        end

        %Required motor torque cannot be higher than stall torque of the motor
        if (M_d2 > M_d_i)
            k = k + 1;
            F_x1_ = mu * F_z1_;
            F_x2 = M_d_i / r_t; 

            eq_ax = (F_x1_ + F_x2)/m;

            eq_F_z1 = F_z1_ == (m*g*b)/l - (m*eq_ax*h_i)/l;
            eq_F_z2 = F_z2_ == (m*g*a)/l + (m*eq_ax*h_i)/l;

            F_z1 = double(rhs(isolate(eq_F_z1, F_z1_)));
            F_z2 = double(rhs(subs(eq_F_z2, F_z1_, F_z1)));

            M_d1 = mu * F_z1 * r_t;
            M_d2 = M_d_i;

            a_x = double(subs(eq_ax, F_z1_, F_z1));
        end
        ax_list(j,i) = a_x;
        limit_list(j,i) = k;
        F_z1_list(j,i) = F_z1;
    end
end


plot(h_list,ax_list)
grid on 
xlabel('Height of CG [m]')
ylabel('Maximum acceleration [m/s^2]')
title(textwrap("Maximum acceleration of the swerve limited by friction, wheelie or motor against CG heights for different motor stall torque",70))
ylim([0 9.81])

M_motor_list_string = string(M_motor_list);
for i = 1:length(M_motor_list)
    M_motor_list_string(i) = M_motor_list_string(i) + " Nm";
end
legend(M_motor_list_string)

figure 
plot(h_list, F_z1_list)
legend(M_motor_list_string)


