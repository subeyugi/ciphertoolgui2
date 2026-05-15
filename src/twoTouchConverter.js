let twoTouch2hiragana = [['０','わ','を','ん','゛','゜','６','７','８','９'],['Ｅ','あ','い','う','え','お','Ａ','Ｂ','Ｃ','Ｄ'],['Ｊ','か','き','く','け','こ','Ｆ','Ｇ','Ｈ','Ｉ'],['Ｏ','さ','し','す','せ','そ','Ｋ','Ｌ','Ｍ','Ｎ'],['Ｔ','た','ち','つ','て','と','Ｐ','Ｑ','Ｒ','Ｓ'],['Ｙ','な','に','ぬ','ね','の','Ｕ','Ｖ','Ｗ','Ｘ'],['／','は','ひ','ふ','へ','ほ','Ｚ','？','！','－'],['機','ま','み','む','め','も','￥','＆','機','機'],['機','や','（','ゆ','）','よ','＊','＃','　','機'],['５','ら','り','る','れ','ろ','１','２','３','４']];
let hiragana2twoTouch = new Map();

for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
        hiragana2twoTouch.set(twoTouch2hiragana[i][j], i.toString() + j.toString());
    }
}

function encodeTwoTouch(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodeTwoTouch(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        s = splitDakuten(s);
        for(let i = 0; i < s.length; i++){
            let tmp  = hiragana2twoTouch.get(s[i]);
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

function decodeTwoTouch(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodeTwoTouch(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s.length % 2 != 0){
            if(message == '') message = `入力桁数は2の倍数の必要があります`;
        }
        for(let i = 0; i < s.length-1; i += 2){
            let x = parseInt(s[i]);
            let y = parseInt(s[i + 1]);
            if(0 <= x && x < 10 && 0 <= y && y < 10){
                result += twoTouch2hiragana[x][y];
            }else{
                result += getErrorStr(s[i] + s[i + 1]);
                if(message == '') message = `"${s[i]}"を変換できません`;
            }
        }
        if(s.length % 2 == 1){
            result += getErrorStr(s[s.length - 1]);
        }
        result = joinDakuten(result);
        return new ConverterResult(result, message);
    }
}