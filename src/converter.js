let sep1 = ',', sep2 = ' ', sep3 = '\n';

function updateAllText(){
    //あらかじめトポロジカルソートしておく
    let seen = new Set([]);
    let cntFromIds = new Map();
    let que = [];
    let queIdx = 0;
    let sortedIds = [];
    idSet.forEach(function(id){
        cntFromIds.set(id, cipherObjects.get(id).fromIds.size);
    });

    idSet.forEach(function(id){
        if(cntFromIds.get(id) == 0){
            if(cipherObjects.get(id).type == CipherType.input){
                seen.add(id);
                que.push(id);
            }else{
                seen.add(id);
                cipherObjects.get(id).text = '';
            }
        }
    });

    //トポロジカルソート
    while(que.length - queIdx > 0){
        let nowId = que[queIdx++];
        if(cipherObjects.get(nowId).type != CipherType.input){
            sortedIds.push(nowId);
        }
        let nxts = cipherObjects.get(nowId).toIds;
        nxts.forEach(nxtId => {
            if(!seen.has(nxtId)){
                seen.add(nxtId);
                que.push(nxtId);
            }
        });
    }
    sortedIds.forEach(function(id){
        updateText(id);
    });

    if(outputId){
        //console.log("text = ", cipherObjects.get(outputId).text);
        document.getElementById('output_text').value = cipherObjects.get(outputId).text;
        document.getElementById('top_output_message').innerText = cipherObjects.get(outputId).message;
    }
}

function splitText(s){
    let result;
    result = s.split(sep3);
    for(let i = 0; i < result.length; ++i){
        result[i] = result[i].split(sep2);
    }

    for(let i = 0; i < result.length; ++i){
        for(let j = 0; j < result[i].length; ++j){
            let tmp = result[i][j].split(sep1);
            result[i][j] =[];
            for(let k = 0; k < tmp.length; k++){
                result[i][j].push(tmp[k]);
            }
        }
    }
    return result;
}

function joinText(vec){
    let result = '';
    for(let i = 0; i < vec.length; ++i){
        if(i > 0) result += sep3;
        for(let j = 0; j < vec[i].length; ++j){
            if(j > 0) result += sep2;
            for(let k = 0; k < vec[i][j].length; ++k){
                if(k > 0) result += sep1;
                result += vec[i][j][k];
            }
        }
    }
    return result;
}

function updateText(to_id){
    if(!idSet.has(to_id)) return;
    let toObj = cipherObjects.get(to_id);
    let options = toObj.options;
    let fromText = '';
    let tmp;
    sep1 = cipherObjects.get(to_id).separator1;
    sep2 = cipherObjects.get(to_id).separator2;
    sep3 = cipherObjects.get(to_id).separator3;
    if(toObj.fromIds.size == 1){
        fromText = cipherObjects.get(toObj.fromIds.values().next().value).text;
        fromTextSplit = splitText(fromText);
    }else if(toObj.fromIds.size >= 2){

    }

    switch(toObj.type){
        case CipherType.charcode:
            switch(options.mode){
                case 'decode':
                    tmp = decodeStr(fromTextSplit, options.code, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encode':
                    tmp = encodeStr(fromTextSplit, options.code, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.morse:
            switch(options.mode){
                case 'morse2jp':
                    tmp = decodeMorseJP(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'morse2en':
                    tmp = decodeMorseEN(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'jp2morse':
                    tmp = encodeMorseJP(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'en2morse':
                    tmp = encodeMorseEN(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.twotouch:
            switch(options.mode){
                case 'num2char':
                    tmp = decodeTwoTouch(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'char2num':
                    tmp = encodeTwoTouch(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.charIndex:
            switch(options.mode){
                case 'num2alpha':
                    tmp = num2alpha(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'num2aiu':
                    tmp = num2aiu(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'num2iroha':
                    tmp = num2iroha(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'alpha2num':
                    tmp = alpha2num(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'aiu2num':
                    tmp = aiu2num(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'iroha2num':
                    tmp = iroha2num(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.ceaser:
            tmp = decodeCaesar(fromTextSplit, parseInt(options.rot), true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.mikaka:
            switch(options.mode){
                case 'en2jp':
                    tmp = decodeMikaka(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'jp2en':
                    tmp = encodeMikaka(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.strconv:
            tmp = convertString(fromTextSplit, options.from.split(splitChars[0]), options.to.split(splitChars[0]), true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.atbash:
            tmp = convertAtbash(fromTextSplit, options.from, options.to, true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.vigenere:
            switch(options.mode){
                case 'decode':
                    tmp = decodeVigenere(fromTextSplit, options.key, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encode':
                    tmp = encodeVigenere(fromTextSplit, options.key, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.reverse:
            tmp = reverseStr(fromTextSplit, true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.baseconv:
            tmp = convertBase(fromTextSplit, parseInt(options.from), parseInt(options.to), true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.calc:
            let obj = [];
            splitText(fromText)
            for(let i = 0; i < fromText.split(splitChars[0]).length; i++){
                obj.push({a: fromText[i]});
            }
            tmp = calculate(options.exp, obj, true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        default:
            toObj.text = fromText;
            break;
    }

    //console.log("outputtext ", outputId);
    document.getElementById('txt_' + to_id).innerText = toObj.text;
    document.getElementById('output_text').innerText = toObj.text;
    if(toObj.message == ''){
        document.getElementById('alr_' + to_id).style.display = 'none';
        document.getElementById('top_output_message').textContent = '';
    }else{
        document.getElementById('alr_' + to_id).style.display = 'block';
        document.getElementById('top_output_message').textContent = toObj.message;
    }
}