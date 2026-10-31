letters = "0123456789abcdefghijklmnopqrstuvwxyz";
rletters = new Map();
for(let i = 0; i < 36; i++){
    rletters.set(letters[i], i);
}

function convertBaseVec(vec, fromBase, toBase){
    console.log(vec, fromBase, toBase)
    if(fromBase < 2){
        return new ConverterResult("", `進数は2以上にしてください`);
    }
    if(toBase < 2){
        return new ConverterResult("", `進数は2以上にしてください`);
    }
    let n = 0n;
    let bfbase = BigInt(fromBase);
    for(let i = 0; i < vec.length; i++){
        if(vec[i] >= fromBase){
            return new ConverterResult("", `各桁は${fromBase - 1}以下にしてください`);
        }
        n *= BigInt(bfbase);
        n += BigInt(vec[i]);
    }

    let result = [];
    let btbase = BigInt(toBase);
    while(n > 0n){
        result.push(parseInt(n % btbase));
        n /= btbase;
    }
    result.reverse();
    return new ConverterResult(result, "");
}

function baseN2Vec(s){
    let result = [];
    for(let i = 0; i < s.length; i++){
        let tmp = rletters.get(s[i]);
        if(tmp != undefined){
            result.push(rletters.get(s[i]));
        }else{
            return new ConverterResult("", `${s[i]}を変換できません`);
        }
    }
    return new ConverterResult(result, "");
}

function vec2BaseN(vec){
    let result = "";
    for(let i = 0; i < vec.length; i++){
        let tmp = letters[vec[i]];
        if(tmp != undefined){
            result += letters[vec[i]];
        }else{
            return new ConverterResult("", `${vec[i]}を変換できません`);
        }
    }
    return new ConverterResult(result, "");
}

function convertBase(s, fromBase, toBase, isVecFrom=false, isVecTo=false){
    let result = [];
    let message = '';
    if(isVecFrom && isVecTo){
        for(let i = 0; i < s.length; i++){
            result[i] = [];
            for(let j = 0; j  < s[i].length; j++){
                result[i][j] = [];
                let tmp = convertBaseVec(s[i][j], fromBase, toBase);
                if(tmp.message == ""){
                    for(let k = 0; k < tmp.result.length; k++){
                        result[i][j][k] = tmp.result[k];
                    }
                }else{
                    result[0][i][j] = getErrorStr(s[i][j]);
                    if(message == "") message = tmp.message;
                }
            }
        }
    }else if(isVecFrom && !isVecTo){
        result[0] = [];
        for(let i = 0; i < s.length; i++){
            result[0][i] = [];
            for(let j = 0; j  < s[i].length; j++){
                let tmp = convertBaseVec(s[i][j], fromBase, toBase);
                if(tmp.message == ""){
                    let tmp2 = vec2BaseN(tmp.result);
                    if(tmp2.message == ""){
                        result[0][i][j] = tmp2.result;
                    }else{
                        result[0][i][j] = getErrorStr(s[i][j]);
                        if(message == "") message = tmp.message;
                    }
                }else{
                    result[0][i][j] = getErrorStr(s[i][j]);
                    if(message == "") message = tmp.message;
                }
            }
        }
    }else if(!isVecFrom && isVecTo){
        for(let i = 0; i  < s[0].length; i++){
            result[i] = [];
            for(let j = 0; j < s[0][i].length; j++){
                result[i][j] = [];
                let tmp2 = baseN2Vec(s[0][i][j]);
                if(tmp2.message == ""){
                    let tmp = convertBaseVec(tmp2.result, fromBase, toBase);
                    if(tmp.message == ""){
                        for(let k = 0; k < tmp.result.length; k++){
                            result[i][j][k] = tmp.result[k];
                        }
                    }else{
                        result[i][j] = getErrorStr(s[0][i][j]);
                        if(message == "") message = tmp.message;
                    }
                }else{
                    result[i][j] = getErrorStr(s[0][i][j]);
                    if(message = "") message = tmp2.message;
                }
            }
        }
    }else if(!isVecFrom && !isVecTo){
        for(let i = 0; i < s.length; i++){
            result[i] = [];
            for(let j = 0; j  < s[i].length; j++){
                result[i][j] = [];
                for(let k = 0; k < s[i][j].length; k++){
                    let tmp2 = baseN2Vec(s[i][j][k]);
                    if(tmp2.message == ""){
                        let tmp = convertBaseVec(tmp2.result, fromBase, toBase);
                        if(tmp.message == ""){
                            let tmp3 = vec2BaseN(tmp.result);
                            if(tmp3.message == ""){
                                result[i][j][k] = tmp3.result;
                            }else{
                                result[i][j][k] = getErrorStr(s[i][j][k]);
                                if(message = "") message = tmp3.message;
                            }
                        }else{
                            result[i][j][k] = getErrorStr(s[i][j][k]);
                            if(message == "") message = tmp.message;
                        }
                    }else{
                        result[i][j][k] = getErrorStr(s[i][j][k]);
                        if(message == "") message = tmp.message;
                    }
                }
            }
        }
    }
    return new ConverterResult(result, message);
}
