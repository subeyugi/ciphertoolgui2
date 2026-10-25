//boxClicked クリックしたとき
document.getElementById("main_area").addEventListener("mousedown", (e) =>{
    selectFromId = undefined;
    let rect = e.currentTarget.getBoundingClientRect();
    let position = fromXY(e.clientX - rect.left, e.clientY - rect.top);

    if(inputId != "") document.getElementById(`box_${inputId}`).classList.remove('clicked');
    if(outputId != "") document.getElementById(`box_${outputId}`).classList.remove('clicked');
    nowSelectId = undefined;

    //入力、出力idを更新
    if(cipherObjects.has(position.id)){
        if(cipherObjects.get(position.id).type == CipherType.input || cipherObjects.get(position.id).type == CipherType.midi){
            inputId = position.id;
            document.getElementById("top_input_id").innerText = inputId;
            document.getElementById("input_text").value = cipherObjects.get(inputId).text;
            document.getElementById("top_input_length").innerText = getStrLength(cipherObjects.get(inputId).text);
            document.getElementById(`box_${inputId}`).classList.add('clicked');
            nowSelectId = position.id;
        }else{
            outputId = position.id;
            document.getElementById("top_output_id").innerText = outputId;
            document.getElementById("output_text").value = cipherObjects.get(outputId).text;
            document.getElementById("top_output_length").innerText = getStrLength(cipherObjects.get(outputId).text);
            document.getElementById(`box_${position.id}`).classList.add('clicked');
            nowSelectId = position.id;
        }
    }

    //新規リンクbox作成、box移動用selectFromId取得、下黒textエリアに判定
    selectFromId = position.id;
    if(cipherObjects.has(selectFromId)){
        if(cipherObjects.get(selectFromId).type == CipherType.none || cipherObjects.get(selectFromId).type == CipherType.input){
            if((e.clientY - rect.top) - position.y < 40){
                selectFromId = undefined;
            }
        }else{
            if((e.clientY - rect.top) - position.y < 100){
                selectFromId = undefined;
            }
        }
    }else{
        selectFromId = undefined;
    }
});

document.getElementById("main_area").addEventListener("mousemove", (e) => {
    if(selectFromId != undefined){
        let rect = e.currentTarget.getBoundingClientRect();
        let position = fromXY(e.clientX - rect.left, e.clientY - rect.top);
        if(position.id != selectFromId){
            if(cipherObjects.get(position.id) == undefined){
                document.getElementById('cursor').style = `left:${position.x}px; top:${position.y}px; display: block;`;
                document.getElementById('cursor').innerText = `${ctrlPressed?"Move":"New"}`;
            }else if(ctrlPressed){
                document.getElementById('cursor').style = `left:${position.x}px; top:${position.y}px; display: block;`;
                document.getElementById('cursor').innerText = "Link";
            }else{
                document.getElementById('cursor').style = "display: none;";
            }
        }else{
            document.getElementById('cursor').style = "display: none;";
        }
    }
});

//マウスを離したとき
document.getElementById("main_area").addEventListener("mouseup", (e) => {
    let rect = e.currentTarget.getBoundingClientRect();
    let position = fromXY(e.clientX - rect.left, e.clientY - rect.top);
    selectToId = position.id;
    if(selectFromId != selectToId && selectFromId != undefined){
        if(!cipherObjects.has(selectToId)){
            if(ctrlPressed){
                if(cipherObjects.get(selectToId) == undefined){
                    //box移動
                    if(cipherObjects.get(selectFromId).type == CipherType.input){
                        inputId = position.id;
                        document.getElementById("top_input_id").innerText = inputId;
                        nowSelectId = position.id;
                    }else{
                        outputId = position.id;
                        document.getElementById("top_output_id").innerText = outputId;
                        nowSelectId = position.id;
                    }
                    changeId(selectFromId, position.id);
                    document.getElementById(`box_${position.id}`).classList.add('clicked');
                    nowSelectId = position.id;
                }
            }else{
                //新規box追加
                let tmp = new CipherObject(selectToId, selectFromId);
                document.getElementById("main_area").insertAdjacentHTML('beforeend', tmp.makeBoxHtml());
                cipherObjects.set(selectToId, tmp);
                cipherObjects.get(selectFromId).toIds.add(selectToId);
                cipherObjects.get(selectToId).fromIds.add(selectFromId);
                if(inputId != "") document.getElementById(`box_${inputId}`).classList.remove('clicked');
                if(outputId != "") document.getElementById(`box_${outputId}`).classList.remove('clicked');
                nowSelectId = undefined;

                //outputIdを新規boxのものに更新
                outputId = selectToId;
                document.getElementById("top_output_id").innerText = outputId;
                selectFromId = undefined;
                document.getElementById(`box_${outputId}`).classList.add('clicked');
                nowSelectId = outputId;
                updateAllText();
            }
        }else if(ctrlPressed){
            //link変更
            cipherObjects.get(selectToId).fromIds.forEach(id => {
                cipherObjects.get(id).toIds.delete(selectToId);
            });
            cipherObjects.get(selectToId).fromIdMain = selectFromId;
            cipherObjects.get(selectToId).fromIds = new Set([selectFromId]);
            cipherObjects.get(selectFromId).toIds.add(selectToId);
            document.getElementById(`fromId_${selectToId}`).innerText = "⇐ " + selectFromId;
            updateAllText();
        }
    }
    selectToId = undefined;
    selectFromId = undefined;
    document.getElementById('cursor').style = `top:100px; display: none;`;
});

function typeChanged(id){
    let type = parseInt(document.getElementById(`sel_${id}`).value);
    cipherObjects.get(id).changeType(type);
}

document.getElementById('input_text').addEventListener('keyup', (e)=>{
    cipherObjects.get(inputId).text = document.getElementById('input_text').value;
    document.getElementById(`txt_${inputId}`).innerText = document.getElementById('input_text').value;
    document.getElementById("top_input_length").innerText = getStrLength(document.getElementById('input_text').value);
    updateAllText();
});

// ResizeObserverのインスタンスを作成
const resizeObserver = new ResizeObserver(entries => {
    // リサイズされた要素の寸法を取得
    const { width, height } = entries[0].contentRect;
    document.getElementById('output_text').style.height = `${height + 2}px`;
    document.getElementById('top_io_bar').style.height = `${height + 85}px`;
});
resizeObserver.observe(document.getElementById('input_text'));

function saveBtnClicked(){
    let text = '';
    let result = [];
    cipherObjects.forEach((val, key)=>{
        result.push(val);
    });

    var date = new Date();
    var year = date.getFullYear();
    const blob = new Blob([JSON.stringify(result, undefined, 4)], { type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ciphertool_${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${document.getElementById("output_text").value}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//入出力のコピー
function inputCopyBtnClicked(){
  navigator.clipboard.writeText(document.getElementById("input_text").value).then(() => {
    console.log("copy finished", document.getElementById("input_text").value);
  });
};

function outputCopyBtnClicked(){
  navigator.clipboard.writeText(document.getElementById("output_text").value).then(() => {
    console.log("copy finished", document.getElementById("output_text").value);
  });
};

function upBtnClicked(id){
    cipherObjects.get(id).changeType((cipherObjects.get(id).type + cntCipherType - 1) % cntCipherType);
}

function downBtnClicked(id){
    cipherObjects.get(id).changeType((cipherObjects.get(id).type + 1) % cntCipherType);
}

function elementClicked(id){
    let elememts = Array.from(document.getElementsByClassName('element_' + id));
    elememts.forEach(e => {
        if(e.style.display == 'block'){
            e.style.display = 'none';
        }else{
            e.style.display = 'block';
            cipherObjects.get(id).options["mode"] = e.dataset.value;
        }
    });
    updateAllText();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete') {
        document.getElementById(`box_${nowSelectId}`).remove();
        cipherObjects.get(nowSelectId).delete();
        cipherObjects.delete(nowSelectId);
        
        if(inputId == nowSelectId){
            inputId = "";
            document.getElementById(`top_input_id`).innerText = "";
        }
        if(outputId == nowSelectId){
            outputId = "";
            document.getElementById(`top_output_id`).innerText = "";
        }
    }else if(event.ctrlKey){
        ctrlPressed = true;
        if(selectFromId != undefined){
            if(document.getElementById('cursor').innerText == "New"){
                document.getElementById('cursor').innerText = 'Move';
            }
        }
    }
});

document.addEventListener('keyup', (event) => {
    ctrlPressed = false;
    if(selectFromId != undefined){
        document.getElementById('cursor').innerText = 'New';
    }
});

//ファイル読み込み
document.getElementById('file_input').addEventListener('change', (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e){
        let result = JSON.parse(reader.result);
        cipherObjects.forEach((val, id) => {
            document.getElementById(`box_${id}`).remove();
        });
        cipherObjects.clear();

        for(let i = 0; i < result.length; i++){
            let obj = new CipherObject();
            //console.log(result[i]);
            obj.updateFromJSON(result[i]);
            cipherObjects.set(obj.id, obj);
            document.getElementById('main_area').insertAdjacentHTML('beforeend', obj.makeBoxHtml());
            cipherObjects.get(obj.id).changeType(obj.type, obj.options, false);
        }
        updateAllText();
        console.log("load file finished");
    };
});

//URL変換ボタンクリック
function copyURLClicked(){
    let urlParam = "https://ciphertoolgui2.pentate.workers.dev?";
    cipherObjects.forEach(e => {
        option = ""
        switch(e.type){
            case CipherType.none:
                break;
            case CipherType.input:
                option = encodeURI(e.text);
                break;
            case CipherType.midi:
                break;
            case CipherType.charcode:
                option = `${e.options.mode}_${e.options.code}_${e.options.add?"T":"F"}`;
                break;
            case CipherType.charIndex:
                option = `${e.options.mode}`;
                break;
            case CipherType.morse:
                option = `${e.options.mode}`;
                break;
            case CipherType.tenji:
                option = `${e.options.mode}`;
                break;
            case CipherType.twotouch:
                option = `${e.options.mode}`;
                break;
            case CipherType.ceaser:
                option = `${e.options.rot}`;
                break;
            case CipherType.mikaka:
                option = `${e.options.mode}`;
                break;
            case CipherType.strconv:
                option = `${encodeURI(e.options.from)}_${encodeURI(e.options.to)}`;
                break;
            case CipherType.atbash:
                break;
            case CipherType.vigenere:
                option = `${e.options.mode}_${encodeURI(e.options.key)}`;
                break;
            case CipherType.polybius:
                option = `${e.options.mode}`;
                break;
            case CipherType.reverse:
                break;
            case CipherType.split:
                option = `${encodeURI(e.options.mode)}_${encodeURI(e.options.val)}`;
                break;
            case CipherType.format:
                option = `${encodeURI(e.options.format)}`;
                break;
            case CipherType.scytale:
                option = `${e.options.mode}_${e.options.interval}`;
                break;
            case CipherType.railfence:
                option = `${e.options.mode}_${e.options.rail}`;
                break;
            case CipherType.baseconv:
                option = `${e.options.from}_${e.options.to}`;
                break;
            case CipherType.calc:
                option = `${encodeURI(e.options.exp)}`;
                break;
        }
        urlParam += `(${e.id}.${e.fromIdMain}.${Object.keys(CipherType)[e.type]}.${option})`
    });
    console.log(urlParam);
    navigator.clipboard.writeText(urlParam).then(() => {
        console.log("copy finished", urlParam);
    });
}