// ==UserScript==
// @name         阅读增强
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  去广告，格式化，菜单复制
// @author       宁西西
// @match        https://baomidou.com/*
// @match        https://segmentfault.com/*
// @match        https://segmentfault.com/a/1190000040335988
// @match        https://router.vuejs.org/*
// @match        https://www.jianshu.com/p/*
// @match        https://juejin.cn/post/*
// @match        https://blog.csdn.net/*/article/details/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @icon         https://raw.githubusercontent.com/zqbinary/wickedMonkey/master/icons/format.png
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const host = location.host;
    const handlerBaoMiDou = ()=>{
        let keyword = "'我们的广告服务商'";
        let xpath = "//div[contains(text(),"+keyword+")]";
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        matchingElement.style.display="none";
    }
    const handlerRouterVueJsOrg = ()=>{
        let clickClose = document.querySelector('#vs-close');
        if(clickClose) {
            clickClose.click()
        }

    }
    const handler = ()=>{
        switch(host) {
            case 'segmentfault.com':
                document.querySelector("#first-ad").style.display="none"
                break;
            case 'baomidou.com':
                handlerBaoMiDou()
                break;
            case 'router.vuejs.org':
                handlerRouterVueJsOrg()
                break;
            case 'www.jianshu.com':
                //去掉小姨子等
                GM_addStyle('#__next > div._21bLU4._3kbg6I > div > aside > div > div > section:nth-child(1){display:none !important}')
                GM_addStyle('#__next > div._27yofX{display:none !important}')
                GM_addStyle('#__next > div._21bLU4._3kbg6I > div > aside > div{display:none !important}')
                break;

            case 'juejin.cn':
                //去掉代码number
                GM_addStyle('.hljs-number{display:none !important;}')
                break;
            case 'blog.csdn.net':
                GM_addStyle('.hljs-ln-numbers{display:none !important}')
                break
        }
    }

    setTimeout(handler, 801);
    function collectMenu() {
        let arr = [];
        document.querySelectorAll("toc outline").forEach(item=>{
            let level= item.className.slice(-1) || 1
            level--
            let content = ''.padEnd(level*2,' ') + item.innerText

            //h1 多空一行
            if(level===0) {
                arr.push('*************')
                arr.push(content)
                arr.push('*************')
            } else {
                arr.push(content)

            }
        })
        if(!arr.length) {
            return GM_notification("请配合简悦食用，打开菜单")
        }
        GM_setClipboard(arr.join('\n'))
    }

    GM_registerMenuCommand("复制菜单",collectMenu)
})();