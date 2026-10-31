function convertArray(vec, format){
    let sep = format.split(":");
    let dim = 0;
    for(let i = 0; i < 2; i++){
        if(vec.length == 1){
            vec = vec[0];
            dim++;
        }else{
            break;
        }
    }

    if(sep.length == 1){
        vec = vec[parseInt(sep[0])];
        for(let i = 0; i <= dim; i++){
            vec = [vec];
        }
        return new ConverterResult(vec, "");
    }if(sep.length == 2){
        let l = sep[0];
        let r = sep[1];
        if(l == "") l = 0;
        if(r == "") r = vec.length;

        if(isNaN(l)) return new ConverterResult("", "フォーマットが誤っています");
        if(isNaN(r)) return new ConverterResult("", "フォーマットが誤っています");
        l = parseInt(l);
        r = parseInt(r);
        if(l < 0) l = vec.length + parseInt(l);
        if(r < 0) r = vec.length + parseInt(r);
        vec = vec.slice(l, r);
        for(let i = 0; i < dim; i++){
            vec = [vec];
        }
        return new ConverterResult(vec, "");
    }else{
        return new ConverterResult("", "フォーマットが誤っています");
    }
}