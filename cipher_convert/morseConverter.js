let morseDataJP = "\
あ －－・－－\n\
い ・－\n\
う ・・－\n\
え －・－－－\n\
お ・－・・・\n\
か ・－・・\n\
き －・－・・\n\
く ・・・－\n\
け －・－－\n\
こ －－－－\n\
さ －・－・－\n\
し －－・－・\n\
す －－－・－\n\
せ ・－－－・\n\
そ －－－・\n\
た －・\n\
ち ・・－・\n\
つ ・－－・\n\
て ・－・－－\n\
と ・・－・・\n\
な ・－・\n\
に －・－・\n\
ぬ ・・・・\n\
ね －－・－\n\
の ・・－－\n\
は －・・・\n\
ひ －－・・－\n\
ふ －－・・\n\
へ ・\n\
ほ －・・\n\
ま －・・－\n\
み ・・－・－\n\
む －\n\
め －・・・－\n\
も －・・－・\n\
や ・－－\n\
ゆ －・・－－\n\
よ －－\n\
ら ・・・\n\
り －－・\n\
る －・－－・\n\
れ －－－\n\
ろ ・－・－\n\
わ －・－\n\
を ・－－－\n\
ん ・－・－・\n\
゛ ・・\n\
゜ ・・－－・\n\
ー ・－－・－"

morseDataEN = "\
a ・－\n\
b －・・・\n\
c －・－・\n\
d －・・\n\
e ・\n\
f ・・－・\n\
g －－・\n\
h ・・・・\n\
i ・・\n\
j ・－－－\n\
k －・－\n\
l ・－・・\n\
m －－\n\
n －・\n\
o －－－\n\
p ・－－・\n\
q －－・－\n\
r ・－・\n\
s ・・・\n\
t －\n\
u ・・－\n\
v ・・・－\n\
w ・－－\n\
x －・・－\n\
y －・－－\n\
z －－・・\n\
";

let hiragana2morseMap = new Map();
let morse2hiraganaMap = new Map();
let alphabet2morseMap = new Map();
let morse2alphabetMap = new Map();

morseDataJP.split('\n').forEach(e=>{
    let hiragana = e.split(' ')[0];
    let morse = e.split(' ')[1];
    hiragana2morseMap.set(hiragana, morse);
    morse2hiraganaMap.set(morse, hiragana);
});

morseDataEN.split('\n').forEach(e=>{
    let alphabet = e.split(' ')[0];
    let morse = e.split(' ')[1];
    alphabet2morseMap.set(alphabet, morse);
    morse2alphabetMap.set(morse, alphabet);
});

function encodeMorseJP(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodeMorseJP(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        s = splitDakuten(s);
        for(let i = 0; i < s.length; i++){
            if(i != 0) result += '　';
            let c = hiragana2morseMap.get(s[i]);
            if(c != undefined){
                result += c;
            }else{
                result += getErrorStr(s[i]);
                if(message == '') message = `"${s[i]}"を変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}

function decodeMorseJP(s, isVec=false){
    let result = '';
    let s2 = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodeMorseJP(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        for(let i = 0; i < s.length; ++i){
            if(s[i] == '.'){
                s2 += '・';
            }else if(s[i] == '_' || s[i] == '-'){
                s2 += '－';
            }else if(s[i] == ' '){
                s2 += '　'
            }else{
                s2 += s[i];
            }
        }
        let v = s2.split('　');
        for(let i = 0; i < v.length; i++){
            let c = morse2hiraganaMap.get(v[i]);
            if(c != undefined){
                result += c;
            }else{
                result += getErrorStr(v[i]);
                if(message == '') message = `"${v[i]}"を変換できません`;
            }
        }
        result = joinDakuten(result);
        return new ConverterResult(result, message);
    }
}


function encodeMorseEN(s, isVec=false){
    let result = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = encodeMorseEN(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        for(let i = 0; i < s.length; i++){
            if(i != 0) result += ' ';
            let c = alphabet2morseMap.get(s[i]);
            if(c != undefined){
                result += c;
            }else{
                result += getErrorStr(s[i]);
                if(message == '') message = `"${s[i]}"を変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}

function decodeMorseEN(s, isVec=false){
    let result = '';
    let s2 = '';
    let message = '';
    if(isVec){
        for(let i = 0; i < s.length; ++i){
            for(let j = 0; j < s[i].length; ++j){
                for(let k = 0; k < s[i][j].length; ++k){
                    let tmp = decodeMorseEN(s[i][j][k]);
                    s[i][j][k] = tmp.result;
                    if(message == '') message = tmp.message;
                }   
            }
        }
        return new ConverterResult(s, message);
    }else{
        for(let i = 0; i < s.length; ++i){
            if(s[i] == '.' || s[i] == '･'){
                s2 += '・';
            }else if(s[i] == '_' || s[i] == '-'){
                s2 += '－';
            }else if(s[i] == ' '){
                s2 += '　'
            }else{
                s2 += s[i];
            }
        }
        let v = s2.split('　');
        for(let i = 0; i < v.length; i++){
            let c = morse2alphabetMap.get(v[i]);
            if(c != undefined){
                result += c;
            }else{
                result += getErrorStr(v[i]);
                if(message == '') message = `"${v[i]}"を変換できません`;
            }
        }
        return new ConverterResult(result, message);
    }
}
