letters = "0123456789abcdefghijklmnopqrstuvwxyz";
rletters = new Map();
for(let i = 0; i < 36; i++){
    rletters.set(letters[i], i);
}

function fromBase10(s, base){
    let message = '';
    let n = BigInt(s);
    let bbase = BigInt(base);
    let vec = []
    while(n > 0){
        vec.push(letters[n % bbase]);
        n /= bbase;
    }
    vec.reverse();
    return new ConverterResult(vec.join(''), message);
}

function toBase10(s, base){
    let message = '';
    let n = 0n;
    let bbase = BigInt(base);
    for(let i = 0; i < s.length; i++){
        n *= BigInt(bbase);
        let tmp = rletters.get(s[i]);
        if(tmp == undefined) return new ConverterResult(getErrorStr(s), `"${s[i]}"は使用できません`);
        n += BigInt(rletters.get(s[i]));
        if(rletters.get(s[i]) >= base){
            return new ConverterResult(getErrorStr(s), `${base}進数では"${s[i]}"は使用できません`);
        }
    }
    return new ConverterResult(n.toString(), message);
}

function convertBase(s, fromBase, toBase, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = convertBase(s[i][j][k], fromBase, toBase);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        let base10 = toBase10(s, fromBase);
        if(base10.message != ''){
            return convertBase(getErrorStr(s), base10.message);
        }
        result = fromBase10(base10.result, toBase).result;
        return new ConverterResult(result, message);
    }
}
