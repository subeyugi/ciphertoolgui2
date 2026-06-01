const CipherType = {
    none: 0,
    input: 1,
    charcode: 2,
    morse: 3,
    tenji: 4,
    twotouch: 5,
    charIndex: 6,
    ceaser: 7,
    mikaka: 8,
    strconv: 9,
    atbash: 10,
    vigenere: 11, 
    polybius: 12, 
    reverse: 13, 
    join: 14,
    substr: 15,
    scytale: 16,
    railfance: 17, 
    baseconv: 18,
    calc: 19
};
const cntCipherType = Object.keys(CipherType).length;

class ConverterResult{
    constructor(result, message = ''){
        this.result = result;
        this.message = message;
    }
}

class CipherObject{
    constructor(id, fromId){
        this.id = id;
        this.fromIdMain = fromId;
        this.fromIds = new Set();
        this.toIds = new Set();

        this.type = CipherType.none;
        this.options = {};
        this.separator1 = ',';
        this.separator2 = ' ';
        this.separator3 = '\n';
        this.text = '';
        this.message = '';
    }

    updateFromJSON(json){
        this.id = json.id;
        this.fromIds.clear();
        json.fromIds.forEach((e) => {this.fromIds.add(e)});
        this.toIds.clear();
        json.toIds.forEach((e) => {this.toIds.add(e)});
        this.type = json.type;
        this.options = json.options;
        this.separator = json.separator;
        this.text = json.text;
        this.message = json.message;
    }

    makeBoxHtml(){
        let position = fromId(this.id);
        let result = `<div id='box_${this.id}' class='box' style='left: ${position.x}px; top: ${position.y}px'>
            <div id='alr_${this.id}' class='alert_icon' style='display: none'></div>
            <div id='fromId_${this.id}' class='div_fromid'>${this.fromIdMain==""?"":"⇐ "+this.fromIdMain}</div>
            <select id=sel_${this.id} onchange=typeChanged("${this.id}")>
                <option value='${CipherType.none}' ></option>
                <option value='${CipherType.input}'>入力</option>
                <option value='${CipherType.charcode}' class='type_code'>文字コード</option>
                <option value='${CipherType.morse}' class='type_code'>モールス</option>
                <option value='${CipherType.tenji}' class='type_code'>点字</option>
                <option value='${CipherType.twotouch}' class='type_code'>2タッチ</option>
                <option value='${CipherType.charIndex}' class='type_code'>文字順</option>
                <option value='${CipherType.ceaser}' class='type_strconv'>シーザー</option>
                <option value='${CipherType.mikaka}' class='type_strconv'>みかか</option>
                <option value='${CipherType.strconv}' class='type_strconv'>文字置換</option>
                <option value='${CipherType.atbash}' class='type_strconv'>アトバシュ</option>
                <option value='${CipherType.vigenere}' class='type_strconv'>ビジュネル</option>
                <option value='${CipherType.polybius}' class='type_strconv'>ポリュビオス</option>
                <option value='${CipherType.reverse}' class='type_strswap'>逆順</option>
                <option value='${CipherType.join}' class='type_strswap'>結合</option>
                <option value='${CipherType.substr}' class='type_strswap'>部分文字列</option>
                <option value='${CipherType.scytale}' class='type_strswap'>スキュタレー</option>
                <option value='${CipherType.railfance}' class='type_strswap'>レールフェンス</option>
                <option value='${CipherType.baseconv}' class='type_math'>進数変換</option>
                <option value='${CipherType.calc}' class='type_math'>計算</option>
            </select>
            <div class='up_btn' onclick='upBtnClicked("${this.id}")'>▲</div>
            <div class='down_btn' onclick='downBtnClicked("${this.id}")'>▼</div>
            <div id='sp_${this.id}' class='box_sp'></div>
            <div id='txt_${this.id}' class='text_box text_box_large' readonly='readonly'></div>
        </div>`;
        return result;
    }

    changeType(type, option){
        this.type = type;
        let html = '';
        let classList = document.getElementById(`box_${this.id}`).classList;
        document.getElementById('sel_' + this.id).value = type;
        classList.remove('code');
        classList.remove('strconv');
        classList.remove('strswap');
        classList.remove('math');
        document.getElementById(`fromId_${this.id}`).style = 'display: absolute;'
        document.getElementById(`txt_${this.id}`).classList.remove('text_box_large');

        switch(this.type){
            case CipherType.none:
                document.getElementById(`txt_${this.id}`).classList.add('text_box_large');
                break;
            case CipherType.input:
                document.getElementById(`txt_${this.id}`).classList.add('text_box_large');
                document.getElementById(`fromId_${this.id}`).style = 'display: none;'
                break;
            case CipherType.charcode:
                this.options = {"code": "SJIS", "mode": "decode"};
                if(option != undefined) this.options = option;
                html = `
                    <select id='mode_${this.id}' class='boxSpElem' onchange='optionChanged("${this.id}", "mode")'>
                        <option ${this.options.mode=='decodeHex'?'selected':''} value='decodeHex'>16進数→文字</option>
                        <option ${this.options.mode=='decodeBin'?'selected':''} value='decodeBin'>2進数→文字</option>
                        <option ${this.options.mode=='encodeHex'?'selected':''} value='encodeHex'>文字→16進数</option>
                        <option ${this.options.mode=='encodeBin'?'selected':''} value='encodeBin'>文字→2進数</option>
                    </select>
                    <select id='code_${this.id}' class='boxSpElem' onchange='optionChanged("${this.id}", "code")'>
                        <option ${this.options.code=='SJIS'?'selected':''} value='SJIS'>Shift_JIS</option>
                        <option ${this.options.code=='ASCII'?'selected':''} value='ASCII'>US-ASCII</option>
                        <option ${this.options.code=='EUCJP'?'selected':''} value='EUCJP'>EUC-JP</option>
                        <option ${this.options.code=='UTF8'?'selected':''} value='UTF8'>UTF-8</option>
                        <option ${this.options.code=='UTF16'?'selected':''} value='UTF16'>UTF-16</option>
                    </select>`;
                classList.add('code');
                break;
            case CipherType.charIndex:
                this.options = {"mode": "num2alpha"};
                if(option != undefined) this.options = option;
                html = `<select id='mode_${this.id}' class='boxSpElem' onchange='optionChanged("${this.id}", "mode")'>
                        <option ${this.options.mode=='num2alpha'?'selected':''} value='num2alpha'>0,1,2 → abc</option>
                        <option ${this.options.mode=='num2aiu'?'selected':''} value='num2aiu'>0,1,2 → あいう</option>
                        <option ${this.options.mode=='num2iroha'?'selected':''} value='num2iroha'>0,1,2 → いろは</option>
                        <option ${this.options.mode=='alpha2num'?'selected':''} value='alpha2num'>abc → 0,1,2</option>
                        <option ${this.options.mode=='aiu2num'?'selected':''} value='aiu2num'>あいう → 0,1,2</option>
                        <option ${this.options.mode=='iroha2num'?'selected':''} value='iroha2num'>いろは → 0,1,2</option>
                        </select>`;
                classList.add('code');
                break;
            case CipherType.morse:
                this.options = {"mode": "morse2jp"};
                if(option != undefined) this.options = option;
                html = `<select id='mode_${this.id}' class='boxSpElem' onchange='optionChanged("${this.id}", "mode")'>
                        <option ${this.options.mode=='morse2jp'?'selected':''} value='morse2jp'>モールス→日本語</option>
                        <option ${this.options.mode=='morse2en'?'selected':''} value='morse2en'>モールス→英語</option>
                        <option ${this.options.mode=='jp2morse'?'selected':''} value='jp2morse'>日本語→モールス</option>
                        <option ${this.options.mode=='en2morse'?'selected':''} value='en2morse'>英語→モールス</option>
                        </select>`;
                classList.add('code');
                break;
            case CipherType.tenji:
                this.options = {"mode": "tenji2jp"};
                if(option != undefined) this.options = option;
                html = `<select id='mode_${this.id}' class='boxSpElem' onchange='optionChanged("${this.id}", "mode")'>
                        <option ${this.options.mode=='tenji2jp'?'selected':''} value='tenji2jp'>点字→日本語</option>
                        <option ${this.options.mode=='jp2tenji'?'selected':''} value='jp2tenji'>日本語→点字</option>
                        </select>`;
                classList.add('code');
                classList.add('code');
                break;
            case CipherType.twotouch:
                this.options = {"mode": "num2char"};
                if(option != undefined) this.options = option;
                html = `<select id='mode_${this.id}' class='boxSpElem' onchange='optionChanged("${this.id}", "mode")'>
                        <option ${this.options.mode=='num2char'?'selected':''} value='num2char'>111213→あいう</option>
                        <option ${this.options.mode=='num2alpha'?'selected':''} value='char2num'>あいう→111213</option>
                        </select>`;
                classList.add('code');
                break;
            case CipherType.ceaser:
                this.options = {"rot": '0'};
                if(option != undefined) this.options = option;
                html = `rot=<input class='boxSpInputNum' type='number' id='rot_${this.id}' value='${this.options.rot}' oninput='optionChanged("${this.id}", "rot")'>`;
                classList.add('strconv');
                break;
            case CipherType.mikaka:
                this.options = {"mode": "en2jp"};
                if(option != undefined) this.options = option;
                html = `<div class='select_element element_${this.id}' data-value='en2jp' onClick='elementClicked("${this.id}")' style='display: ${this.options.mode=='en2jp'?'block':'none'};'>ntt→みかか</div>
                    <div class='select_element element_${this.id}' data-value='jp2en' onClick='elementClicked("${this.id}")' style='display: ${this.options.mode=='jp2en'?'block':'none'};'>みかか→ntt</div>`;
                classList.add('strconv');
                break;
            case CipherType.strconv:
                this.options = {'from': '', 'to': ''};
                if(option != undefined) this.options = option;
                html = `<input type='text' class='boxSpInput2' id='from_${this.id}' placeholder='a,b,c' oninput='optionChanged("${this.id}", "from")' value='${this.options.from}'>\
                    <div class='boxSpArrow'>→</div>
                    <input type='text' class='boxSpInput2' id='to_${this.id}' placeholder='0,1,2' oninput='optionChanged("${this.id}", "to")' value='${this.options.from}'>`;
                classList.add('strconv');
            case CipherType.atbash:
                classList.add('strconv');
                this.options = {'from': '', 'to': ''};
                classList.add('strconv');
                break;
            case CipherType.vigenere:
                this.options = {'mode': 'decode', 'key': 'key'};
                if(option != undefined) this.options = option;
                html = `<div class='select_element element_${this.id}' data-value='decode' onClick='elementClicked("${this.id}")' style='display: block;'>デコード</div>
                    <div class='select_element element_${this.id}' data-value='encode' onClick='elementClicked("${this.id}")' style='display: none;'>エンコード</div>
                    <input id='key_${this.id}' class='boxSpInput' oninput='optionChanged("${this.id}", "key")' value='key'>`;
                classList.add('strconv');
                break;
            case CipherType.polybius:
                html = ``;
                classList.add('strconv');
                break;
            case CipherType.reverse:
                html = ``;
                classList.add('strswap');
                break;
            case CipherType.join:
                html = ``;
                classList.add('strswap');
                break;
            case CipherType.substr:
                html = ``;
                classList.add('strswap');
                break;
            case CipherType.scytale:
                html = ``;
                classList.add('strswap');
                break;
            case CipherType.railfance:
                html = ``;
                classList.add('strswap');
                break;
            case CipherType.baseconv:
                this.options = {'from': '10', 'to': '16'};
                if(option != undefined) this.options = option;
                html = `<input id='from_${this.id}' class='num_input_from' type='number' value='10' oninput='optionChanged("${this.id}", "from")'>進数→<input id='to_${this.id}' class='num_input_to' type='number' value='16' oninput='optionChanged("${this.id}", "to")'>進数`;
                classList.add('math');
                break;
            case CipherType.calc:
                this.options = {'exp': ''};
                if(option != undefined) this.options = option;
                html = `<div id='val_${this.id}'></div>
                    <input id='exp_${this.id}' oninput='optionChanged("${this.id}", "exp")'>`;
                classList.add('math');
                break;
            default:
                html = "";
                break;
        }

        document.getElementById(`sp_${this.id}`).innerHTML = html;
        updateAllText();
    }

    toJSON(){
        let json = {
            id: this.id,
            fromIds: Array.from(this.fromIds),
            toIds: Array.from(this.toIds),
            posX: this.posX,
            posY: this.posY,
            type: this.type,
            options: this.options,
            text: this.text,
        };
        return json;
    }

    toURL(){

    }

    delete(){
        this.fromIds.forEach(e => {
            cipherObjects.get(e).toIds.delete(this.id);
        });
        
        this.toIds.forEach(e => {
            cipherObjects.get(e).fromIds.delete(this.id);
            if(cipherObjects.get(e).fromIdMain == this.id) cipherObjects.get(e).fromIdMain = "";
        });
    }

    
    changeId(newId){
        this.fromIds.forEach(e => {
            cipherObjects.get(e).toIds.delete(this.id);
            cipherObjects.get(e).toIds.add(newId);
        });
        
        this.toIds.forEach(e => {
            cipherObjects.get(e).fromIds.delete(this.id);
            cipherObjects.get(e).fromIds.add(this.id);
            if(cipherObjects.get(e).fromIdMain == this.id){
                cipherObjects.get(e).fromIdMain = newId;
            } 
        });

        this.id = newId;
        this.posX = fromId(newId).x;
        this.posY = fromId(newId).y;
    }
}

function optionChanged(id, option){
    console.log("option changed: ", id, option);
    cipherObjects.get(id).options[option] = document.getElementById(`${option}_${id}`).value;
    updateAllText();
}

//cipherObjectは中身を使いまわし
//htmlは移動前削除、移動先新規作成
function changeId(oldId, newId){
    cipherObjects.get(oldId).changeId(newId);
    cipherObjects.set(newId, cipherObjects.get(oldId));
    document.getElementById("main_area").insertAdjacentHTML('beforeend', cipherObjects.get(newId).makeBoxHtml());
    cipherObjects.get(newId).changeType(cipherObjects.get(newId).type, cipherObjects.get(newId).options);
    cipherObjects.delete(oldId);
    document.getElementById(`box_${selectFromId}`).remove();
}