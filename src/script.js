let selectFromId = undefined;

//クリックしたとき
document.getElementById("main_area").addEventListener("mousedown", (e) =>{
    selectFromId = undefined;
    let rect = e.currentTarget.getBoundingClientRect();
    let position = fromXY(e.clientX - rect.left, e.clientY - rect.top);

    //入力、出力idを更新
    if(cipherObjects.has(position.id)){
        if(cipherObjects.get(position.id).type == CipherType.input){
            inputId = position.id;
            document.getElementById("top_input_id").innerText = inputId;
        }else{
            outputId = position.id;
            document.getElementById("top_output_id").innerText = outputId;
            document.getElementById("output_text").innerText = cipherObjects.get(outputId).text;
        }
    }

    //新規リンクbox作成、box移動用selectFromId取得
    if((e.clientY - rect.top) - position.y >= 100){
        selectFromId = position.id;
        if(!cipherObjects.has(selectFromId)){
            selectFromId = undefined;
        }
    }
});

//マウスを離したとき
document.getElementById("main_area").addEventListener("mouseup", (e) => {
    var rect = e.currentTarget.getBoundingClientRect();
    let position = fromXY(e.clientX - rect.left, e.clientY - rect.top);
    selectToId = position.id;
    if(selectFromId != selectToId && selectFromId != undefined){
        if(!cipherObjects.has(selectToId)){
            //新規box追加
            let tmp = new CipherObject(selectToId, selectFromId);
            document.getElementById("main_area").insertAdjacentHTML('beforeend', tmp.makeBoxHtml());
            cipherObjects.set(selectToId, tmp);
            cipherObjects.get(selectFromId).toIds.add(selectToId);
            cipherObjects.get(selectToId).fromIds.add(selectFromId);

            //outputIdを新規boxのものに更新
            outputId = selectToId;
            document.getElementById("top_output_id").innerText = outputId;
            selectFromId = undefined;
        }
    }
    selectToId = undefined;
});

function typeChanged(id){
    let type = parseInt(document.getElementById(`sel_${id}`).value);
    cipherObjects.get(id).changeType(type);
}

function boxClicked(){
    document.getElementById('top_input_id').value = "xx";
}

document.getElementById("input_text").addEventListener("keyup", (e)=>{
    cipherObjects.get("A1").text = document.getElementById("input_text").value;
    document.getElementById("txt_A1").innerText = document.getElementById("input_text").value;
    updateAllText();
});

// ResizeObserverのインスタンスを作成
const resizeObserver = new ResizeObserver(entries => {
    // リサイズされた要素の寸法を取得
    const { width, height } = entries[0].contentRect;
    document.getElementById("output_text").style.height = `${height+2}px`;
    document.getElementById("top_io_bar").style.height = `${height + 85}px`;
});
resizeObserver.observe(document.getElementById('input_text'));

function saveBtnClicked(){
    cipherObjects.forEach((val, key)=>{
        console.log(val);
    });
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
