aiu = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
iroha = 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす';

aiu2numMp = new Map();
iroha2numMp = new Map();

for(let i = 0; i < aiu.length; i++){
    aiu2numMp.set(aiu[i], i);
}
for(let i = 0; i < iroha.length; i++){
    iroha2numMp.set(iroha[i], i);
}

function num2alpha(vec, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        let result = [[]];
        for(let i = 0; i < vec.length; i++){
            result[0].push([]);
            for(let j = 0; j < vec[i].length; j++){
                result[0][i].push([]);
                let tmp = num2alpha(vec[i][j]);
                result[0][i][j] = tmp.result;
                if(message == '') message = tmp.message;
            }
        }
        return new ConverterResult(result, message);
    }else{
        if(vec == '') return '';
        for(let i = 0; i < vec.length; i++){
            if(0 <= vec[i] && vec[i] < 26){
                result += String.fromCharCode('a'.charCodeAt(0) + parseInt(vec[i]));
            }else{
                result += getErrorStr(vec[i].toString());
                if(message == '') message = `"${vec[i]}"は変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}

function num2aiu(vec, isVec=false){
    if(vec == '') return '';
    let result = '';
    let message = '';
    if(isVec){
        let result = [[]];
        for(let i = 0; i < vec.length; i++){
            result[0].push([]);
            for(let j = 0; j < vec[i].length; j++){
                result[0][i].push([]);
                let tmp = num2aiu(vec[i][j]);
                result[0][i][j] = tmp.result;
                if(message == '') message = tmp.message;
            }
        }
        return new ConverterResult(result, message);
    }else{
        for(let i = 0; i < vec.length; i++){
            if(0 <= vec[i] && vec[i] < aiu.length){
                result += aiu[parseInt(vec[i])];
            }else{
                result += getErrorStr(vec[i].toString());
                if(message == '') message = `"${vec[i]}"は変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}

function num2iroha(vec, isVec=false){
    if(vec == '') return '';
    let result = '';
    let message = '';
    if(isVec){
        let result = [[]];
        for(let i = 0; i < vec.length; i++){
            result[0].push([]);
            for(let j = 0; j < vec[i].length; j++){
                result[0][i].push([]);
                let tmp = num2iroha(vec[i][j]);
                result[0][i][j] = tmp.result;
                if(message == '') message = tmp.message;
            }
        }
        return new ConverterResult(result, message);
    }else{
        for(let i = 0; i < vec.length; i++){
            if(0 <= vec[i] && vec[i] < iroha.length){
                result += iroha[parseInt(vec[i])];
            }else{
                result += getErrorStr(vec[i].toString());
                if(message == '') message = `"${vec[i]}"は変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}

function alpha2num(vec, isVec = false){
    let message = '';
    if(isVec){
        let result = [];
        for(let i = 0; i < vec[0].length; i++){
            result.push([]);
            for(let j = 0; j < vec[0][i].length; j++){
                result[i].push([]);
                let tmp = alpha2num(vec[0][i][j]);
                result[i][j] = tmp.result;
                if(message == '') message = tmp.result;
            }
        }
        return new ConverterResult(result, message);
    }else{
        let result = [];
        for(let i = 0; i < vec.length; i++){
            if('a'.charCodeAt(0) <= vec.charCodeAt(i) && vec.charCodeAt(i) <= 'z'.charCodeAt(0)){
                result.push((vec.charCodeAt(i) - 'a'.charCodeAt(0)).toString());
            }else{
                result.push(getErrorStr(vec[i]));
                if(message == '') message = `"${vec[i]}"は変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}

function aiu2num(vec, isVec){
    let message = '';
    if(isVec){
        let result = [];
        for(let i = 0; i < vec[0].length; i++){
            result.push([]);
            for(let j = 0; j < vec[0][i].length; j++){
                result[i].push([]);
                let tmp = aiu2num(vec[0][i][j]);
                result[i][j] = tmp.result;
                if(message == '') message = tmp.result;
            }
        }
        return new ConverterResult(result, message);
    }else{
        let result = [];
        for(let i = 0; i < vec.length; i++){
            let tmp = aiu2numMp.get(vec[i]);
            if(tmp != undefined){
                result.push(tmp.toString());
            }else{
                result.push(getErrorStr(vec[i]));
                if(message == '') message = `"${vec[i]}"は変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}

function iroha2num(vec, isVec){
    let message = '';
    if(isVec){
        let result = [];
        for(let i = 0; i < vec[0].length; i++){
            result.push([]);
            for(let j = 0; j < vec[0][i].length; j++){
                result[i].push([]);
                let tmp = iroha2num(vec[0][i][j]);
                result[i][j] = tmp.result;
                if(message == '') message = tmp.result;
            }
        }
        return new ConverterResult(result, message);
    }else{
        let result = [];
        for(let i = 0; i < vec.length; i++){
            let tmp = iroha2numMp.get(vec[i]);
            if(tmp != undefined){
                result.push(tmp.toString());
            }else{
                result.push(getErrorStr(vec[i]));
                if(message == '') message = `"${vec[i]}"は変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}