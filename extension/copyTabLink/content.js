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

        selection.removeAllRanges();
        document.body.removeChild(richTextElement);
    })


}

// 获取图像 Blob
function getImageBlob(url, callback) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            callback(blob);
        })
        .catch(error => {
            console.error("获取图像 Blob 失败：", error);
        });
}

// 将图像 Blob 复制到剪贴板
function copyImageBlobToClipboard(blob) {
    navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }) // 将 Blob 添加到 ClipboardItem 中
    ]).then(function() {
        console.log("已成功复制图像 Blob 到剪贴板");
    }).catch(function(error) {
        console.error("复制图像 Blob 到剪贴板失败：", error);
    });
}

function handleCopyImg(imageUrl) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // canvas.width = 100
    // canvas.height = 100
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.clearRect(0, 0);
        ctx.drawImage(img, 0, 0);
        // 将canvas转为blob
        canvas.toBlob(async blob => {
            console.log(blob);
            const data = [
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ];
            // https://w3c.github.io/clipboard-apis/#dom-clipboard-write
            await navigator.clipboard.write(data)
                .then(
                    () => {
                        console.log("Copied to clipboard successfully!");
                    },
                    (e) => {
                        console.error("Unable to write to clipboard.", e);
                    }
                );
        });
    }

}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    //一定要回应，不然报错:
    //Unchecked runtime.lastError: The message port closed before a response was received.
    if (message.action === 'copyImage') {
        // handleCopyImg(message.value)
        getImageBlob(message.value, function(blob) {
            copyImageBlobToClipboard(blob);
        });

        sendResponse("received")
    }
    if (message.action === 'copyLink') {
        copyLink(message.value).then(() => {
            console.log('pasted')
        }).catch((error) => {
            console.log('not pasted', error)
        })
        sendResponse("received")
    }
});

