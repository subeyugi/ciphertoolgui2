function fromCR(col, row){
    if(col < 0) return undefined;
    if(row < 0) return undefined;
    return {
        "col": col,
        "row": row,
        "id": String.fromCharCode(65 + col) + (row + 1),
        "x": col * gridWidth + gridStartLeft, 
        "y": row * gridHeight + gridStartTop,
    };
}

function fromId(id){
    let col = id.charCodeAt(0) - 65;
    let row = parseInt(id.substring(1, id.length)) - 1;
    return {
        "id": id,
        "col": col,
        "row": row,
        "x": col * gridWidth + gridStartLeft, 
        "y": row * gridHeight + gridStartTop,
    };
}

function fromXY(x, y){
    if(x < 0) return undefined;
    if(y < 0) return undefined;
    let col = Math.floor((x - gridStartLeft) / gridWidth);
    let row = Math.floor((y - gridStartTop) / gridHeight);
    return {
        "col": col,
        "row": row,
        "x": col * gridWidth + gridStartLeft, 
        "y": row * gridHeight + gridStartTop,
        "id": String.fromCharCode(65 + col) + (row + 1), 
    };
}

function isId(id){
    if(!('A'.charCodeAt(0) <= id.charCodeAt(0) && id.charCodeAt(0) <= 'Z'.charCodeAt(0))) return false;
    if(isNaN(id.substring(1, id.length))) return false;
    return cipherObjects.has(id);
}

function getTextType(s){
    if(s == "") return "unknown";
    if(/^[a-zA-Z]$/g.test(s[0])) return "alphabet";
    if(/^\d$/g.test(s[0])) return "number";
    if(0x2800 <= s.charCodeAt(0) && s.charCodeAt(0) <= 0x28ff) return "tenji";
    if(/^[・－　]$/g.test(s[0])) return "morse";
    return "other";
}

//url取得
urlQueryParams = new URL(window.location.href).search.substring(1);
console.log("urlParam=", urlQueryParams);

//方眼の表示
let grid = document.getElementById('main_area');
//縦線
for(let i = 0; i < gridColumnCount + 1; i++){
    grid.insertAdjacentHTML('beforeend', `<div class="gridline_vertical" style="top:${gridStartTop}px; left:${gridStartLeft + gridWidth * i}px; height:${gridHeight * gridRowCount}px"></div>`);
    if(i > 0){
        grid.insertAdjacentHTML('beforeend', `<div class="scale" style="top:${gridStartTop - 30}px; left:${gridStartLeft + gridWidth * (i - 0.5)}px">${String.fromCharCode(64 + i)}</div>`);
    }
}
//横線
for(let i = 0; i < gridRowCount + 1; i++){
    grid.insertAdjacentHTML('beforeend', `<div class="gridline_horizontal" style="top:${gridStartTop + gridHeight * i}px; left:${gridStartLeft}px; width:${gridWidth * gridColumnCount}px"></div>`);
    if(i > 0){
        grid.insertAdjacentHTML('beforeend', `<div class="scale" style="left:${gridStartLeft - 30}px; top:${gridStartTop + gridHeight * (i - 0.5) - 10}px">${i}</div>`);
    }
}

//初期boxを作成
let initObj = new CipherObject("A1", "");
document.getElementById("main_area").insertAdjacentHTML('beforeend', initObj.makeBoxHtml());
cipherObjects.set("A1", initObj);
cipherObjects.get("A1").changeType(CipherType.input);


//URLクエリパラメータ読み込み＋画面更新
if(urlQueryParams != ""){
    urlQueryParams = ")" + urlQueryParams + "(";
    let vec = urlQueryParams.split(")(");

    //全て削除
    cipherObjects.forEach((val, id) => {
        document.getElementById(`box_${id}`).remove();
    });
    cipherObjects.clear();

    for(let i = 1; i < vec.length - 1; i++){
        let obj = new CipherObject();
        let json = {};
        let tmp = vec[i].split(".");
        json["id"] = tmp[0];
        json["fromIdMain"] = tmp[1];
        json["fromIds"] = ([tmp[1]] == ""? [] : [tmp[1]]);
        json["toIds"] = [];
        json["type"] = tmp[2];
        json["separator1"] = ",";
        json["separator2"] = " ";
        json["separator3"] = "\n";
        json["text"] = "";

        option = tmp[3].split("_");
        switch(json.type){
            case "input":
                json["text"] = decodeURI(tmp[3]);
                break;
            case "charcode":
                json["options"] = {"mode": option[0], "code": option[1], "add": option[2] == "T"};
                break;
            case "charIndex":
                json["options"] = {"mode": option[0]};
                break;
            case "morse":
                json["options"] = {"mode": option[0]};
                break;
            case "tenji":
                json["options"] = {"mode": option[0], "type":option[1]};
                break;
            case "twotouch":
                json["options"] = {"mode": option[0]};
                break;
            case "ceaser":
                json["options"] = {"rot": option[0]};
                break;
            case "mikaka":
                json["options"] = {"mode": option[0]};
                break;
            case "strconv":
                console.log(option[0], option[1]);
                json["options"] = {"from": decodeURI(option[0]), "to": decodeURI(option[1])};
                break;
            case "atbash":
                break;
            case "vigenere":
                json["options"] = {"mode": option[0], "key": option[1]};
                break;
            case "polybius":
                json["options"] = {"mode": option[0]};
                break;
            case "reverse":
                break;
            case "split":
                json["options"] = {"mode": option[0], "val": option[1]};
                break;
            case "format":
                json["options"] = {"format": decodeURI(option[0])};
                break;
            case "scytale":
                json["options"] = {"mode": option[0]};
                break;
            case "railfence":
                json["options"] = {"mode": option[0], "rail": option[1]};
                break;
            case "baseconv":
                json["options"] = {"from": option[0], "to": option[1]};
                break;
            case "calc":
                json["options"] = {"exp": decodeURI(option[0])};
                break;
        }
        obj.updateFromJSON(json);
        cipherObjects.set(obj.id, obj);
        document.getElementById('main_area').insertAdjacentHTML('beforeend', obj.makeBoxHtml());
        cipherObjects.get(obj.id).changeType(obj.type, obj.options, false);
    }
    cipherObjects.forEach(e => {
        if(e.fromIdMain != ""){
            cipherObjects.get(e.fromIdMain).toIds.add(e.id);
        }
    });
    updateAllText();
    console.log("url input finished");
}