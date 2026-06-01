let tenji = "⠁⠃⠉⠋⠊⠡⠣⠩⠫⠪⠱⠳⠹⠻⠺⠕⠗⠝⠟⠞⠅⠇⠍⠏⠎⠥⠧⠭⠯⠮⠵⠷⠽⠿⠾⠌⠬⠜⠑⠓⠙⠛⠚⠄⠔⠴⠐⠠";
let aiu2tenjiMp = new Map();
let tenji2aiuMp = new Map();
for(let i = 0; i < (tenji).length; i++){
    aiu2tenjiMp.set((aiu + "゛゜")[i], tenji[i]);
    tenji2aiuMp.set(tenji[i], (aiu + "゛゜")[i]);
}

function decodeTenjiJP(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodeTenjiJP(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s == '') new ConverterResult('', message);
        for(let i = 0; i < s.length; i++){
            let tmp = tenji2aiuMp.get(s[i]);
            if(tmp != undefined){
                result += tmp;
            }else{
                result += getErrorStr(tmp);
                if(message == '') message = `"${s[i]}"を変換できません`;
            }
        }
        result = joinDakuten(result, true);
        return new ConverterResult(result, message);
    }
}

function encodeTenjiJP(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodeTenjiJP(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        if(s == '') new ConverterResult('', message);
        s = splitDakuten(s, true);
        for(let i = 0; i < s.length; i++){
            let tmp = aiu2tenjiMp.get(s[i]);
            if(tmp != undefined){
                result += tmp;
            }else{
                result += getErrorStr(tmp);
                if(message == '') message = `"${s[i]}"を変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}
