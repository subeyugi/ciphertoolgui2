const ErrorIndication = {
    none: 0,
    original: 1,
    space: 2,
    brackets: 3,
}
let errorType = ErrorIndication.brackets;

//エラー表示する文字列をかっこで囲む
function getErrorStr(s){
    switch(errorType){
        case ErrorIndication.none:
            return ``
        case ErrorIndication.original:
            return s
        case ErrorIndication.space:
            return ` ${s} `
        case ErrorIndication.brackets:
            return `[${s}]`
    }
}