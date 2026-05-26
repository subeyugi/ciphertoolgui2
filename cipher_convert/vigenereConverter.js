function encodeVigenere(s, key, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodeVigenere(s[i][j][k], key);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s == '') return new ConverterResult('', '');
        let listS = alpha2num(s).result;
        let listK = alpha2num(key).result;
        let vec = [];
        for(let i = 0; i < s.length; i++){
            vec.push((parseInt(listS[i]) + parseInt(listK[i % key.length])) % 26);
        }
        result = num2alpha(vec).result;
        return new ConverterResult(result, message);
    }
}

function decodeVigenere(s, key, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodeVigenere(s[i][j][k], key);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s == '') return new ConverterResult('', '');
        let listS = alpha2num(s).result;
        let listK = alpha2num(key).result;
        let vec = [];
        for(let i = 0; i < s.length; i++){
            vec.push((parseInt(listS[i]) - parseInt(listK[i % key.length]) + 26) % 26);
        }
        result = num2alpha(vec).result;
        return new ConverterResult(result, message);
    }
}
