function getStrLength(s){
    let vec = splitText(s);
    let result = "";
    for(let i = 0; i < vec.length; i++){
        for(let j = 0; j < vec[i].length; j++){
            for(let k = 0; k < vec[i][j].length; k++){
                if(result != '') result += ',';
                result += vec[i][j][k].length.toString();
                //console.log(vec[i][j][k].length)
            }
        }
    }
    return result;
}