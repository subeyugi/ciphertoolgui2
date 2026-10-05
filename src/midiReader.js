function vec2String(vec){
    let result = "";
    for(let i = 0; i < vec.length; i++){
        if(i != 0) result += sep1;
        result += vec[i].toString();
    }
    return result;
}

async function midiInput(id){
    let file = document.getElementById(`midiInput_${id}`).files[0];
    let type = document.getElementById(`midiInputType_${id}`).value;
    if(!file) return;

    const arrayBuffer = await file.arrayBuffer();
    midi = new Midi(arrayBuffer);
    console.log(midi.tracks);
    let notes;
    //ノートの存在するトラックを読み取る
    for(let i = 0; i < midi.tracks.length; i++){
        if(midi.tracks[i].notes.length > 0){
            notes = midi.tracks[i].notes;
            break;
        }
    }
    noteNo = [];
    noteStart = [];
    noteEnd = [];
    noteLength = [];
    let mpNoteNo = new Map();
    let mpNoteLength = new Map();
    let mpRestLength = new Map();

    for(let i = 0; i < notes.length; i++){
        noteNo.push(notes[i].midi);
        noteStart.push(notes[i].ticks);
        noteEnd.push(notes[i].ticks + notes[i].durationTicks);
        noteLength.push(notes[i].durationTicks);
        mpNoteNo.set(notes[i].midi, -1);
        mpNoteLength.set(notes[i].durationTicks, -1);
        if(i >= 1) mpRestLength.set(notes[i].ticks - (notes[i - 1].ticks + notes[i - 1].durationTicks), -1);
    }
    //console.log(noteStart);
    //console.log(noteLength);
    let result = "";
    switch(type){
        case "noteNo":
            result = vec2String(noteNo);
            break;
        case "startTime":
            result = vec2String(noteStart);
            break;
        case "length":
            result = vec2String(noteLength);
            break;
        case "morse":
            vecOn = [];
            mpNoteLength.keys().forEach((e) => {vecOn.push(e)});
            vecOn.sort((x, y) => x - y);
            mpNoteLength.set(vecOn[0], "・");
            mpNoteLength.set(vecOn[1], "－");
            vecOff = [];
            mpRestLength.keys().forEach((e) => {vecOff.push(e)});
            vecOff.sort((x, y) => x - y);
            mpRestLength.set(vecOff[0], "");
            mpRestLength.set(vecOff[1], "　");
            for(let i = 0; i < notes.length; i++){
                if(i >= 1) result += mpRestLength.get(notes[i].ticks - (notes[i - 1].ticks + notes[i - 1].durationTicks));
                result += mpNoteLength.get(noteLength[i]);
            }
            break;
        case "binary":
            let step = noteLength[0];
            let now = noteStart[0];
            for(let i = 0; i < noteStart.length; i++){
                while(now < noteStart[i]){
                    now += step;
                    result += "0";
                }
                result += "1";
                now += step;
            }
            break;
        case "quaternary":
            break;
        case "base_n":
            vec = [];
            mpNoteNo.keys().forEach((e) => {vec.push(e)});
            vec.sort((x, y) => x - y);
            for(let i = 0; i < vec.length; i++){
                mpNoteNo.set(vec[i], i);
            }
            for(let i = 0; i < noteNo.length; i++){
                result += letters[mpNoteNo.get(noteNo[i])];
            }
            break;
    }
    
    //出力更新
    cipherObjects.get(id).text = result;
    document.getElementById("top_input_id").innerText = id;
    document.getElementById("input_text").value = result;
    document.getElementById("top_input_length").innerText = getStrLength(result);
    document.getElementById(`box_${id}`).classList.add('clicked');
    document.getElementById(`txt_${id}`).innerText = result;
    updateAllText();
}