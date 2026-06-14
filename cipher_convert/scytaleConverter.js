function decodeScytale(s, interval, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; i++){
            for(let j = 0; j < s[i].length; j++){
                for(let k = 0; k < s[i][j].length; k++){
                    let tmp = decodeScytale(s[i][j][k], interval);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.interval;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s == '') return new ConverterResult('', '');
        let cnt = Math.ceil(s.length / interval) * interval;
        let width = cnt / interval;
        for(let i = s.length; i < cnt; i++){
            s += '_';
        }
        for(let j = 0; j < width; j++){
            for(let i = 0; i < interval; i++){
                result += s[i * width + j];
            }
        }
        return new ConverterResult(result, message);
    }
}

function encodeScytale(s, interval, isVec = false){
        if(s == '') return new ConverterResult('', '');
        let cnt = Math.ceil(s.length / interval) * interval;
        let width = cnt / interval;
        for(let i = s.length; i < cnt; i++){
            s += '_';
        }
    return decodeScytale(s, Math.ceil(s.length / interval));
}