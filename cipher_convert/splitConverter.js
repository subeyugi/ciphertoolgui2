function splitByInterval(s, interval){
    let result = [];
    for(let j = 0; j < s[0].length; j++){
        result[j] = [];
        for(let k = 0; k < s[0][j].length; k++){
            result[j][k] = [];
            for(let i = 0; i < s[0][j][k].length; i++){
                if(result[j][k][Math.floor(i / interval)] == undefined) result[j][k][Math.floor(i / interval)] = '';
                result[j][k][Math.floor(i / interval)] += s[0][j][k][i];
            }
        }   
    }
    return new ConverterResult(result);
}

function splitByChar(s, char){
    let result = [];
    for(let j = 0; j < s[0].length; j++){
        result[j] = [];
        for(let k = 0; k < s[0][j].length; k++){
            result[j][k] = [];
            for(let i = 0; i < s[0][j][k].length; i++){
                if(result[j][k][Math.floor(i / interval)] == undefined) result[j][k][Math.floor(i / interval)] = '';
                result[j][k][Math.floor(i / interval)] += s[0][j][k][i];
            }
        }   
    }
    return new ConverterResult(result);
}

function joinVec(vec){
    let result = [];
    result[0] = [];
    for(let i = 0; i < vec.length; i++){
        result[0][i] = [];
        for(let j = 0; j < vec[i].length; j++){
            result[0][i][j] = '';
            for(let k = 0; k < vec[i][j].length; k++){
                result[0][i][j] += vec[i][j][k];
            }
        }   
    }
    return new ConverterResult(result);
}