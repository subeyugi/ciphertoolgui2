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
    uesugi: 12,
    polybius: 13, 
    reverse: 14, 
    join: 15,
    substr: 16,
    scytale: 17,
    railfance: 18, 
    baseconv: 19,
    calc: 20
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
        this.fromHash = 0;
        this.text = json.text;
        this.message = json.message;
    }

    makeBoxHtml(){
        let position = fromId(this.id);
        let result = `<div id='box_${this.id}' class='box' onMousedown='boxClicked("${this.id}")' style='left: ${position.x}px; top: ${position.y}px'>
            <div id='alr_${this.id}' class='alert_icon' style='display: none'></div>
            <div class='div_fromid'>${this.fromIdMain==""?"":"⇐ "+this.fromIdMain}</div>
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
            <div id='txt_${this.id}' class='text_box' readonly='readonly'></div>
        </div>`;
        return result;
    }

    changeType(type){
        this.type = type;
        let html = '';
        let classList = document.getElementById(`box_${this.id}`).classList;
        document.getElementById('sel_' + this.id).value = type;
        classList.remove('code');
        classList.remove('strconv');
        classList.remove('posconv');
        classList.remove('math');

        switch(this.type){
            case CipherType.charcode:
                html = `<select id='code_${this.id}' class='box_charcode_code' onchange='optionChanged("${this.id}", "code")'>
                        <option selected value='SJIS'>Shift_JIS</option>
                        <option value='ASCII'>US-ASCII</option>
                        <option value='EUCJP'>EUC-JP</option>
                        <option value='UTF8'>UTF-8</option>
                        <option value='UTF16'>UTF-16</option>
                    </select>
                    <select id='mode_${this.id}' class='box_charcode_option' onchange='optionChanged("${this.id}", "mode")'>
                        <option selected value='decodeHex'>16進数→文字</option>
                        <option value='encodeHex'>文字→16進数</option>
                        <option value='decodeBin'>2進数→文字</option>
                        <option value='encodeBin'>文字→2進数</option>
                    </select>`;
                classList.add('code');
                this.options = {"code": "SJIS", "mode": "decode"};
                break;
            case CipherType.charIndex:
                html = `<select id='mode_${this.id}' class='box_charIndex' onchange='optionChanged("${this.id}", "mode"'>
                        <option selected value='num2alpha'>0,1,2 → abc</option>
                        <option value='num2aiu'>0,1,2 → あいう</option>
                        <option value='num2iroha'>0,1,2 → いろは</option>
                        <option value='alpha2num'>abc → 0,1,2</option>
                        <option value='aiu2num'>あいう → 0,1,2</option>
                        <option value='iroha2num'>いろは → 0,1,2</option>
                        </select>`;
                this.options = {"mode": "num2alpha"};
                classList.add('code');
                break;
            case CipherType.morse:
                html = `<select id='mode_${this.id}' class='box_morse' onchange='optionChanged("${this.id}", "mode")'>
                        <option selected value='morse2jp'>モールス→日本語</option>
                        <option value='morse2en'>モールス→英語</option>
                        <option value='jp2morse'>日本語→モールス</option>
                        <option value='en2morse'>英語→モールス</option>
                        </select>`;
                this.options = {"mode": "morse2jp"};
                classList.add('code');
                break;
            case CipherType.tenji:
                classList.add('code');
                break;
            case CipherType.twotouch:
                html = `<div class='box_twotouch_type' data-value='num2char' onClick='elementClicked("${this.id}")' style='display: block;'>111213→あいう</div>
                    <div class='box_twotouch_type' data-value='char2num' onClick='elementClicked("${this.id}")' style='display: none;'>あいう→111213</div>`;
                classList.add('code');
                this.options = {"mode": "num2char"};
                break;
            case CipherType.ceaser:
                html = `rot=<input class='num_input' type='number' id='rot_${this.id}' value='0' oninput='optionChanged("${this.id}", "rot")'>`;
                classList.add('strconv');
                this.options = {"rot": '0'};
                break;
            case CipherType.mikaka:
                html = `<select id='mode_${this.id}' class='box_mikaka' onchange='optionChanged("${this.id}", "mikaka")'>
                        <option selected value='morse2jp'>ntt→みかか</option>
                        <option value='morse2en'>みかか→ntt</option>
                        </select>`;
                classList.add('strconv');
                this.options = {"mode": "en2jp"};
                console.log("aa", html);
                break;
            case CipherType.strconv:
                html = `<input type='text' class='strconvFrom' id='from_${this.id}' placeholder='a,b,c' oninput='optionChanged("${this.id}", "from")'>\
                    <div class='strconvArrow'>→</div>
                    <input type='text' class='strconvTo' id='to_${this.id}' placeholder='0,1,2' oninput='optionChanged("${this.id}", "to")'>`;
                classList.add('strconv');
                this.options = {'from': '', 'to': ''};
                break;
            case CipherType.atbash:
                html = `<input type='text' id='from_${this.id}' oninput='optionChanged("${this.id}", "from")'>\
                    →\
                    <input type='text' id='to_${this.id}' oninput='optionChanged("${this.id}", "to")'>`;
                classList.add('strconv');
                this.options = {'from': '', 'to': ''};
                classList.add('strconv');
                break;
            case CipherType.vigenere:
                html = `<input id='key_${this.id}' oninput='optionChanged("${this.id}", "key")'>
                    <div class='select_element element_${this.id}' data-value='decode' onClick='elementClicked("${this.id}")' style='display: block;'>デコード</div>
                    <div class='select_element element_${this.id}' data-value='encode' onClick='elementClicked("${this.id}")' style='display: none;'>エンコード</div>`;
                this.options = {'mode': 'decode', 'key': ''};
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
                html = `<input id='from_${this.id}' class='num_input' type='number' value='10' oninput='optionChanged("${this.id}", "from")'>進数→<input id='to_${this.id}' class='num_input' type='number' value='16' oninput='optionChanged("to", "${this.id}")'>進数`;
                classList.add('math');
                this.options = {'from': '10', 'to': '16'};
                break;
            case CipherType.calc:
                html = `<div id='val_${this.id}'></div>
                    <input id='exp_${this.id}' oninput='optionChanged("${this.id}", "exp")'>`;
                classList.add('math');
                this.options = {'exp': ''};
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
}

function optionChanged(id, option){
    console.log("optionChanged", id, option)
    cipherObjects.get(id).options[option] = document.getElementById(`${option}_${id}`).value;
    updateAllText();
}