/*
制約
* 10進数で入力されている
* 変数に値が代入されている
* 数式として成り立っている

計算方法
* 文字列数式を配列に変換する
    - 数字は１つの要素にまとめる
    ― それ以外の変数、記号は1文字ごとに別要素に入れる
*/

// 優先順位
// 1: (), floor(), ceil()
// 2: ^
// 3: *, /, %
// 4: *,/,%のみ（+-を含まない）
// 5: +, -
// 6: 数字のみ

function getCalcLevel(s){
    let result = 6;
    let hasPlusMinus = false;
    for(let i = 0; i < s.length; i++){
        if(s[i] == '(' || s[i] == ')'){
            result = Math.min(result, 1);
        }else if(s[i] == '^'){
            result = Math.min(result, 2);
        }else if(s[i] == '*' || s[i] == '/' || s[i] == '%'){
            result = Math.min(result, 3);
        }else if(s[i] == '+' || s[i] == '-'){
            result = Math.min(result, 5);
            hasPlusMinus = true;
        }
    }

    if(result == 3 && !hasPlusMinus) result = 4;
    return result;
}

function calculate_sub(vec){//数値で返す
    let level = getCalcLevel(vec);
    //console.log("start", vec);

    for(let i = 0; i < vec.length - 1; i++){
        if(!isNaN(vec[i]) && !isNaN(vec[i + 1])) return new ConverterResult('', '数式に誤りがあります(数字連続)');
        if(['+', '-', '*', '/', '%'].indexOf(vec[i]) != -1 && ['+', '-', '*', '/', '%'].indexOf(vec[i + 1]) != -1) return new ConverterResult('', '数式に誤りがあります(演算子連続)');
    }

    let result = [];
    let cntOpen = 0;
    let left = -1;
    if(level == 1){ // ()=
        for(let i = 0; i < vec.length; i++){
            if(vec[i] == '('){
                if(cntOpen == 0) left = i + 1;
                cntOpen++;
            }else if(vec[i] == ')'){
                cntOpen--;
                if(cntOpen < 0) return new ConverterResult('', '数式に誤りがあります(かっこ未対応)');
                if(cntOpen == 0){
                    let tmp = calculate_sub(vec.slice(left, i));
                    if(tmp.message != '') return tmp;
                    result.push(tmp.result);
                }
            }else if(cntOpen == 0){
                result.push(vec[i]);
            }
        }
        if(cntOpen != 0) return new ConverterResult('', '数式に誤りがあります(かっこ未対応)');
        return calculate_sub(result);
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
                    let tmp = calculate_sub(vec.slice(left, i));
                    if(tmp.message != '') return tmp;
                    result.push(tmp.result);
                    left = i + 1;
                    result.push(vec[i]);
                }
            }
        }
        let tmp = calculate_sub(vec.slice(left, vec.length));
        if(tmp.message != '') return tmp;
        result.push(tmp.result);
        return calculate_sub(result);
    }else if(level == 4){   // */%
        //先頭から順番に計算
        let result = 0;
        let now = 0;
        let symbol = '+';
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
                now = 0;
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
        return new ConverterResult(result, '');
    }else if(level == 5){   //+-
        let result = 0;
        let now = 0;
        let symbol = '+';
        //console.log(vec);
        for(let i = 0; i < vec.length; i++){
            if(vec[i] == '+'){
                result += now * (symbol == '+' ? 1 : -1);
                now = "";
                symbol = '+';
            }else if(vec[i] == '-'){
                result += now * (symbol == '+' ? 1 : -1);
                now = "";
                symbol = '-';
            }else{
                now = vec[i];
            }
        }
        result += now * (symbol == '+' ? 1 : -1);
        //console.log("end  ", vec, result);
        return new ConverterResult(result, '');
    }
    
    //console.log("end  ", vec[0]);
    return new ConverterResult(vec[0], '');
}

function calculate(s, variable, isVec = false){
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
                    let tmp = calculate(s, vec[i][j][k]);
                    vec[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(vec, message);
    }else{
        let result = [];
        let now = '';   //数字をためておく
        let startIdx = -1;
        for(let i = 0; i < s.length; i++){
            if(s[i] == ' '){

            }else if(startIdx == -1 && (s[i] >= '0' && s[i] <= '9' || s[i] == '.')){
                now += s[i];
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
                    result.push(parseFloat(tmp));
                    startIdx = -1;
                }else{
                    return new ConverterResult('', '数式に誤りがあります');
                }
            }else if(startIdx == -1){
                if(now != ''){
                    result.push(parseFloat(now));
                }
                now = '';
                result.push(s[i]);
            }
        }
        if(startIdx != -1){
            return new ConverterResult('', '数式に誤りがあります');
        }

        if(now != ''){
            result.push(parseFloat(now));
        }
        for(let i = 0; i < result.length; i++){
            if(result[i] in variable){
                result[i] = variable[result[i]];
            }
        }
        return calculate_sub(result);
    }
}
