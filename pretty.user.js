// ==UserScript==
// @name         去广告和格式化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  页面格式化，去广告
// @author       ningxixi
// @match        https://baomidou.com/*
// @match        https://segmentfault.com/a/*
// @match 		 https://router.vuejs.org/*
// @match      https://www.jianshu.com/p/*
// @grant GM_addStyle
// @icon         https://raw.githubusercontent.com/zqbinary/wickedMonkey/master/icons/format.png
// @run-at document-idle
// ==/UserScript==

(function () {
	'use strict';

	const host = location.host;
	const handler = () => {
		switch (host) {
			case 'segmentfault.com':
				document.querySelector("#first-ad").style.display = "none"
				break;
			case 'baomidou.com':
				var keyword = "'我们的广告服务商'";
				var xpath = "//div[contains(text()," + keyword + ")]";
				var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				matchingElement.style.display = "none";
				break;
			case 'router.vuejs.org':
				var clickClose = document.querySelector('#vs-close');
				if (clickClose) {
					clickClose.click()
				}
				break
			case 'www.jianshu.com':
				handlerJianshu()
				break
		}

	}
	function handlerJianshu() {

		//去掉小姨子等
		GM_addStyle('#__next > div._21bLU4._3kbg6I > div > aside > div > div > section:nth-child(1){display:none !important}')

		GM_addStyle('#__next > div._27yofX{display:none !important}')
	}
	setTimeout(handler, 900)

})();