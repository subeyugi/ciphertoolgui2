/*
制約
* 10進数で入力されている
* 変数名は1文字
* 変数に値が代入されている
* 数式として成り立っている

計算方法
* 文字列数式を配列に変換する
    - 数字は１つの要素にまとめる
    ― それ以外の変数、記号は1文字ごとに別要素に入れる
*/

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
    console.log("start", vec);

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
                if(cntOpen == 0){
                    result.push(calculate_sub(vec.slice(left, i)));
                }
            }else if(cntOpen == 0){
                result.push(vec[i]);
            }
        }
        result = calculate_sub(result);
        //console.log("end  ", vec, result);
        return result;
    }else if(level == 2){   // ^

    }else if(level == 3){   // */%
        //+-で分割してから計算
        let left = 0;
        for(let i = 0; i < vec.length; i++){
            if(vec[i] == '+' || vec[i] == '-'){
                result.push(calculate_sub(vec.slice(left, i)));
                left = i + 1;
                result.push(vec[i]);
            }
        }
        result.push(calculate_sub(vec.slice(left, vec.length)));
        result = calculate_sub(result);
        return result;
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
        console.log("end  ", vec, result);
        return result;
    }else if(level == 5){   //+-
        let result = 0;
        let now = 0;
        let symbol = '+';
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
        console.log("end  ", vec, result);
        return result;
    }
    
    console.log("end  ", vec[0]);
    return vec[0];
}

function calculate(s, vals, isVec=false){
    console.log("calculate", s, vals);
    let result = [];
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = calculate(s[i][j][k], vals);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        console.log("calc2", s, vals);
        let now = '';   //数字をためておく
        for(let i = 0; i < s.length; i++){
            if(s[i] >= '0' && s[i] <= '9'){
                now += s[i];
            }else{
                if(now != ''){
                    result.push(parseInt(now));
                }
                now = '';
                result.push(s[i]);
            }
        }
        if(now != ''){
            result.push(parseInt(now));
        }
        console.log(result);
        for(let i = 0; i < result.length; i++){
            console.log(vals)
            if(result[i] in vals){
                result[i] = vals[result[i]];
            }
        }
        ans = calculate_sub(result);
        console.log(ans);
        return new ConverterResult(ans, message);
    }
}