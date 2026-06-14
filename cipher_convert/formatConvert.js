/*  文字列連結  {A1}{A2}
    0埋め       {A1:02}{A1:a5}
    部分文字列  {A1[2]}
    部分文字列  {A1[2:4]}
 */

function subConvertFormat(s, variable){
    //console.log("subConvertFormat", s, variable)
    let result = "";
    let symbolIdx = [undefined, undefined, undefined];
    for(let i = 0; i < s.length; i++){
        if(s[i] == '['){
            if(symbolIdx[0] == undefined) symbolIdx[0] = i;
            else return new ConverterResult(getErrorStr(`{${s}}`), `"${s}"の入力形式が誤っています`);
        }else if(s[i] == ':'){
            if(symbolIdx[1] == undefined) symbolIdx[1] = i;
            else return new ConverterResult(getErrorStr(`{${s}}`), `"${s}"の入力形式が誤っています`);
        }else if(s[i] == ']'){
            if(symbolIdx[i] == undefined) symbolIdx[2] = i;
            else return new ConverterResult(getErrorStr(`{${s}}`), `"${s}"の入力形式が誤っています`);
        }
    }
    if(symbolIdx[0] == undefined && symbolIdx[1] == undefined && symbolIdx[2] == undefined){//A1
        return new ConverterResult(variable[s], "");
    }else if(symbolIdx[0] == undefined && symbolIdx[1] != undefined && symbolIdx[2] == undefined){//A1:02
        if(s[s.length - 1] == 'n'){
            let cnt = s.substring(symbolIdx[1] + 2, s.length - 1);
            let str = variable[s.substring(0, symbolIdx[1])];
            for(let j = str.length; j < Math.ceil(str.length / cnt) * cnt; j++){
                result += s[symbolIdx[1] + 1];
            }
            result += str;
        }else{
            let cnt = s.substring(symbolIdx[1] + 2, s.length);
            let str = variable[s.substring(0, symbolIdx[1])];
            for(let j = str.length; j < cnt; j++){
                result += s[symbolIdx[1] + 1];
            }
            result += str;
        }
        return new ConverterResult(result);//format未対応
    }else if(symbolIdx[0] != undefined && symbolIdx[1] == undefined && symbolIdx[2] != undefined){//A1[2]
        let idx = parseInt(s.substring(symbolIdx[0] + 1, symbolIdx[2]));
        if(idx < 0) idx = variable[s.substring(0, symbolIdx[0])].length + idx;
        return new ConverterResult(variable[s.substring(0, symbolIdx[0])][idx]);
    }else if(symbolIdx[0] != undefined && symbolIdx[1] != undefined && symbolIdx[2] != undefined){//A1[2:4]
        let idxL = parseInt(s.substring(symbolIdx[0] + 1, symbolIdx[1]));
        let idxR = parseInt(s.substring(symbolIdx[1] + 1, symbolIdx[2]));
        if(isNaN(idxL)) idxL = 0;
        if(isNaN(idxR)) idxR = variable[s.substring(0, symbolIdx[0])].length;
        if(idxL < 0) idxL = variable[s.substring(0, symbolIdx[0])].length + idxL;
        if(idxR < 0) idxR = variable[s.substring(0, symbolIdx[0])].length + idxR;
        return new ConverterResult(variable[s.substring(0, symbolIdx[0])].substring(idxL, idxR));
    }else{
        return new ConverterResult(getErrorStr(`{${s}}`), `"${s}"の入力形式が誤っています`);
    }
}

function convertFormat(s, variable, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
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
                    let tmp = convertFormat(s, vec[i][j][k]);
                    vec[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(vec, message);
    }else{
        //1変数ごとに分割する
        let startIdx = -1
        for(let i = 0; i < s.length; i++){
            if(s[i] == '{'){
                if(startIdx == -1){
                    startIdx = i;
                }else{
                    return new ConverterResult(result, '入力に誤りがあります');
                }
            }else if(s[i] == '}'){
                if(startIdx != -1){
                    let tmp = subConvertFormat(s.substring(startIdx + 1, i), variable);
                    result += tmp.result;
                    if(message != "") message = tmp.message;
                    startIdx = -1;
                }else{
                    return new ConverterResult(result, '入力に誤りがあります');
                }
            }else if(startIdx == -1){
                result += s[i];
            }
        }
        if(startIdx != -1) return new ConverterResult(result, '入力に誤りがあります');
        return new ConverterResult(result, message);
    }
}
