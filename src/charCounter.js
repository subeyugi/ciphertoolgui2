function getStrLength(s){
    let maxLength = 20;
    let vec = splitText(s);
    let result = "";
    for(let i = 0; i < vec.length; i++){
        for(let j = 0; j < vec[i].length; j++){
            for(let k = 0; k < vec[i][j].length; k++){
                if(result != '') result += ',';
                result += vec[i][j][k].length.toString();
                if(maxLength <= result.length){
                    result += "...";
                    break;
                }
            }
        }
    }
    if(vec[0][0].length.toString() >= 5){
        result = vec[0][0].length.toString() + "[" + result + "]";
    }
    return result;
}