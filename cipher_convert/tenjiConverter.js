let tenji = [
['あ','⠁','100000'],
['い','⠃','110000'],
['う','⠉','100100'],
['え','⠋','110100'],
['お','⠊','010100'],
['か','⠡','100001'],
['き','⠣','110001'],
['く','⠩','100101'],
['け','⠫','110101'],
['こ','⠪','010101'],
['さ','⠱','100011'],
['し','⠳','110011'],
['す','⠹','100111'],
['せ','⠻','110111'],
['そ','⠺','010111'],
['た','⠕','101010'],
['ち','⠗','111010'],
['つ','⠝','101110'],
['て','⠟','111110'],
['と','⠞','011110'],
['な','⠅','101000'],
['に','⠇','111000'],
['ぬ','⠍','101100'],
['ね','⠏','111100'],
['の','⠎','011100'],
['は','⠥','101001'],
['ひ','⠧','111001'],
['ふ','⠭','101101'],
['へ','⠯','111101'],
['ほ','⠮','011101'],
['ま','⠵','101011'],
['み','⠷','111011'],
['む','⠽','101111'],
['め','⠿','111111'],
['も','⠾','011111'],
['や','⠌','001100'],
['ゆ','⠬','001101'],
['よ','⠜','001110'],
['ら','⠑','100010'],
['り','⠓','110010'],
['る','⠙','100110'],
['れ','⠛','110110'],
['ろ','⠚','010110'],
['わ','⠄','001000'],
['を','⠔','001010'],
['ん','⠴','001011'],
['゛','⠐','000010'],
['゜','⠠','000001']];

let aiu2tenjiMp = new Map();
let tenji2aiuMp = new Map();
let from_bin123456Mp = new Map();
let to_bin123456Mp = new Map();
for(let i = 0; i < (tenji).length; i++){
    aiu2tenjiMp.set(tenji[i][0], tenji[i][1]);
    tenji2aiuMp.set(tenji[i][1], tenji[i][0]);
    from_bin123456Mp.set(tenji[i][2], tenji[i][0]);
    to_bin123456Mp.set(tenji[i][0], tenji[i][2]);
}

function decodeTenjiJP(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; i++){
            for(let j = 0; j < s[i].length; j++){
                for(let k = 0; k < s[i][j].length; k++){
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
        for(let i = 0; i < s.length; i++){
            for(let j = 0; j < s[i].length; j++){
                for(let k = 0; k < s[i][j].length; k++){
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


function decodeTenjiBinJP(vec, type="bin123456", isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        let result = [[]];
        for(let i = 0; i < vec.length; i++){
            result[0].push([]);
            for(let j = 0; j < vec[i].length; j++){
                result[0][i].push([]);
                let tmp = decodeTenjiBinJP(vec[i][j], type);
                result[0][i][j] = tmp.result;
                if(message == '') message = tmp.message;
            }
        }
        return new ConverterResult(result, message);
    }else{
        for(let i = 0; i < vec.length; i++){
            let tmp = "";
            s = vec[i];
            if(type == "bin321654"){
                s = s[2] + s[1] + s[0] + s[5] + s[4] + s[3];
            }else if(type == "bin142536"){
                s = s[0] + s[3] + s[1] + s[4] + s[2] + s[5];
            }
            tmp = from_bin123456Mp.get(s);
            console.log("tmp=", tmp);
            if(tmp != undefined){
                result += tmp;
            }else{
                result += getErrorStr(s);
                if(message == "") message = `${s}を変換できません`;
            }
        }
        return new ConverterResult(joinDakuten(result, true), message);
    }
}

function encodeTenjiBinJP(s, type="bin123456", isVec=false){
    if(isVec){
        let result = [];
        let message = "";
        for(let i = 0; i < s[0].length; i++){
            result.push([]);
            for(let j = 0; j < s[0][i].length; j++){
                result[i].push([]);
                let tmp = encodeTenjiBinJP(s[0][i][j], type);
                result[i][j] = tmp.result;
                if(message == '') message = tmp.message;
            }
        }
        return new ConverterResult(result, message);
    }else{
        let result = [];
        let message = "";
        s = splitDakuten(s, true);
        for(let i = 0; i < s.length; i++){
            let tmp = to_bin123456Mp.get(s[i]);
            if(tmp != undefined){
                if(type == "bin123456"){
                    result.push(tmp);
                }else if(type == "bin321654"){
                    result.push(tmp[2] + tmp[1] + tmp[0] + tmp[5] + tmp[4] + tmp[3]);
                }else if(type == "bin142536"){
                    result.push(tmp[0] + tmp[3] + tmp[1] + tmp[4] + tmp[2] + tmp[5]);
                }
            }else{
                result.push(getErrorStr(s[i]));
                if(message == "") message = `${s[i]}を変換できません`
            }
        }
        return new ConverterResult(result, message);
    }
}