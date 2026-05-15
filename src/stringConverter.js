function convertString(s, from, to, isVec = false){
    console.log(s, from, to, isVec);

    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = convertString(s[i][j][k], from, to);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(from.length == 0){
            new ConverterResult(s, message);
        }
        if(from.length != to.length){
            return new ConverterResult(getErrorStr(s), `変換前と変換後の数を同じにしてください`);
        }
        for(let i = 0; i < from.length; i++){
            if(from[i] == ''){
                return new ConverterResult(getErrorStr(s), `変換前は空文字列にはできません`);
            }
        }

        let result = '';
        for(let i = 0; i < s.length; i++){
            let nonConv = true;
            for(let j = 0; j < from.length; j++){
                if(i + from[j].length - 1 < s.length && s.substring(i, i + from[j].length) == from[j]){
                    nonConv = false;
                    result += to[j];
                    i += from[j].length - 1;
                    break;
                }
            }
            if(nonConv){
                result += s[i];
            }
        }
        return new ConverterResult(result, message);
    }
}