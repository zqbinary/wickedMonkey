// ==UserScript==
// @name         自动跳转
// @version      1.0
// @description  网站默认跳转  支持 掘金，知乎
// @author       宁西西
// @match        https://link.zhihu.com/*
// @match        https://www.jianshu.com/go-wild*
// @match        https://link.juejin.cn/*
// @grant        none
// @icon         https://raw.githubusercontent.com/zqbinary/icons/53cb0c68ee5fbd05a1719e52b4e544ed5e9f5341/jumper.png
// ==/UserScript==

(function () {
    'use strict';
    setInterval(function () {
        redirect();
    }, 300);

    const host = location.host

    function redirect() {
        switch (host) {
            case 'link.zhihu.com':
                jump("a.button", "继续访问")
                break
            case 'www.jianshu.com':
                jump("div._3OuyzjzFBDdQwRGk08HXHz_0", "继续前往")
                break
            case 'link.juejin.cn':
                jump("button.btn")
                break

        }
    }

    function jump(selector, text = '继续') {
        const dom = document.querySelector(selector)
        if (dom && dom.innerText && dom.innerText.includes(text)) {
            dom.click()
        }
    }
    /**example
	 * @test1
	 * https://www.jianshu.com/go-wild?ac=2&url=https%3A%2F%2Fnodejs.org%2Fdist%2Flatest-v6.x%2Fdocs%2Fapi%2Fhttp.html%23http_class_http_incomingmessage
	 * @test2
	 * https://link.zhihu.com/?target=http://www.dayanzai.me/
	 * @test3
	 * https://link.juejin.cn/?target=https%3A%2F%2Fpnpm.io%2Finstallation
	 */
})();