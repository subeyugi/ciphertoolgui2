dakutenDataRear = [
["が", "か゛"], ["ぎ", "き゛"], ["ぐ", "く゛"], ["げ", "け゛"], ["ご", "こ゛"], 
["ざ", "さ゛"], ["じ", "し゛"], ["ず", "す゛"], ["ぜ", "せ゛"], ["ぞ", "そ゛"], 
["だ", "た゛"], ["ぢ", "ち゛"], ["づ", "つ゛"], ["で", "て゛"], ["ど", "と゛"], 
["ば", "は゛"], ["び", "ひ゛"], ["ぶ", "ふ゛"], ["べ", "へ゛"], ["ぼ", "ほ゛"],
["ぱ", "は゜"], ["ぴ", "ひ゜"], ["ぷ", "ふ゜"], ["ぺ", "へ゜"], ["ぽ", "ほ゜"]];

dakutenDataFront = [
["が", "゛か"], ["ぎ", "゛き"], ["ぐ", "゛く"], ["げ", "゛け"], ["ご", "゛こ"], 
["ざ", "゛さ"], ["じ", "゛し"], ["ず", "゛す"], ["ぜ", "゛せ"], ["ぞ", "゛そ"], 
["だ", "゛た"], ["ぢ", "゛ち"], ["づ", "゛つ"], ["で", "゛て"], ["ど", "゛と"], 
["ば", "゛は"], ["び", "゛ひ"], ["ぶ", "゛ふ"], ["べ", "゛へ"], ["ぼ", "゛ほ"],
["ぱ", "゜は"], ["ぴ", "゜ひ"], ["ぷ", "゜ふ"], ["ぺ", "゜へ"], ["ぽ", "゜ほ"]];

smallLetter = [
["ゃ", "や"],   ["ゅ", "ゆ"],   ["ょ", "よ"],  ["っ", "つ"]];

splitted2joinedRear = new Map();
joined2splittedRear = new Map();
splitted2joinedFront = new Map();
joined2splittedFront = new Map();
small2largeHiragana = new Map();

for(let i = 0; i < dakutenDataRear.length; i++){
    splitted2joinedRear.set(dakutenDataRear[i][0], dakutenDataRear[i][1]);
    splitted2joinedFront.set(dakutenDataFront[i][0], dakutenDataFront[i][1]);
    joined2splittedRear.set(dakutenDataRear[i][1], dakutenDataRear[i][0]);
    joined2splittedFront.set(dakutenDataFront[i][1], dakutenDataFront[i][0]);
}
for(let i = 0; i < smallLetter.length; i++){
    small2largeHiragana.set(smallLetter[i][0], smallLetter[i][1]);
}

function splitDakuten(s, addFront=false){
    let result = "";
    for(let i = 0; i < s.length; i++){
        let tmp;
        if(addFront){
            tmp = splitted2joinedFront.get(s[i]);
        }else{
            tmp = splitted2joinedRear.get(s[i]);
        }
        if(tmp != undefined){
            result += tmp;
        }else{
            result += s[i];
        }
    }
    return result;
}

function joinDakuten(s, addFront=false){
    let result = "";
    for(let i = 0; i < s.length; i++){
        let tmp;
        if(addFront){
            tmp = joined2splittedFront.get(s[i] + s[i + 1]);
        }else{
            tmp = joined2splittedRear.get(s[i] + s[i + 1]);
        }
        if(tmp != undefined){
            result += tmp;
            i++;
        }else{
            result += s[i];
        }
    }
    return result;
}

function enlargeLetter(s){
    let result = "";
    for(let i = 0; i < s.length; i++){
        let tmp = small2largeHiragana.get(s[i]);
        if(tmp != undefined){
            result += tmp;
        }else{
            result += s[i];
        }
    }
    return result;
}