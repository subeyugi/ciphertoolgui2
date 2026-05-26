dakutenData = [
    ["が", "か゛"], ["ぎ", "き゛"], ["ぐ", "く゛"], ["げ", "け゛"], ["ご", "こ゛"], 
    ["ざ", "さ゛"], ["じ", "し゛"], ["ず", "す゛"], ["ぜ", "せ゛"], ["ぞ", "そ゛"], 
    ["だ", "た゛"], ["ぢ", "ち゛"], ["づ", "つ゛"], ["で", "て゛"], ["ど", "と゛"], 
    ["ば", "は゛"], ["び", "ひ゛"], ["ぶ", "ふ゛"], ["べ", "へ゛"], ["ぼ", "ほ゛"],
    ["ぱ", "は゜"], ["ぴ", "ひ゜"], ["ぷ", "ふ゜"], ["ぺ", "へ゜"], ["ぽ", "ほ゜"],
    ["ゃ", "や"],   ["ゅ", "ゆ"],   ["ょ", "よ"],  ["っ", "つ"]];
splitted2joined = new Map();
joined2splitted = new Map();

for(let i = 0; i < dakutenData.length; i++){
    splitted2joined.set(dakutenData[i][0], dakutenData[i][1]);
}
for(let i = 0; i < 25; i++){
    joined2splitted.set(dakutenData[i][1], dakutenData[i][0]);
}

function splitDakuten(s, isList){
    let result = "";
    for(let i = 0; i < s.length; i++){
        let tmp = splitted2joined.get(s[i]);
        if(tmp != undefined){
            result += tmp;
        }else{
            result += s[i];
        }
    }
    return result;
}

function joinDakuten(s, isList){
    let result = "";
    for(let i = 0; i < s.length; i++){
        let tmp = joined2splitted.get(s[i] + s[i + 1]);
        if(tmp != undefined){
            result += tmp;
            i++;
        }else{
            result += s[i];
        }
    }
    return result;
}