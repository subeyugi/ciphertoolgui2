function encodeRailFence(s, rail, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; i++){
            for(let j = 0; j < s[i].length; j++){
                for(let k = 0; k < s[i][j].length; k++){
                    let tmp = encodeRailFence(s[i][j][k], rail);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s == '') return new ConverterResult('', '');
        let vec = [];
        for(let i = 0; i < rail; i++){
            vec[i] = [];
            for(let j = 0; j < s.length; j++){
                vec[i][j] = '';
            }
        }
        for(let i = 0; i < s.length; i++){
            let now = i % (2 * rail - 2);
            if(now >= rail - 1) now = (2 * rail - 2) - now;
            vec[now][i] = s[i];
        }
        for(let i = 0; i < rail; i++){
            for(let j = 0; j < s.length; j++){
                result += vec[i][j];
            }
        }
        return new ConverterResult(result, message);
    }
}

function decodeRailfence(s, rail, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; i++){
            for(let j = 0; j < s[i].length; j++){
                for(let k = 0; k < s[i][j].length; k++){
                    let tmp = decodeRailfence(s[i][j][k], rail);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s == '') return new ConverterResult('', '');
        let vec = [];
        for(let i = 0; i < rail; i++){
            vec[i] = [];
            for(let j = 0; j < s.length; j++){
                vec[i][j] = undefined;
            }
        }
        for(let i = 0; i < s.length; i++){
            let now = i % (2 * rail - 2);
            if(now >= rail - 1) now = (2 * rail - 2) - now;
            vec[now][i] = i;
        }
        let resultVec = [];
        for(let i = 0; i < s.length; i++){
            resultVec[i] = '';
        }
        let now = 0;
        for(let i = 0; i < rail; i++){
            for(let j = 0; j < s.length; j++){
                if(vec[i][j] != undefined){
                    resultVec[vec[i][j]] = s[now];
                    now++;
                }
            }
        }
        for(let i = 0; i < s.length; i++){
            result += resultVec[i];
        }
        return new ConverterResult(result, message);
    }
}