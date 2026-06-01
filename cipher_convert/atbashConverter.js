function convertAtbash(s, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = convertAtbash(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        for(let i = 0; i < s.length; i++){
            result += String.fromCharCode((25 - (s.charCodeAt(i) - 'a'.charCodeAt(0))) + 'a'.charCodeAt(0));
        }
        return new ConverterResult(result, message);
    }
}