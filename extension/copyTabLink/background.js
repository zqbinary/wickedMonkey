chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        type: 'normal',
        title: '复制标题链接',
        id: 'menu-1'
    });
});
chrome.commands.onCommand.addListener(function (command) {
    if (command === "copyLink") {
        copyLink()
    }
});

function copyLink() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        if (!tabs.length) {
            return
        }
        let msg = `<a href="${tabs[0]['url']}">${tabs[0]['title']}</a>`
        chrome.tabs.sendMessage(tabs[0].id, {value: msg}, (res) => {
            console.log('消息回执', res)
            if ('ok' === res) {
                chrome.notifications.create({
                    type: 'basic',
                    title: '复制成功',
                    message: `标题为：${tabs[0].title}`,
                    iconUrl: 'icon48.png'
                });
            }
        })
    });

}

chrome.contextMenus.onClicked.addListener(function (data) {
    if (data.menuItemId === 'menu-1') {
        copyLink(data)
    }
})
