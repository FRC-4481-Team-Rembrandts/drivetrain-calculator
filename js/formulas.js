function formula(a,b){
    const yValues = [];
    const xValues = [];

    for (let x = 0; x <= 1; x += 0.1){
        xValues.push(x);
        let y = m*a*x + b;
        yValues.push(y)
    }

    return xValues, yValues;
    
}