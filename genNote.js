const fs = require('fs')
const path = require('path')
let arguments = process.argv.splice(2);
if (!arguments.length) {
    console.log("请输入路径")
    process.exit()
}
const fileFullPath = arguments[0];
let ORIGIN_INFO;
try {
    ORIGIN_INFO = path.parse(fileFullPath)
    console.log(ORIGIN_INFO)
} catch (e) {
    console.log("解析错误", e);
    process.exit(10)
}
const BR = `<div><br></div> `
const BLOCK_START = `<table style=border-collapse:collapse;min-width:100%><col style=width:926px><col style=width:413px>`;
const TR_START = `<tr><td style="width:926px;padding:8px;border:1px solid">`
const TR_END = `</td><td style="width: 413px; padding: 8px; border: 1px solid;"><div><br /></div></td>`
const BLOCK_END = `</tr></tbody></table>`
// const TARGET_DIR = path.join(ORIGIN_INFO['dir'], 'out')
const TARGET_DIR = path.join(ORIGIN_INFO['dir'], '')
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR)
}
function getFormatBody() {
    let content = fs.readFileSync(fileFullPath, 'utf-8')
    const bodyReq = /<body[^>]*>(.*)<\/body>/s
    //取body
    content = (bodyReq.exec(content))[1]
    //替换带格式的代码
    content = content.replaceAll('<pre class=" CodeMirror-line " role="presentation">', '<div>')
    content = content.replaceAll('</pre>', '</div>')
    // content = content.replaceAll('src="assets/', `src="../assets/`)
    //src="assets/ 处理图片
    return content;

}

function getH1Block(content) {
    let blocks = [];
    const blockReq = /<h1(.+?)<\/h1>/g
    let seperators = content.match(blockReq)
    if (!seperators.length || seperators.length === 1) {
        blocks.push(content)
    }
    let block
    for (let i = seperators.length - 1; i >= 0; i--) {
        let seperator = seperators[i];
        [content, block] = content.split(seperator)
        blocks.unshift(seperator + block);
    }
    return blocks;
}

function handleH1Block(content, title) {
    const HTML_START = `<html><title>${title}</title><meta content="text/html;charset=utf-8"http-equiv=Content-Type><meta content="Evernote Windows/308626 (zh-CN, DDL); Windows/10.0.0 (Win64);"name=exporter-version>
<style>*{font-family:微软雅黑;font-size:11pt}h1{color:red;}h2{color:orangered;}img{max-width:100%;}</style>`
    const HTML_END = `</body></html>`
    let output = '';
    const h2Req = /<h2(.+?)<\/h2>/g

    let seperators = content.match(h2Req) || []
    if (!seperators.length || seperators.length === 1) {
        output += BLOCK_START + TR_START + content + TR_END + BLOCK_END;
    }
    let arr = []

    for (let i = seperators.length - 1; i >= 0; i--) {
        let seperator = seperators[i];
        let blockContent = ''
        let block
        [content, block] = content.split(seperator)
        blockContent += BLOCK_START + TR_START
        if (i === 0) {
            blockContent += content + TR_END
                + BLOCK_END + BR + BLOCK_START
                + TR_START + seperator + TR_END
                + handleH3(block)
                + TR_START + TR_END;
        } else {
            blockContent += seperator + TR_END
                + handleH3(block)
        }
        blockContent += TR_START + TR_END + BLOCK_END + BR
        arr.unshift(blockContent)
    }
    output += arr.join()
    output += BR
    let i = 6
    while (i-- > 0) {
        output += BLOCK_START + TR_START + BR + TR_END + BLOCK_END + BR
    }
    output = HTML_START + output + HTML_END;

    const filePath = path.resolve(TARGET_DIR, ORIGIN_INFO['name'] + title + '.html')
    fs.writeFileSync(filePath, output, {encoding: "utf8"})
    console.info("输出文件：", filePath)
}

//对block,h3 进行处理
function handleH3(h3Content) {
    const blockReq = /<h3(.+?)<\/h3>/g
    let seperators = h3Content.match(blockReq) || []
    if (!seperators.length || seperators.length === 1) {
        return TR_START + h3Content + TR_END
    }
    let res = []
    for (let i = seperators.length - 1; i >= 0; i--) {
        let bl;
        let sep = seperators[i];
        [h3Content, bl] = h3Content.split(sep)
        res.unshift(TR_START + sep + BR + bl + TR_END)
    }
    return res.join()
}

function getH1Title(h1Block) {
    //<h1 id='1认识微服务'><span>1.认识微服务</span></h1><p>
    const h1NameReq = /<h1\s+id=["|'](.*?)["|']>/i
    let res = h1Block.match(h1NameReq)
    if (res == null || res.length < 2) {
        return '';
    }
    return res[1];
}

let bodyContent = getFormatBody()
//一个block 一个文件
let h1Blocks = getH1Block(bodyContent)

let h1Block
let i = 0;
while (h1Block = h1Blocks.shift()) {
    let title = "_" + (i++) + "_" + getH1Title(h1Block)
    handleH1Block(h1Block, title);
}





