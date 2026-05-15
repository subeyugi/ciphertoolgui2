document.getElementById("main_area").addEventListener("mousedown", (e) =>{
    let col = Math.floor((e.offsetX - gridStartLeft) / gridWidth);
    let row = Math.floor((e.offsetY - gridStartTop) / gridHeight);
});

function typeChanged(id){
    let type = parseInt(document.getElementById(`sel_${id}`).value);
    cipherObjects.get(id).changeType(type);
}

function boxClicked(){
    
}

const textarea1 = document.getElementById('input_text');
const textarea2 = document.getElementById('output_text');

// ResizeObserverのインスタンスを作成
const resizeObserver = new ResizeObserver(entries => {
    // リサイズされた要素の寸法を取得
    const { width, height } = entries[0].contentRect;
    document.getElementById("input_text").style.height = `${height+2}px`;
    document.getElementById("output_text").style.height = `${height+2}px`;
    document.getElementById("top_io_bar").style.height = `${height + 85}px`;
});

// 監視を開始
resizeObserver.observe(textarea1);
resizeObserver.observe(textarea2);