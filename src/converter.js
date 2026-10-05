function updateAllText(){
    //あらかじめトポロジカルソートしておく
    let seen = new Set([]);
    let remFromId = new Map();
    let que = [];
    let queIdx = 0;
    let sortedIds = [];
    cipherObjects.forEach((val, id) => {
        remFromId.set(id, new Set([]));
    });
    cipherObjects.forEach((val, id) => {
        val.fromIds.forEach(e => {
            remFromId.get(id).add(e);
        })
    });
    //console.log(remFromId)

    remFromId.forEach((val, id)=>{
        if(val.size == 0){
            que.push(id);
            seen.add(id);
        }
    });

    while(que.length - queIdx > 0){
        let now = que[queIdx++];
        sortedIds.push(now);
        cipherObjects.get(now).toIds.forEach(id => {
            if(!seen.has(id)){
                remFromId.get(id).delete(now);
                if(remFromId.get(id).size == 0){
                    que.push(id);
                    seen.add(id);
                }
            }
        });
    }
    console.log("sortedIds", sortedIds);
    sortedIds.forEach(function(id){
        updateText(id);
    });

    if(outputId){
        document.getElementById('output_text').value = cipherObjects.get(outputId).text;
        document.getElementById('top_output_message').value = cipherObjects.get(outputId).message;
    }
}

function splitText(s){
    let result;
    result = s.split(sep3);
    for(let i = 0; i < result.length; i++){
        result[i] = result[i].split(sep2);
    }

    for(let i = 0; i < result.length; i++){
        for(let j = 0; j < result[i].length; j++){
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
    for(let i = 0; i < vec.length; i++){
        if(i > 0) result += sep3;
        for(let j = 0; j < vec[i].length; j++){
            if(j > 0) result += sep2;
            for(let k = 0; k < vec[i][j].length; k++){
                if(k > 0) result += sep1;
                result += vec[i][j][k];
            }
        }
    }
    return result;
}

function updateText(to_id){
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
        case CipherType.none:
            toObj.text = fromText;
            break;
        case CipherType.input:
            break;
        case CipherType.midi:
            break;
        case CipherType.charcode:
            switch(options.mode){
                case 'decodeHex':
                    tmp = decodeStrHex(fromTextSplit, options.code, options.add, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encodeHex':
                    tmp = encodeStrHex(fromTextSplit, options.code, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'decodeBin':
                    tmp = decodeStrBin(fromTextSplit, options.code, options.add, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encodeBin':
                    tmp = encodeStrBin(fromTextSplit, options.code, true);
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
        case CipherType.tenji:
            switch(options.mode){
                case 'tenji2jp':
                    tmp = decodeTenjiJP(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'jp2tenji':
                    tmp = encodeTenjiJP(fromTextSplit, true);
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
                    //console.log("alpha2num", fromTextSplit);
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
            tmp = convertString(fromTextSplit, options.from.split(","), options.to.split(","), true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.atbash:
            tmp = convertAtbash(fromTextSplit, true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.vigenere:
            switch(options.mode){
                case 'decode':
                    tmp = decodeVigenere(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encode':
                    tmp = encodeVigenere(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.polybius:
            switch(options.mode){
                case 'decode':
                    tmp = decodePolybius(fromTextSplit, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encode':
                    tmp = encodePolybius(fromTextSplit, true);
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
        case CipherType.split:
            switch(options.mode){
                case 'splitInterval':
                    tmp = splitByInterval(fromTextSplit, parseInt(options.val));
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'splitChar':
                    tmp = splitByInterval(fromTextSplit, parseInt(options.val));
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'join':
                    tmp = joinVec(fromTextSplit);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.format:
            //optionの方が分割ありになる
            tmp = convertFormat(document.getElementById(`format_${to_id}`).value, getResults(toObj.fromIds), true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        case CipherType.scytale:
            switch(options.mode){
                case 'decode':
                    tmp = decodeScytale(fromTextSplit, options.interval, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encode':
                    tmp = encodeScytale(fromTextSplit, options.interval, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.railfence:
            switch(options.mode){
                case 'decode':
                    tmp = decodeRailfence(fromTextSplit, options.rail, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
                case 'encode':
                    tmp = encodeRailFence(fromTextSplit, options.rail, true);
                    toObj.text = joinText(tmp.result);
                    toObj.message = tmp.message;
                    break;
            }
            break;
        case CipherType.calc:
            tmp = calculate(document.getElementById(`exp_${to_id}`).value, getResults(toObj.fromIds), true);
            toObj.text = joinText(tmp.result);
            toObj.message = tmp.message;
            break;
        default:
            toObj.text = fromText;
            break;
    }

    //console.log("outputtext: ", outputId, toObj.text);
    document.getElementById('txt_' + to_id).innerText = toObj.text;
    document.getElementById('output_text').innerText = toObj.text;
    document.getElementById("top_output_length").innerText = getStrLength(toObj.text);
    if(toObj.message == ''){
        document.getElementById('alr_' + to_id).style.display = 'none';
        document.getElementById('top_output_message').textContent = '';
    }else{
        document.getElementById('alr_' + to_id).style.display = 'block';
        document.getElementById('top_output_message').textContent = toObj.message;
    }
}

function getResults(fromIds){
    let result = {};
    cipherObjects.forEach((val, id) => {
        if(fromIds.has(id)){
            let tmp = splitText(cipherObjects.get(id).text);
            result[id] = tmp;
        }
    });
    return result;
}