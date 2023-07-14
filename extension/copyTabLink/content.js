async function copyLink(link) {
    return navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([link], {type: 'text/html'})
    })])
}


chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    //一定要回应，不然报错:
    //Unchecked runtime.lastError: The message port closed before a response was received.
    sendResponse("received")
    copyLink(message.value).then(() => {
        console.log('pasted')
    }).catch(
        (error) => {
            console.log('not pasted', error)
        }
    )

});

