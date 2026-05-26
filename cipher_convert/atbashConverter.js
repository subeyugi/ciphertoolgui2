function convertAtbash(s, from, to, isVec = false){
    console.log(s, from, to, isVec);
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = convertAtbash(s[i][j][k], from, to);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(from.length != to.length){
            return new ConverterResult(getErrorStr(s), `変換前と変換後の文字数を同じにしてください`);
        }
        let mp = new Map();
        for(let i = 0; i < from.length; i++){
            mp.set(from[i], to[i]);
        }
        let result = '';
        for(let i = 0; i < s.length; i++){
            let tmp = mp.get(s[i]);
            if(tmp != undefined){
                result += tmp;
            }else{
                result += getErrorStr(s[i]);
                if(message == '') message = `"${s[i]}"を変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}