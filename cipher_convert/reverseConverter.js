function reverseStr(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = reverseStr(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    message += tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        result = '';
        for(let i = s.length - 1; i >= 0; i--){
            result += s[i];
        }
        return new ConverterResult(result, message);
    }
}