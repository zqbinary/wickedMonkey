// ==UserScript==
// @name         mybatis-plus 去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://baomidou.com/*
// @icon         https://www.google.com/s2/favicons?domain=baomidou.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    docReady(function () {
        setTimeout(function () {
            var keyword = "'我们的广告服务商'";
            var xpath = "//div[contains(text()," + keyword + ")]";
            var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            matchingElement.style.display = "none";

        }, 3001);
    });

})();