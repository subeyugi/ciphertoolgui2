let morse = "－・・－・　・－－・－　－・－－・　－－－・－　－－・－・　・－・－・　－－－－　・・　・・－　－・　・・　・－・・・";
let exportMidiType = "";
let bpm = 132;
let shortLength = 1/32;
let longLength = 3/32;
let spauseLength = 1/32;
let pauseLength = 3/32;
let noteNo = 60;

function vec2str(vec){
    let result = "";
    for(let i = 0; i < vec.length; i++){
        if(i != 0) result += ",";
        result += vec[i].toFixed(3);
    }
    return result;
}

function str2vec(s){
    return s.split(",");
}

function toDecimal(s){
    if(!/^[\d.\/]+$/g.test(s)) return 0;
    if(/^[\d.]+$/g.test(s)){//数字の場合
        return parseFloat(s);
    }else{
        let sep = s.split("/");
        if(sep.length == 2){
            if(!/^\d+$/g.test(sep[0])) return 0;
            if(!/^\d+$/g.test(sep[1])) return 0;
            return sep[0] / sep[1];
        }else{
            return 0;
        }
    }
}

function exportUpdate(){
    exportMidiType = document.getElementById("bottomMidiType").value;
    morse = document.getElementById("bottomMorse").value;
    document.getElementById("bottomMorse").classList.remove("errorBox");
    if(/^・－　$/g.test(morse)){
    }else if(morse[0] == "{" && morse[morse.length - 1] == "}"){
        let id = morse.substring(1, morse.length - 1);
        if(isId(id)){
            morse = cipherObjects.get(id).text;
        }else{
            document.getElementById("bottomMorse").classList.add("errorBox");
        }
    }else{
        document.getElementById("bottomMorse").classList.add("errorBox");
    }
    bpm = document.getElementById("bottomBpm").value;
    if(!/^[\d.]+$/g.test(bpm)){
        document.getElementById("bottomBpm").classList.add("errorBox");
    }else{
        document.getElementById("bottomBpm").classList.remove("errorBox");
    }
    shortLength = toDecimal(document.getElementById("bottomShortLength").value);
    if(shortLength == 0){
        document.getElementById("bottomShortLength").classList.add("errorBox");
    }else{
        document.getElementById("bottomShortLength").classList.remove("errorBox");
    }
    longLength = toDecimal(document.getElementById("bottomLongLength").value);
    if(longLength == 0){
        document.getElementById("bottomLongLength").classList.add("errorBox");
    }else{
        document.getElementById("bottomLongLength").classList.remove("errorBox");
    }
    spauseLength = toDecimal(document.getElementById("bottomSPauseLength").value);
    if(spauseLength == 0){
        document.getElementById("bottomSPauseLength").classList.add("errorBox");
    }else{
        document.getElementById("bottomSPauseLength").classList.remove("errorBox");
    }
    pauseLength = toDecimal(document.getElementById("bottomPauseLength").value);
    if(pauseLength == 0){
        document.getElementById("bottomPauseLength").classList.add("errorBox");
    }else{
        document.getElementById("bottomPauseLength").classList.remove("errorBox");
    }
    noteNo = document.getElementById("bottomNoteNo").value;
    if(!/^[\d.]+$/g.test(noteNo)){
        document.getElementById("bottomNoteNo").classList.add("errorBox");
    }else{
        document.getElementById("bottomNoteNo").classList.remove("errorBox");
    }
    let endType = document.getElementById("bottomEndType").value;

    if(exportMidiType == "morse"){
        let wholeTime = 60 * 4 / bpm;
        let now = 0;
        let startTime = [];
        let endTime = [];
        let inf = 600;
        for(let i = 0; i < morse.length; i++){
            if(morse[i] == "・"){
                startTime.push(now);
                endTime.push(now + shortLength * wholeTime);
                now += (shortLength + spauseLength) * wholeTime;
            }else if(morse[i] == "－"){
                startTime.push(now);
                endTime.push(now + longLength * wholeTime);
                now += (longLength + spauseLength) * wholeTime;
            }else if(morse[i] == "　"){
                now += (pauseLength - spauseLength) * wholeTime;
            }else{
                console.log("error");
            }
        }
        if(endType == "nextStart"){
            for(let i = 0; i < endTime.length - 1; i++){
                endTime[i] = startTime[i + 1];
            }
            endTime[startTime.length - 1] = startTime[startTime.length - 1] + inf;
        }else if(endType == "none"){
            for(let i = 0; i < endTime.length; i++){
                endTime[i] = startTime[i] + inf;
            }
        }
        document.getElementById("bottomStart").value = vec2str(startTime);
        document.getElementById("bottomEnd").value = vec2str(endTime);
    }
}

function outputLuaClicked(){
    let type = document.getElementById("bottomDrawType").value;
    let text = document.getElementById("bottomText").value;
    let x = document.getElementById("bottomX").value;
    let y = document.getElementById("bottomY").value;
    let startTime = document.getElementById("bottomStart").value;
    let endTime = document.getElementById("bottomEnd").value;
    let file = document.getElementById("bottomFile").value;
    let fileExt = document.getElementById("bottomFileExt").value;

    result = "<?\n";
    result += `--モールス： ${morse}\n\n`;
    result += `local posX = ${x}\n`;
    result += `local posY = ${y}\n`;
    result += `local timeStart = {${startTime}}\n`;
    result += `local timeEnd = {${endTime}}\n`;
    if(type != "text"){
        result += `local file = "C:\\\\${file}.${fileExt}"\n\n`;
    }else{
        result += `local text = "${text}"\n\n`;
    }

    result += `local t = obj.time\n`;
    result += `for i=1,#timeStart do\n`;
    result += `  if timeStart[i]<=t and t<timeEnd[i] then\n`;
    
    if(type == "text"){
        result += `    obj.load("text", text)\n`;
    }else if(type == "figure"){
        result += `    obj.load("figure", "四角形")\n`;
    }else if(type == "image"){
        result += `    obj.load("image", file)\n`;
    }else if(type == "movie"){
        result += `    obj.load("movie", file, t-timeStart[i])\n`;
    }
    
    result += `    obj.draw(posX, posY)\n`;
    result += `  end\n`;
    result += `end\n`;
    result += `?>`;
    document.getElementById("luaOutput").value = result;
}
