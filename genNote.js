const fs = require('fs')
const path = require('path')
let arguments = process.argv.splice(2);
if (!arguments.length) {
    console.error("请输入路径")
    process.exit()
}

const inputFilePath = arguments[0];
let stat;
try {
    stat = fs.statSync(inputFilePath)
    if (!(stat.isDirectory()) && !(stat.isFile())) {
        console.error("请输入文件夹或文件路径")
        process.exit()
    }
} catch (e) {
    console.error("解析失败")
    process.exit()
}

//todo 如果是文件夹，下面的html,排除 _n_
const BR = `<div><br></div>`
const BLOCK_START = `<table style=border-collapse:collapse;min-width:100%><col style=width:839px><col style=width:413px>`;
const TR_START = `<tr><td style="width:839px;padding:8px;border:1px solid">`
const TR_END = `</td><td style="width: 413px; padding: 8px; border: 1px solid;"><div><br /></div></td>`
const BLOCK_END = `</tr></tbody></table>`


class SearchEngine {


    filesArr = []

    constructor(inputPath) {

        if (stat.isFile()) {
            this.filesArr.push(inputPath)
        }

        if (stat.isDirectory()) {
            this.filesArr = this.fileDisplay(inputPath, this.filesArr);
        }
    }


    fileDisplay(dir, filesArr) {
        if (!fs.statSync(dir).isDirectory()) {
            return filesArr
        }
        for (const filename of fs.readdirSync(dir)) {
            const pathCnt = path.join(dir, filename)
            let stat = fs.statSync(pathCnt)

            if (stat.isFile()) {
                if (this.checkFileName(pathCnt)) {
                    filesArr.push(pathCnt)
                }
            }
            if (stat.isDirectory()) {
                if (this.checkDir(pathCnt)) {
                    filesArr = this.fileDisplay(pathCnt, filesArr)
                }
            }
        }
        return filesArr;
    }

    checkFileName(filename) {
        if (filename.search(".html") === -1) {
            return false
        }
        if (/_(\d)+_/.test(filename)) {
            return false
        }
        return true
    }

    checkDir(dir) {
        if (dir.search("assets") !== -1) {
            return false
        }
        return true
    }
}

class FormatEngine {


    fileInfo;
    filepath;

    constructor(filepath) {
        console.log(filepath)
        this.filepath = filepath
        try {
            this.fileInfo = path.parse(filepath)
        } catch (e) {
            console.log("解析错误", e);
            process.exit(10)
        }
    }

    main() {
        let bodyContent = this.getFormatBody()
        //一个block 一个文件
        let h1Blocks = this.getH1Block(bodyContent)

        let h1Block
        let i = 0;
        while (h1Block = h1Blocks.shift()) {
            let title = "_" + (i++) + "_" + this.getH1Title(h1Block)
            this.handleH1Block(h1Block, title);
        }

    }

    getFormatBody() {
        let content = fs.readFileSync(this.filepath, 'utf-8')
        const bodyReq = /<body[^>]*>(.*)<\/body>/s
        //取body
        content = (bodyReq.exec(content))[1]
        //替换带格式的代码
        content = content.replace(/<pre.*?>/igs, '<div>')
        content = content.replaceAll('</pre>', '</div>')
        //src="assets/ 处理图片
        return content;
    }

    getH1Block(content) {
        let blocks = [];
        const blockReq = /<h1(.+?)<\/h1>/g
        let separators = content.match(blockReq)
        if (!separators || !separators.length || separators.length === 1) {
            blocks.push(content)
            return blocks
        }
        let block
        for (let i = separators.length - 1; i >= 0; i--) {
            let separator = separators[i];
            [content, block] = content.split(separator)
            blocks.unshift(separator + block);
        }
        return blocks;
    }

    handleH1Block(content, title) {
        const HTML_START = `<html><title>${title}</title><meta content="text/html;charset=utf-8"http-equiv=Content-Type><meta content="Evernote Windows/308626 (zh-CN, DDL); Windows/10.0.0 (Win64);"name=exporter-version>
<style>*{font-family:微软雅黑;font-size:11pt}h1{color:red;}h2{color:rebeccapurple;}img{max-width:100%;}</style>`
        const HTML_END = `</body></html>`
        let output = '';
        const h2Req = /<h2(.+?)<\/h2>/g

        let separators = content.match(h2Req) || []
        if (!separators.length || separators.length === 1) {
            output += BLOCK_START + TR_START + content + TR_END + BLOCK_END;
        }
        let arr = []
        let block = ''
        let blockContent = ''
        for (let i = separators.length - 1; i >= 0; i--) {
            let separator = separators[i];
            [content, block] = content.split(separator)
            separator += '<div>正文:</div>'
            blockContent = BLOCK_START + TR_START
            if (i === 0) {
                blockContent += content + TR_END
                    + BLOCK_END + BR + BLOCK_START
                    + TR_START + separator + TR_END
                    + this.handleH3(block)
                    + TR_START + TR_END;
            } else {
                blockContent += separator + TR_END
                    + this.handleH3(block)
            }
            blockContent += TR_START + TR_END + BLOCK_END + BR
            arr.unshift(blockContent)
        }
        output += arr.join(BR)
        output += BR
        let i = 6
        while (i-- > 0) {
            output += BLOCK_START + TR_START + BR + TR_END + BLOCK_END + BR
        }
        output = HTML_START + output + HTML_END;

        const filePath = path.resolve(this.fileInfo['dir'], this.fileInfo['name'] + title + '.html')
        fs.writeFileSync(filePath, output, {encoding: "utf8"})
        console.info("输出文件：", filePath)
    }

//对block,h3 进行处理
    handleH3(h3Content) {
        const blockReq = /<h3(.+?)<\/h3>/g
        let separators = h3Content.match(blockReq) || []
        if (!separators.length || separators.length === 1) {
            return TR_START + h3Content + TR_END
        }
        let res = []
        for (let i = separators.length - 1; i >= 0; i--) {
            let bl;
            let sep = separators[i];
            [h3Content, bl] = h3Content.split(sep)
            res.unshift(TR_START + sep + BR + bl + TR_END)
        }
        return res.join("")
    }

    getH1Title(h1Block) {
        const h1NameReq = /<h1\s+id=["|'](.*?)["|']>/i
        let res = h1Block.match(h1NameReq)
        if (res == null || res.length < 2) {
            return '';
        }
        return res[1];
    }

}

function main() {
    let searchEngine = new SearchEngine(inputFilePath)
    let fileArr = searchEngine.filesArr
    for (let i = 0; i < fileArr.length; i++) {
        let engine = new FormatEngine(fileArr[i]);
        engine.main();
    }
}

main()






