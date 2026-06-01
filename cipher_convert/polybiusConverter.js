let polyBiusTable = `a b c d e
f g h ij k
l m n o p
q r s t u
v w x y z
`.split("\n")

let polybiusNum2AlphaMp = new Map();
let polybiusAlpha2NumMp = new Map();


for(let i = 0; i < 5; i++){
    let tmp = polyBiusTable[i].split(" ");
    console.log(tmp)
    for(let j = 0; j < 5; j++){
        polybiusNum2AlphaMp.set(`${i + 1}${j + 1}`, tmp[j][0]);
        polybiusAlpha2NumMp.set(tmp[j][0], `${i + 1}${j + 1}`);
    }
}
polybiusAlpha2NumMp.set("j", "24");

function encodePolybius(s, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodePolybius(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        for(let i = 0; i < s.length; i++){
            let tmp = polybiusNum2AlphaMp.get(s[i]);
            if(tmp != undefined){
                result += tmp;
            }else{
                getErrorStr(s[i]);
            }
        }
        return new ConverterResult(result, message);
    }
}

function decodePolybius(s, isVec = false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodePolybius(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        for(let i = 0; i < s.length; i += 2){
            let tmp = polybiusNum2AlphaMp.get(s[i] + s[i + 1]);
            if(tmp != undefined){
                result += tmp;
            }else{
                getErrorStr(s[i]);
            }
        }
        return new ConverterResult(result, message);
    }
}

console.log(encodePolybius("line"));