//encoding.js by polygonplanet
//https://github.com/polygonplanet/encoding.js
//charcode: SJIS, ASCII, EUCJP, UTF8, UTF16, UNICODE

//文字列を指定文字コードで16進数に変換する
//s: 文字列
//charcode: 文字コード。SJIS, ASCII, EUCJP, UTF8, UTF16, UNICODEのいずれか

function encodeStrHex(s, charcode, isVec=false){
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    s[i][j][k] = encodeStrHex(s[i][j][k], charcode).result;
                }   
            }
        }
        return new ConverterResult(s);
    }else{
        const unicodeArray = Encoding.stringToCode(s);//javascriptのデフォルト
        const sjisArray = Encoding.convert(unicodeArray, {
            to: charcode,
            from: 'UNICODE'
        });

        let result = "";
        for(let i = 0; i < sjisArray.length; i++){
            result += sjisArray[i].toString(16).padStart(2, '0');
        }
        return new ConverterResult(result);
    }
}

//16進数を指定文字コードで文字列に変換する
//s: 文字列
//charcode: 文字コード。SJIS, ASCII, EUCJP, UTF8, UTF16, UNICODEのいずれか
function decodeStrHex(s, charcode, isVec=false){
    if(isVec){
        message = '';
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodeStrHex(s[i][j][k], charcode);
                    s[i][j][k] = tmp.result;
                    if(message =='') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        console.log(rletters);
        for(let i = 0; i < s.length; ++i){
            let tmp = rletters.get(s[i]);
            console.log(s[i], tmp);
            if(tmp == undefined || (!(0 <= tmp && tmp < 16))){
                return new ConverterResult(getErrorStr(s), `0~9,a~fで構成される文字列を入力してください`);
            }
        }

        let message = '';
        let s_rem = '';
        if(charcode == 'ASCII'){
            if(s.length % 2 != 0){
                if(message == '') message = '入力桁数は2の倍数である必要があります';
                s_rem = s.substr(Math.floor(s.length / 2) * 2, s.length);
                s = s.substr(0, Math.floor(s.length / 2) * 2);
            }
        }else if(charcode == 'UTF8'){
            if(s.length % 6 != 0){
                if(message == '') message = '入力桁数は6の倍数である必要があります';
                s_rem = s.substr(Math.floor(s.length / 6) * 6, s.length);
                s = s.substr(0, Math.floor(s.length / 6) * 6);
            }
        }else{
            if(s.length % 4 != 0){
                if(message == '') message = '入力桁数は4の倍数である必要があります';
                s_rem = s.substr(Math.floor(s.length / 4) * 4, s.length);
                s = s.substr(0, Math.floor(s.length / 4) * 4);
            }
        }
        let array = [];
        for(let i = 0; i < s.length; i += 2){
            array.push(parseInt(s.substr(i, 2), 16));
        }

        const unicodeArray = Encoding.convert(array, {
            to: 'UNICODE',
            from: charcode
        });
        if(s_rem == ''){
            return new ConverterResult(Encoding.codeToString(unicodeArray), message);
        }else{
            return new ConverterResult(Encoding.codeToString(unicodeArray) + getErrorStr(s_rem), message);
        }
    }
}

//文字列を指定文字コードで16進数に変換する
//s: 文字列
//charcode: 文字コード。SJIS, ASCII, EUCJP, UTF8, UTF16, UNICODEのいずれか
function encodeStrHex(s, charcode, isVec=false){
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    s[i][j][k] = encodeStrHex(s[i][j][k], charcode).result;
                }   
            }
        }
        return new ConverterResult(s);
    }else{
        const unicodeArray = Encoding.stringToCode(s);//javascriptのデフォルト
        const sjisArray = Encoding.convert(unicodeArray, {
            to: charcode,
            from: 'UNICODE'
        });

        let result = "";
        for(let i = 0; i < sjisArray.length; i++){
            result += sjisArray[i].toString(16).padStart(2, '0');
        }
        return new ConverterResult(result);
    }
}

//2進数を指定文字コードで文字列に変換する
//s: 2進数文字列
//charcode: 文字コード。SJIS, ASCII, EUCJP, UTF8, UTF16, UNICODEのいずれか
function decodeStrBin(s, charcode, isVec=false){
    if(isVec){
        message = '';
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodeStrBin(s[i][j][k], charcode);
                    s[i][j][k] = tmp.result;
                    if(message =='') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        for(let i = 0; i < s.length; ++i){
            if(!(s[i] == '0'|| s[i] == '1')){
                return new ConverterResult(getErrorStr(s), `0,1で構成される文字列を入力してください`);
            }
        }
        let message = '';
        let hex = convertBase(s, 2, 16);
        return decodeStrHex(hex.result, charcode);
    }
}

//文字列を指定文字コードで2進数に変換する
//s: 文字列
//charcode: 文字コード。SJIS, ASCII, EUCJP, UTF8, UTF16, UNICODEのいずれか
function encodeStrBin(s, charcode, isVec=false){
    if(isVec){
        message = '';
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodeStrBin(s[i][j][k], charcode);
                    s[i][j][k] = tmp.result;
                    if(message =='') message = tmp.message;
                }
            }
        }
        return new ConverterResult(s, message);
    }else{
        let message = '';
        let hex = encodeStrHex(s, charcode);
        return convertBase(hex.result, 16, 2);
    }
}
