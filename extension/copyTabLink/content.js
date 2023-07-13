async function copyLink(link) {
    return navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([link], {type: 'text/html'})
    })])
}


chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    sendResponse("received")
    copyLink(message.value).then(() => {
        sendResponse("ok")
        console.log('pasted')
    }).catch(
        (error) => {
            sendResponse("fail:")
            console.log('not pasted', error)
        }
    )

});

