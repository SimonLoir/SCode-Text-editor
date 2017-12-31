/**
 * 
 * @param {String} language The programming lanugage that you have to use to tokenize the code
 * @param {String} text The code that you want to tokenize
 */
exports.tokenize = function (language, text) {
    if (language == "js" || language == "javascript") {
        return this.tokenizeJs(text);
    }
}
let string = `dsd`;
exports.tokenizeJs = function (text) {

    let tokens = [];
    let buffer = "";
    let breakers = ["|", ';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", ":", "&", " ", "\n", "\r"];
    let bad = [" ", "\n", "\r", "\"", "'", "`"];
    let reserved_keywords = ["abstract", "arguments", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"]
    let strings = ["\"", "'", "`"];    
    let comment = undefined;
    let string = undefined;

    for (let i = 0; i < text.length; i++) {

        let before = text[i - 1];
        let e = text[i];
        let after = text[i + 1];

        if (string == undefined && comment == undefined) {
            if (breakers.indexOf(e) >= 0) {
                if (buffer.trim() != "") {
                    if (reserved_keywords.indexOf(buffer) >= 0) {
                        tokens.push({
                            type: "Keyword",
                            value: buffer
                        });
                    } else {
                        tokens.push({
                            type: "Identifier",
                            value: buffer
                        });
                    }
                }
                if (bad.indexOf(e) < 0) {
                    tokens.push({
                        type: "Punctuator",
                        value: e
                    });
                }
                buffer = "";
            } else {
                let special = undefined;
                if(strings.indexOf(e) >= 0){
                    string = e;
                    special = true;
                }else if(e == "/"){
                    if(after == "*"){
                        special = true;
                        comment = "/*";
                    }else if (after == "/"){
                        special = true;
                        comment = "//";
                    }else{
                        buffer += "/"
                    }
                    console.log(e, i, after, buffer)
                }else{
                    buffer += e;
                }
                console.log(buffer);
                if(special){
                    if (buffer.trim() != "") {
                        if (reserved_keywords.indexOf(buffer) >= 0) {
                            tokens.push({
                                type: "Keyword",
                                value: buffer
                            });
                        } else {
                            tokens.push({
                                type: "Identifier",
                                value: buffer
                            });
                        }
                    }
                    buffer = "";
                }
            }
        }else if (string != undefined){
            //console.log(string)
            if(e == string && before!="\\"){
                string = undefined;
            }
        }else if (comment != undefined){
            if(comment == "//" && (e == "\n" ||e == "\r")){
                comment = undefined;
            }else if (comment == "/*" && e == "/" && before == "*"){
                comment = undefined;
            }
        }

    }

    return tokens;
}

