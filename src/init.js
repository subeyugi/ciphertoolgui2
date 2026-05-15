let gridStartTop = 40;
let gridStartLeft = 50;
let gridHeight = 140;
let gridWidth = 200;
let gridRowCount = 10;
let gridColumnCount = 9;

let cipherObjects = new Map();

function toAddress(col, row){
    return String.fromCharCode(65 + col) + (row + 1);
}

function address2CR(id){
    let col = id.charCodeAt(0) - 65;
    let row = parseInt(id.substring(1, id.length)) - 1;
    return [col, row];
}

function address2XY(id){
    let [col, row] = address2CR(id);
    console.log(id, col, row);
    let x = col * gridWidth + gridStartLeft;
    let y = row * gridHeight + gridStartTop;
    return [x, y];
}

let grid = document.getElementById('background_grid');
for(let i = 0; i < gridColumnCount + 1; i++){
    grid.insertAdjacentHTML('beforeend', `<div class="gridline_vertical" style="top:${gridStartTop}px; left:${gridStartLeft + gridWidth * i}px; height:${gridHeight * gridRowCount}"></div>`);
    if(i > 0){
        grid.insertAdjacentHTML('beforeend', `<div class="scale" style="top:${gridStartTop - 30}px; left:${gridStartLeft + gridWidth * (i - 0.5)}">${String.fromCharCode(64 + i)}</div>`);
    }
}

for(let i = 0; i < gridRowCount + 1; i++){
    grid.insertAdjacentHTML('beforeend', `<div class="gridline_horizontal" style="top:${gridStartTop + gridHeight * i}px; left:${gridStartLeft}px; width:${gridWidth * gridColumnCount}"></div>`);
    if(i > 0){
        grid.insertAdjacentHTML('beforeend', `<div class="scale" style="left:${gridStartLeft - 30}px; top:${gridStartTop + gridHeight * (i - 0.5)}">${i}</div>`);
    }
}

/* let tmp = new CipherObject("A1", undefined);
document.getElementById("main_area").insertAdjacentHTML('beforeend', tmp.makeBoxHtml());
cipherObjects.set("A1", tmp);
console.log(tmp) */