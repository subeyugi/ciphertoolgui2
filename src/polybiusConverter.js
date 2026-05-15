function encodePolybius(s, table, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodePolybius(s[i][j][k], key);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        let rowList = [];//行
        let columnList = [];//列
        console.log(table);
        return new ConverterResult(result, message);
    }
}