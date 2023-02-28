// ==UserScript==
// @name        xuejava
// @namespace   Violentmonkey Scripts
// @match       https://www.liaoxuefeng.com/wiki/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      -
// @description 2021/11/20 下午5:17:44
// ==/UserScript==
(function () {
	function addDiv() {
		let btn = document.createElement('div');
		btn.innerText = "左侧菜单"
		btn.style = "height: 20px;width: 80px;background: #ccc;position: fixed;top: 100px;right: 10px;"
		btn.onclick = handleLeftColumn;
		document.body.appendChild(btn);
	}

	function setLeftColumn(isHiden) {
		let leftColumn = document.querySelector('.x-sidebar-left');
		if (isHiden) {
			leftColumn.style.display = "none"
			GM_setValue("hideMenu", 1);
		} else {
			leftColumn.style.display = "";
			GM_setValue("hideMenu", 0);
		}
	}
	function removeAds() {
		const ad1 = Array.from(document.querySelectorAll('#x-content > h3')).find(el => el.textContent == '读后有收获可以支付宝请作者喝咖啡，读后有疑问请加微信群讨论：');
		if (!ad1) {
			return;
		}
		let ads = [ad1];
		const nextCount = 5;
		let i = 1;
		while (i < nextCount) {
			ads.push(ads[ads.length - 1].nextSibling);
			i++;
		}
		i = 0;
		while (i < nextCount) {
			ads.pop().remove()
			i++;
		}
	}
	function handleLeftColumn() {
		setLeftColumn(1 - GM_getValue("hideMenu", 1))
	}
	function register() {
		setLeftColumn(GM_getValue("hideMenu", 1))
		removeAds();
		addDiv();
	}


	onload = function () {
		register();
	}
}
)()