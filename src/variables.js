let idSet = new Set();
let cipherObjects = new Map();
let inputId = 'A1', inputText = '';
let outputId = 'A1', outputText = '';
let lines = [];
let types = [];
let splitChars = [',', '/', '\n'];
let dragIds = [];

let gridStartTop = 40;
let gridStartLeft = 50;
let gridHeight = 140;
let gridWidth = 200;
let gridRowCount = 10;
let gridColumnCount = Math.floor((window.innerWidth - gridStartLeft) / gridWidth);
let nowSelectId = "A1";
let ctrlPressed = false;
let selectFromId = undefined;
let sep1 = ',', sep2 = ' ', sep3 = '\n';
