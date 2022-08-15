// ==UserScript==
// @name         去广告和格式化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去掉简书热门故事
// @author       宁西西
// @match        https://baomidou.com/*
// @match        https://segmentfault.com/*
// @match        https://segmentfault.com/a/1190000040335988
// @match        https://router.vuejs.org/*
// @match        https://www.jianshu.com/p/*
// @grant        GM_addStyle
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

        }
    }

    setTimeout(handler, 801);

})();