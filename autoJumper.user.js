// ==UserScript==
// @name         继续访问
// @version      1.0
// @description  网站默认跳转,支持知乎，简书，掘金
// @author       ningxixi
// @match        https://link.zhihu.com/*
// @match        https://www.jianshu.com/go-wild*
// @match        https://link.juejin.cn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    setTimeout(function () {
        redirect();
    }, 1000);

    const host = location.host
    console.log('hhh',host)
    function redirect(){
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
        if (dom && dom.innerText.includes(text)) {
            dom.click()
        }
    }
    /**
	 * @test1
	 * https://www.jianshu.com/go-wild?ac=2&url=https%3A%2F%2Fnodejs.org%2Fdist%2Flatest-v6.x%2Fdocs%2Fapi%2Fhttp.html%23http_class_http_incomingmessage
	 * @test2
	 * https://link.zhihu.com/?target=http://www.dayanzai.me/
	 * @test3
	 * https://link.juejin.cn/?target=https%3A%2F%2Fpnpm.io%2Finstallation
	 */
})();