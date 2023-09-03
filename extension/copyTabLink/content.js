async function copyLink(link) {
    // 安全域包括本地访问与开启TLS安全认证的地址，如 https 协议的地址、127.0.0.1 或 localhost 。
    if (navigator && navigator.clipboard) {
        return navigator.clipboard.write([new ClipboardItem({
            'text/html': new Blob([link], {type: 'text/html'})
        })])
    }

    // 创建一个包含富文本的元素，例如一个包含超链接的 <div>
    const richTextElement = document.createElement('div');
    richTextElement.innerHTML = link

    // 将富文本元素添加到页面中，以便能够执行 execCommand
    document.body.appendChild(richTextElement);

    // 创建一个选区并选择富文本元素
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(richTextElement);
    selection.removeAllRanges();
    selection.addRange(range);

    return new Promise((res, rej) => {
        // 执行复制命令并移除文本框
        document.execCommand('copy') ? res() : rej()
        textArea.remove()
    })


}


chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    //一定要回应，不然报错:
    //Unchecked runtime.lastError: The message port closed before a response was received.
    sendResponse("received")
    copyLink(message.value).then(() => {
        console.log('pasted')
    }).catch((error) => {
        console.log('not pasted', error)
    })

});

