// ==UserScript==
// @name        laravel 中国 格式化
// @namespace   Violentmonkey Scripts
// @match       https://laravelacademy.org/*
// @grant    GM_addStyle
// @version     1.0
// @author      -
// @description 2021/11/5 下午2:21:51
// ==/UserScript==
(function () {

    function removeDiv(className) {
        const lis = document.getElementsByClassName(className)
        while (lis.length > 0) {
            lis[0].parentNode.removeChild(lis[0])
        }
    }

    function changeStyle(selector, key, value, flag = '') {
        const lis = document.querySelectorAll(selector);
        if (!lis.length) {
            return
        }
        for (let i = 0; i < lis.length; i++) {
            lis[i].style.setProperty(key, value, flag);
        }

    }

    function main() {
        let css = 'h1 { font-size: 20px;font-weight:700;}h2 { font-size: 18px;font-weight:700;}h3 { font-size: 16px;font-weight:700;}h4 { font-size: 15px;font-weight:700;}'
        GM_addStyle(css)
        removeDiv("CodeMirror-linenumber")
        removeDiv("CodeMirror-gutters")
        changeStyle(".CodeMirror-sizer", "margin-left", 0);
        changeStyle(".page-content", "font-size", '14px', 'important');
        changeStyle(".page-content p, .page-content ul, .page-content ol", "font-size", '14px');
    }

    setTimeout(main, 100)
})()
