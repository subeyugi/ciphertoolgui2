let gridStartTop = 40;
let gridStartLeft = 50;
let gridHeight = 140;
let gridWidth = 200;
let gridRowCount = 20;
let gridColumnCount = 9;
let inputId = "A1";
let outputId = "A1";

let cipherObjects = new Map();

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

//方眼の表示
let grid = document.getElementById('main_area');
for(let i = 0; i < gridColumnCount + 1; i++){
    grid.insertAdjacentHTML('beforeend', `<div class="gridline_vertical" style="top:${gridStartTop}px; left:${gridStartLeft + gridWidth * i}px; height:${gridHeight * gridRowCount}px"></div>`);
    if(i > 0){
        grid.insertAdjacentHTML('beforeend', `<div class="scale" style="top:${gridStartTop - 30}px; left:${gridStartLeft + gridWidth * (i - 0.5)}px">${String.fromCharCode(64 + i)}</div>`);
    }
}

for(let i = 0; i < gridRowCount + 1; i++){
    grid.insertAdjacentHTML('beforeend', `<div class="gridline_horizontal" style="top:${gridStartTop + gridHeight * i}px; left:${gridStartLeft}px; width:${gridWidth * gridColumnCount - 10}px"></div>`);
    if(i > 0){
        grid.insertAdjacentHTML('beforeend', `<div class="scale" style="left:${gridStartLeft - 30}px; top:${gridStartTop + gridHeight * (i - 0.5) - 10}px">${i}</div>`);
    }
}

//初期boxを作成
let initObj = new CipherObject("A1", "");
document.getElementById("main_area").insertAdjacentHTML('beforeend', initObj.makeBoxHtml());
cipherObjects.set("A1", initObj);
cipherObjects.get("A1").changeType(CipherType.input);
