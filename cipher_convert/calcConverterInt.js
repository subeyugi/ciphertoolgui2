function calculateInt_sub(vec){//数値で返す
    let level = getCalcLevel(vec);
    console.log("calculate_subInt", vec, level);

    for(let i = 0; i < vec.length - 1; i++){
        if(typeof(vec[i]) === "bigint" && typeof(vec[i + 1]) === "bigint") return new ConverterResult('', '数式に誤りがあります(数字連続)');
        if(['+', '-', '*', '/', '%'].indexOf(vec[i]) != -1 && ['+', '-', '*', '/', '%'].indexOf(vec[i + 1]) != -1) return new ConverterResult('', '数式に誤りがあります(演算子連続)');
    }
    if(['+', '-', '*', '/', '%'].indexOf(vec[vec.length - 1]) != -1) return new ConverterResult('', '数式に誤りがあります(末尾演算子)');

    let result = [];
    let cntOpen = 0;
    let left = -1;
    if(level == 1){ // (), floor(), sin(), cos()
        for(let i = 0; i < vec.length; i++){
            if(vec[i] == '('){
                if(cntOpen == 0) left = i + 1;
                cntOpen++;
            }else if(vec[i] == ')'){
                cntOpen--;
                if(cntOpen < 0) return new ConverterResult('', '数式に誤りがあります(かっこ未対応)');
                if(cntOpen == 0){
                    let tmp = calculateInt_sub(vec.slice(left, i));
                    if(tmp.message != '') return tmp;
                    
                    if(vec[left - 1] == '('){
                        result.push(tmp.result);
                    }
                }
            }else if(cntOpen == 0){
                result.push(vec[i]);
            }
        }
        if(cntOpen != 0) return new ConverterResult('', '数式に誤りがあります(かっこ未対応)');
        return calculateInt_sub(result);
    }else if(level == 2){   // ^

    }else if(level == 3){   // */%
        //+-で分割してから計算
        let left = 0;
        for(let i = 0; i < vec.length; i++){
            if(vec[i] == '+' || vec[i] == '-'){
                if(i == 0){
                    vec[1] *= -1;
                    left = 1;
                }else{
                    let tmp = calculateInt_sub(vec.slice(left, i));
                    if(tmp.message != '') return tmp;
                    result.push(tmp.result);
                    left = i + 1;
                    result.push(vec[i]);
                }
            }
        }
        let tmp = calculateInt_sub(vec.slice(left, vec.length));
        if(tmp.message != '') return tmp;
        result.push(tmp.result);
        return calculateInt_sub(result);
    }else if(level == 4){   // */%
        //先頭から順番に計算
        let result = 0n;
        let now = 0n;
        let symbol = '+';
        console.log("type4", vec);
        for(let i = 0; i < vec.length; i++){
            if(vec[i] == '*' || vec[i] == '/' || vec[i] == '%'){
                if(symbol == '+'){
                    result += now;
                }else if(symbol == '*'){
                    result *= now;
                }else if(symbol == '/'){
                    result /= now;
                }else if(symbol == '%'){
                    result %= now;
                }
                now = 0n;
                symbol = vec[i];
            }else{
                now = vec[i];
            }
        }
        if(symbol == '+'){
            result += now;
        }else if(symbol == '*'){
            result *= now;
        }else if(symbol == '/'){
            result /= now;
        }else if(symbol == '%'){
            result %= now;
        }
        console.log(result, now);
        return new ConverterResult(result, '');
    }else if(level == 5){   //+-
        let result = 0n;
        let now = 0n;
        let symbol = '+';
        console.log(vec);
        for(let i = 0; i < vec.length; i++){
            if(vec[i] == '+'){
                console.log(typeof(now), typeof(symbol == '+' ? 1n : -1n));
                result += now * (symbol == '+' ? 1n : -1n);
                now = "";
                symbol = '+';
            }else if(vec[i] == '-'){
                result += now * (symbol == '+' ? 1n : -1n);
                now = "";
                symbol = '-';
            }else{
                now = BigInt(vec[i]);
            }
        }
        result += now * (symbol == '+' ? 1n : -1n);
        return new ConverterResult(result, '');
    }
    
    return new ConverterResult(vec[0], '');
}

function calculateInt(s, variable, isVec = false){
    let message = '';
    if(isVec){
        //console.log(s, variable);
        let result = '';
        let vec = [];
        Object.entries(variable).forEach(tmp => {
            let id = tmp[0];
            let val = tmp[1];
            for(let i = 0; i < val.length; i++){
                if(vec.length < i + 1) vec[i] = [];
                for(let j = 0; j < val[i].length; j++){
                    if(vec[i].length < j + 1) vec[i][j] = [];
                    for(let k = 0; k < val[i][j].length; k++){
                        if(vec[i][j].length < val[i][j].length) vec[i][j][k] = {};
                        vec[i][j][k][id] = val[i][j][k] != undefined ? val[i][j][k] : "";
                    }
                }
            }
        });

        for(let i = 0; i < vec.length; i++){
            for(let j = 0; j < vec[i].length; j++){
                for(let k = 0; k < vec[i][j].length; k++){
                    let tmp = calculateInt(s, vec[i][j][k]);
                    vec[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(vec, message);
    }else{
        let result = [];
        let now = '';   //数字をためておく
        let startIdx = -1;//{の開始位置
        for(let i = 0; i < s.length; i++){
            if(s[i] == ' '){

            }else if(startIdx == -1 && (s[i] >= '0' && s[i] <= '9' || s[i] == '.')){
                now += s[i];
            }else if(startIdx == -1 && s.substring(i, Math.min(i + 2, s.length)) == "PI"){
                result.push(3.141592653589793238462643);
                i += 1;
            }else if(startIdx == -1 && s.substring(i, Math.min(i + 6, s.length)) == "floor("){
                result.push("floor(");
                i += 5;
            }else if(startIdx == -1 && s.substring(i, Math.min(i + 5, s.length)) == "ceil("){
                result.push("ceil(");
                i += 4;
            }else if(startIdx == -1 && s.substring(i, Math.min(i + 4, s.length)) == "sin("){
                result.push("sin(");
                i += 3;
            }else if(startIdx == -1 && s.substring(i, Math.min(i + 4, s.length)) == "cos("){
                result.push("cos(");
                i += 3;
            }else if(s[i] == '{'){
                if(startIdx == -1){
                    startIdx = i + 1;
                }else{
                    return new ConverterResult('', '数式に誤りがあります');
                }
            }else if(s[i] == '}'){
                if(startIdx != -1){
                    let tmp = variable[s.substring(startIdx, i)];
                    if(tmp == undefined) return new ConverterResult('', `"${s.substring(startIdx, i)}"が見つかりません`);
                    console.log(tmp);
                    result.push(BigInt(tmp));
                    startIdx = -1;
                }else{
                    return new ConverterResult('', '数式に誤りがあります');
                }
            }else if(startIdx == -1){
                if(now != ''){
                    result.push(BigInt(now));
                }
                now = '';
                result.push(s[i]);
            }
        }
        if(startIdx != -1){
            return new ConverterResult('', '数式に誤りがあります');
        }

        if(now != ''){
            result.push(BigInt(now));
        }
        for(let i = 0; i < result.length; i++){
            if(result[i] in variable){
                result[i] = variable[result[i]];
            }
        }
        let result2 = calculateInt_sub(result);
        return new ConverterResult(result2.result.toString(), result2.message);
    }
}

calculateInt("35*23*", {});