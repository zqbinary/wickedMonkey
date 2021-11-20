// ==UserScript==
// @name        xuejava
// @namespace   Violentmonkey Scripts
// @match       https://www.liaoxuefeng.com/wiki/*
// @grant       none
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
	function handleLeftColumn() {
		let leftColumn = document.querySelector('.x-sidebar-left');
		if (leftColumn.style.display === "none") {
			leftColumn.style.display = "";
		} else if (["block", ""].includes(leftColumn.style.display)) {
			leftColumn.style.display = "none"
		}
	}
	function register() {
		handleLeftColumn()
	}

	onload = function () {
		addDiv();
		register();
	}
}
)()